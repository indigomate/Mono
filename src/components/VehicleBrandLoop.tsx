import { useEffect, useRef, useState } from "react";
import type LogoLoopComponent from "./react-bits/LogoLoop/LogoLoop";
import "./vehicle-brand-loop.css";

const brands = [
  { src: "/brands/audi.svg", alt: "Audi", title: "Audi" },
  { src: "/brands/bmw.svg", alt: "BMW", title: "BMW" },
  { src: "/brands/toyota.svg", alt: "Toyota", title: "Toyota" },
  { src: "/brands/volkswagen.svg", alt: "Volkswagen", title: "Volkswagen" },
  { src: "/brands/ford.svg", alt: "Ford", title: "Ford" },
  { src: "/brands/honda.svg", alt: "Honda", title: "Honda" },
  { src: "/brands/hyundai.svg", alt: "Hyundai", title: "Hyundai" },
  { src: "/brands/nissan.svg", alt: "Nissan", title: "Nissan" },
  { src: "/brands/kia.svg", alt: "Kia", title: "Kia" },
  { src: "/brands/mazda.svg", alt: "Mazda", title: "Mazda" },
  { src: "/brands/volvo.svg", alt: "Volvo", title: "Volvo" },
];

export function VehicleBrandLoop() {
  const root = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [paused, setPaused] = useState(false);
  const [focused, setFocused] = useState(false);
  const [LogoLoop, setLogoLoop] = useState<typeof LogoLoopComponent | null>(
    null,
  );
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    media.addEventListener("change", update);
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setVisible(true);
        observer.disconnect();
      }
    });
    if (root.current) observer.observe(root.current);
    return () => {
      media.removeEventListener("change", update);
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    if (!visible || reduced || LogoLoop) return;
    let active = true;
    import("./react-bits/LogoLoop/LogoLoop")
      .then((module) => {
        if (active) setLogoLoop(() => module.default);
      })
      .catch(() => {
        /* Static logos remain available. */
      });
    return () => {
      active = false;
    };
  }, [visible, reduced, LogoLoop]);
  return (
    <section
      ref={root}
      className="vehicle-brand-band"
      aria-labelledby="vehicle-brand-title"
    >
      <header>
        <div>
          <span className="eyebrow" id="vehicle-brand-title">
            EXPLORE CAR BRANDS
          </span>
          <p>Familiar names from across the rental world.</p>
        </div>
      </header>
      <div
        className="vehicle-brand-loop"
        role="group"
        aria-label="Car brand animation"
        tabIndex={!reduced && LogoLoop ? 0 : undefined}
        aria-describedby="brand-motion-help"
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null))
            setFocused(false);
        }}
        onKeyDown={(e) => {
          if (e.key === " " && e.target === e.currentTarget) {
            e.preventDefault();
            setPaused((value) => !value);
          }
        }}
      >
        <span id="brand-motion-help" className="sr-only">
          Hover or focus to pause. Press Space to toggle automatic scrolling; it
          remains paused while focused. Reduced motion shows a static list.
        </span>
        <span className="sr-only" role="status">
          {paused
            ? "Automatic brand scrolling stopped"
            : "Automatic brand scrolling enabled"}
        </span>
        {!reduced && LogoLoop ? (
          <LogoLoop
            logos={brands}
            speed={paused || focused ? 0 : 32}
            direction="left"
            logoHeight={38}
            gap={68}
            hoverSpeed={0}
            labels="below"
            scaleOnHover={false}
            draggable={false}
            scrollBoost={0}
            intro={false}
            fadeOut
            fadeOutColor="#0b2920"
            ariaLabel="Car brand examples"
          />
        ) : (
          <ul className="static-vehicle-brands" aria-label="Car brand examples">
            {brands.map((brand) => (
              <li key={brand.title}>
                <img
                  src={brand.src}
                  alt={brand.alt}
                  width={44}
                  height={44}
                  loading="lazy"
                />
                <span aria-hidden="true">{brand.title}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="brand-availability-note">
        Brand examples only · Live inventory and availability require
        confirmation.
      </p>
    </section>
  );
}
