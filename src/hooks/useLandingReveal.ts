import { useEffect } from "react";

export function useLandingReveal(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const landing = document.querySelector<HTMLElement>("#landing");
    if (!landing) return;
    landing.setAttribute("data-reveal-ready", "");

    const items = Array.from(
      landing.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let frame = 0;
    const updateProgress = () => {
      frame = 0;
      const max = Math.max(1, landing.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / max));
      landing.style.setProperty("--landing-scroll", String(progress));
    };
    const scheduleProgress = () => {
      if (!frame) frame = requestAnimationFrame(updateProgress);
    };

    if (reduced) items.forEach((item) => item.setAttribute("data-visible", ""));
    const observer = reduced
      ? null
      : new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (!entry.isIntersecting) continue;
              entry.target.setAttribute("data-visible", "");
              observer?.unobserve(entry.target);
            }
          },
          { rootMargin: "0px 0px -9%", threshold: 0.1 },
        );
    observer && items.forEach((item) => observer.observe(item));

    updateProgress();
    window.addEventListener("scroll", scheduleProgress, { passive: true });
    window.addEventListener("resize", scheduleProgress);
    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", scheduleProgress);
      window.removeEventListener("resize", scheduleProgress);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [active]);
}
