import { useEffect, useState } from "react";
import type TechTextComponent from "../react-bits/TechText/TechText";

/** Optional decoration: never gate workspace loading on the animation chunk. */
export function AnimatedBrandMark() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [TechText, setTechText] = useState<typeof TechTextComponent | null>(
    null,
  );
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (reduced || TechText) return;
    let active = true;
    import("../react-bits/TechText/TechText")
      .then((module) => {
        if (active) setTechText(() => module.default);
      })
      .catch(() => {
        /* Static brand text remains available. */
      });
    return () => {
      active = false;
    };
  }, [reduced, TechText]);
  return (
    <div className="animated-loading-wordmark" aria-hidden="true">
      <span className="mono-loading-mark brand-static-wordmark">GOMONO</span>
      {!reduced && TechText && (
        <TechText
          text="GOMONO"
          fontFamily="Manrope, sans-serif"
          fontWeight={600}
          fontSize={48}
          reveal="letter"
          dashLength={4}
          dashGap={2}
          specks={15}
          intro="none"
          introDuration={2}
          clickKick
          guides={false}
          draggable={false}
          labels={false}
          selection={false}
          color="currentColor"
          accentColor="#b5daa1"
        />
      )}
    </div>
  );
}
