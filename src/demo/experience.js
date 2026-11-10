import { cars } from "./inventory";
import { read, write, loadArray } from "./storage";
export function initializeExperience(container) {
  let city = read("mono-city") || "Cape Town",
    context = { purpose: "", days: 0, budget: 0 },
    selected = null;
  let requests = loadArray("mono-requests");
  let listings = loadArray("mono-listings");
  const $ = (id) => document.getElementById(id);
  const esc = (s) =>
    String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  function enter(v) {
    $("landing").classList.add("hidden");
    $("app").classList.remove("hidden");
    showView(v);
    history.replaceState({}, "", "#" + v);
    window.scrollTo(0, 0);
  }
  function goHome() {
    $("app").classList.add("hidden");
    $("landing").classList.remove("hidden");
    history.replaceState({}, "", location.pathname);
  }
  function showView(v) {
    history.replaceState({}, "", "#" + v);
    ["chat", "bookings", "owner", "store"].forEach((x) =>
      $("nav-" + x).classList.toggle("active", v === x),
    );
    $("chat-view").classList.toggle("hidden", v !== "chat");
    $("panel-view").classList.toggle("hidden", v === "chat");
    $("view-title").textContent = {
      chat: "Your concierge",
      bookings: "Your rental requests",
      owner: "Owner workspace",
      store: "Your storefront",
    }[v];
    if (v !== "chat") renderPanel(v);
  }
  function changeLocation() {
    let c = prompt("Which city are you looking in?", city);
    if (c && c.trim()) {
      city = c.trim();
      write("mono-city", city);
      $("city-label").textContent = city;
      append(
        "assistant",
        `I'll use ${city} as your preferred search location. This demo currently has sample vehicles only in Cape Town.`,
      );
    }
  }
  $("city-label").textContent = city;
  function append(who, msg) {
    $("suggestions")?.classList.add("hidden");
    let el = document.createElement("div");
    el.className = "message " + (who === "user" ? "user" : "");
    el.innerHTML =
      (who === "assistant" ? '<div class="avatar">✳</div>' : "") +
      '<div class="bubble">' +
      esc(msg) +
      "</div>";
    $("thread").appendChild(el);
    $("scroll").scrollTop = $("scroll").scrollHeight;
  }
  function suggest(s) {
    $("prompt").value = s;
    send(new Event("submit"));
  }
  function send(e) {
    e.preventDefault();
    let s = $("prompt").value.trim();
    if (!s) return;
    $("prompt").value = "";
    append("user", s);
    let low = s.toLowerCase();
    if (/\b(\d+)\s*(day|days|night|nights)\b/.test(low))
      context.days = Number(
        low.match(/\b(\d+)\s*(day|days|night|nights)\b/)[1],
      );
    let budget = low.match(/(?:r\s?|zar\s?)(\d[\d,]*)/i);
    if (budget) context.budget = Number(budget[1].replaceAll(",", ""));
    if (/wedding|business|weekend|holiday|airport|road trip/.test(low))
      context.purpose = low.match(
        /wedding|business|weekend|holiday|airport|road trip/,
      )[0];
    if (/\b(book|reserve|request)\b/.test(low) && selected) {
      booking(selected);
      return;
    }
    let matched = cars.filter(
      (c) => !context.budget || c.price <= context.budget,
    );
    if (/suv|4x4/.test(low))
      matched = matched.filter((c) => c.type.toLowerCase().includes("suv"));
    else if (/bmw|audi|toyota|range rover/.test(low))
      matched = matched.filter((c) =>
        low.includes(c.name.toLowerCase().split(" ")[0]),
      );
    else if (/cheap|affordable|budget|economy/.test(low))
      matched = matched.filter((c) => c.price < 1000);
    else if (/luxury|premium|wedding|business/.test(low))
      matched = matched.filter((c) => c.price >= 1300);
    if (city.toLowerCase() !== "cape town") {
      append(
        "assistant",
        `We don't have live inventory in ${city} yet. The sample vehicles below are Cape Town examples, not available cars in your location.`,
      );
    } else
      append(
        "assistant",
        matched.length
          ? `Here are some sample matches${context.purpose ? " for your " + context.purpose : ""}. What dates will you need the car? You can open a vehicle to create a demo booking request.`
          : "I couldn’t find a sample vehicle within those preferences. Try another budget or vehicle category.",
      );
    if (matched.length) renderCars(matched);
  }
  function renderCars(items) {
    let wrap = document.createElement("div");
    wrap.className = "results";
    wrap.innerHTML = items
      .map(
        (c) =>
          `<div class="vehicle"><img alt="${esc(c.name)}" src="${c.img}" loading="lazy"/><div class="vehicle-info"><strong>${esc(c.name)}</strong><div class="muted">${esc(c.type)} · ${esc(c.area)}</div><div class="vehicle-bottom"><b>R${c.price.toLocaleString()}/day</b><button class="smallbtn" data-action="booking" data-id="${c.id}">Request ↗</button></div></div></div>`,
      )
      .join("");
    $("thread").appendChild(wrap);
    $("scroll").scrollTop = $("scroll").scrollHeight;
  }
  function booking(id) {
    selected = id;
    let c = cars.find((c) => c.id === id);
    document.querySelector(".booking")?.remove();
    let box = document.createElement("div");
    box.className = "booking";
    box.innerHTML = `<strong>Request ${esc(c.name)}</strong><p class="muted">Demo request only. No payment or actual reservation will be made.</p><form data-action="submitBooking" data-id="${id}"><label for="field-start">Pickup date</label><input id="field-start" name="start" type="date" required min="${new Date().toLocaleDateString("en-CA")}"/><label for="field-end">Return date</label><input id="field-end" name="end" type="date" required/><label for="field-email">Your email</label><input id="field-email" name="email" type="email" placeholder="you@example.com" required/><button class="smallbtn">Save booking request →</button></form>`;
    $("thread").appendChild(box);
    $("scroll").scrollTop = $("scroll").scrollHeight;
  }
  function submitBooking(e, id) {
    e.preventDefault();
    let f = new FormData(e.target),
      start = f.get("start"),
      end = f.get("end");
    if (start < new Date().toLocaleDateString("en-CA") || end <= start) {
      alert("Return date must be after pickup date.");
      return;
    }
    let c = cars.find((c) => c.id === id);
    let days = Math.round((new Date(end) - new Date(start)) / 86400000);
    requests.push({
      id: Date.now(),
      car: c.name,
      start,
      end,
      email: f.get("email"),
      total: days * c.price,
      status: "Demo request — not submitted",
    });
    write("mono-requests", JSON.stringify(requests));
    e.target.closest(".booking").remove();
    append(
      "assistant",
      `Your demo request for the ${c.name} (${start} to ${end}) is saved locally. Estimated base rental: R${(days * c.price).toLocaleString()} before any fees or deposits. No provider has been notified and no booking is confirmed.`,
    );
  }
  function renderPanel(v) {
    let p = $("panel-view");
    if (v === "bookings") {
      p.innerHTML =
        '<div class="eyebrow" style="color:#777">YOUR ACTIVITY</div><h1>Rental requests</h1><p class="muted">Saved locally in this browser. These are not actual reservations.</p>' +
        (!requests.length
          ? '<div class="formcard">No requests yet. Ask your concierge to find a car.</div>'
          : requests
              .map(
                (r) =>
                  `<div class="formcard" style="margin-bottom:12px"><strong>${esc(r.car)}</strong><p class="muted">${esc(r.start)} → ${esc(r.end)} · R${r.total.toLocaleString()}</p><span class="muted">${esc(r.status)}</span></div>`,
              )
              .join(""));
      return;
    }
    if (v === "owner") {
      p.innerHTML = `<div class="eyebrow" style="color:#777">BUSINESS PORTAL</div><h1>Your fleet. One place.</h1><p class="muted">Set up a sample rental storefront and manage demo listings.</p><div class="statgrid"><div class="stat"><span>Vehicles listed</span><b>${listings.length}</b></div><div class="stat"><span>Actual bookings</span><b>0</b></div><div class="stat"><span>Demo requests</span><b>${requests.length}</b></div></div><div class="formcard"><strong>Add a vehicle</strong><form data-action="addListing"><label class="field" for="field-name">Vehicle name</label><input id="field-name" name="name" required placeholder="e.g. Mercedes-Benz C-Class"/><label class="field" for="field-price">Price per day (ZAR)</label><input id="field-price" name="price" type="number" min="1" required placeholder="1200"/><label class="field" for="field-area">Pickup area</label><input id="field-area" name="area" required placeholder="e.g. Waterfront"/><button class="smallbtn">Add demo listing ↗</button></form><p class="notice">Production onboarding will require business verification, vehicle documents, insurance details and payout setup.</p></div>`;
      return;
    }
    p.innerHTML = `<div class="eyebrow" style="color:#777">YOUR DIGITAL SHOWROOM</div><h1>A storefront of your own.</h1><p class="muted">Preview your demo rental storefront. Custom domains and public publishing are not enabled.</p><div class="formcard"><div class="eyebrow" style="color:#888">MONO / PARTNER</div><h2 style="font:600 32px Manrope;letter-spacing:-1px">Your Rental Collection</h2><p class="muted">Cape Town · Curated vehicles for every journey</p>${listings.length ? listings.map((l) => `<div style="padding:14px 0;border-top:1px solid #eee"><strong>${esc(l.name)}</strong><p class="muted">${esc(l.area)} · R${Number(l.price).toLocaleString()}/day</p></div>`).join("") : '<p class="notice">Add your first vehicle in the owner workspace to preview it here.</p>'}</div>`;
  }
  function addListing(e) {
    e.preventDefault();
    let f = new FormData(e.target);
    listings.push({
      name: f.get("name"),
      price: Number(f.get("price")),
      area: f.get("area"),
    });
    write("mono-listings", JSON.stringify(listings));
    renderPanel("owner");
  }
  const initial = location.hash.slice(1);
  if (["app", "chat", "owner", "bookings", "store"].includes(initial))
    enter(initial === "app" ? "chat" : initial);

  const click = (event) => {
    const button = event.target.closest('[data-action="booking"]');
    if (button) booking(Number(button.dataset.id));
  };
  const submit = (event) => {
    const form = event.target;
    if (form.dataset.action === "submitBooking")
      submitBooking(event, Number(form.dataset.id));
    if (form.dataset.action === "addListing") addListing(event);
  };
  container.addEventListener("click", click);
  container.addEventListener("submit", submit);
  return {
    enter,
    goHome,
    showView,
    changeLocation,
    suggest,
    send,
    dispose() {
      container.removeEventListener("click", click);
      container.removeEventListener("submit", submit);
    },
  };
}
