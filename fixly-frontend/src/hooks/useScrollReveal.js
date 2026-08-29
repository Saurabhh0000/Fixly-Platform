import { useEffect, useRef, useState, useCallback } from "react";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * One-time reveal on viewport entry. Unchanged contract from before —
 * existing components using it keep working — but now accepts a
 * `direction` hint ("up" | "left" | "right" | "none") consumed purely via
 * a data attribute + CSS, so callers can vary entry direction without any
 * JS animation logic living here.
 */
export function useScrollReveal(options = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (prefersReducedMotion()) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px", ...options }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return [ref, visible];
}

/** Unchanged from before — tracks which stacked "step" is most visible. */
export function useActiveStep(count) {
  const stepRefs = useRef([]);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const reduceMotion = prefersReducedMotion();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.stepIndex);
            setActiveStep(idx);
          }
        });
      },
      {
        threshold: reduceMotion ? 0.01 : 0.5,
        rootMargin: "-20% 0px -20% 0px",
      }
    );

    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [count]);

  const setStepRef = (index) => (el) => {
    stepRefs.current[index] = el;
  };

  return { activeStep, setStepRef };
}

/**
 * NEW: 0→1 progress of a section as it passes through the viewport.
 * Used to drive connecting-line "draw-in" effects and other continuous
 * (not just on/off) scroll-linked visuals, without a per-pixel React
 * re-render storm: a single rAF-throttled scroll listener updates a CSS
 * custom property (--fa-progress) directly on the DOM node, and state is
 * only touched when the rounded value actually changes (for consumers
 * that need the number in JS, e.g. SVG stroke-dashoffset math).
 */
export function useScrollProgress() {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  const frame = useRef(null);
  const lastValue = useRef(-1);

  const measure = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    // 0 when the section's top just enters the bottom of the viewport,
    // 1 when its bottom reaches the top of the viewport.
    const total = rect.height + vh;
    const traveled = vh - rect.top;
    const raw = Math.min(1, Math.max(0, traveled / total));
    node.style.setProperty("--fa-progress", raw.toFixed(3));

    const rounded = Math.round(raw * 100);
    if (rounded !== lastValue.current) {
      lastValue.current = rounded;
      setProgress(raw);
    }
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setProgress(1);
      return;
    }

    const onScroll = () => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        measure();
      });
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [measure]);

  return [ref, progress];
}

/**
 * NEW: lightweight parallax. Applies `translateY(scrollDelta * speed)` as
 * a CSS custom property (--fa-parallax) on the element, read by CSS via
 * `transform: translate3d(0, var(--fa-parallax, 0px), 0)`. rAF-throttled,
 * one shared scroll listener per hook instance, disabled entirely under
 * reduced motion (element simply stays at translateY(0)).
 */
export function useParallax(speed = 0.15) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return;

    let frame = null;
    const update = () => {
      frame = null;
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // Only bother computing while roughly in/near view.
      if (rect.bottom < -200 || rect.top > vh + 200) return;
      const centerDelta = rect.top + rect.height / 2 - vh / 2;
      node.style.setProperty(
        "--fa-parallax",
        `${(-centerDelta * speed).toFixed(1)}px`
      );
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [speed]);

  return ref;
}