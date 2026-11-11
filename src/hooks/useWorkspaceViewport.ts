import { useLayoutEffect } from "react";

/** One viewport owner in the app; the landing page keeps ordinary document scrolling. */
export function useWorkspaceViewport(active: boolean) {
  useLayoutEffect(() => {
    if (!active) return;
    const html = document.documentElement;
    html.dataset.workspace = "true";
    const viewport = window.visualViewport;
    const resize = () => {
      // Pinch zoom must keep its native magnification/panning behavior.
      const height =
        viewport && Math.abs(viewport.scale - 1) < 0.01
          ? viewport.height
          : window.innerHeight;
      html.style.setProperty("--workspace-viewport-height", `${height}px`);
      html.dataset.keyboardOpen = String(
        Boolean(
          viewport &&
          viewport.scale === 1 &&
          window.innerHeight - viewport.height > 120,
        ),
      );
    };
    resize();
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    window.addEventListener("resize", resize);
    viewport?.addEventListener("resize", resize);
    return () => {
      delete html.dataset.workspace;
      delete html.dataset.keyboardOpen;
      html.style.removeProperty("--workspace-viewport-height");
      window.removeEventListener("resize", resize);
      viewport?.removeEventListener("resize", resize);
    };
  }, [active]);
}
