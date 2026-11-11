import { useEffect, useRef, useState } from "react";
import type LogoLoopComponent from "./react-bits/LogoLoop/LogoLoop";
import "./vehicle-brand-loop.css";

const brands = [
  { src: "/brands/audi.svg", alt: "Audi", title: "Audi" },
  { src: "/brands/bmw.svg", alt: "BMW", title: "BMW" },
  { src: "/brands/toyota.svg", alt: "Toyota", title: "Toyota" },
];

export function VehicleBrandLoop() {
  const root = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [paused, setPaused] = useState(false);
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
            SAMPLE VEHICLE BRANDS
          </span>
          <p>A few familiar names from our demo collection.</p>
        </div>
        {!reduced && LogoLoop && (
          <button
            type="button"
            aria-label={
              paused ? "Resume brand animation" : "Pause brand animation"
            }
            aria-pressed={paused}
            onClick={() => setPaused((value) => !value)}
          >
            {paused ? "Resume" : "Pause"}
          </button>
        )}
      </header>
      <div className="vehicle-brand-loop">
        {!reduced && LogoLoop ? (
          <LogoLoop
            logos={brands}
            speed={paused ? 0 : 32}
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
            ariaLabel="Sample vehicle brands"
          />
        ) : (
          <ul
            className="static-vehicle-brands"
            aria-label="Sample vehicle brands"
          >
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
        Illustrative listings · availability requires provider confirmation.
      </p>
    </section>
  );
}
