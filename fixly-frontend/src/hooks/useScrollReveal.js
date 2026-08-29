import { useEffect, useRef, useState } from "react";

/**
 * IntersectionObserver-based reveal hook. Returns a ref to attach to an
 * element and a boolean that flips true once the element enters the
 * viewport (and stays true — this is a one-time reveal, not a toggle).
 * Respects prefers-reduced-motion by revealing immediately.
 */
export function useScrollReveal(options = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) {
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

/**
 * Tracks which of several stacked "step" elements is currently most
 * visible, for step-based scroll storytelling (e.g. the sticky mockup in
 * SearchToService). Returns the active index.
 */
export function useActiveStep(count) {
  const stepRefs = useRef([]);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

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