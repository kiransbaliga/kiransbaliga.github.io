import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "./useMedia";

/**
 * Returns a ref. The element gently translates toward the cursor when the
 * pointer comes within `radius` px of it, then springs back (via CSS transition
 * on the element). Disabled under reduced-motion.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.35, radius = 90) {
  const ref = useRef<T>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    const apply = () => {
      raf = 0;
      el.style.transform = `translate(${tx}px, ${ty}px)`;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const reach = radius + Math.max(r.width, r.height) / 2;
      if (Math.hypot(dx, dy) < reach) {
        tx = dx * strength;
        ty = dy * strength;
      } else if (tx !== 0 || ty !== 0) {
        tx = 0;
        ty = 0;
      } else {
        return;
      }
      schedule();
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = "";
    };
  }, [reducedMotion, strength, radius]);

  return ref;
}
