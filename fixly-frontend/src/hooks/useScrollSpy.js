import { useEffect, useRef, useState } from "react";

/**
 * Tracks which section id is currently "active" for a sticky table of
 * contents. Also returns overall scroll progress (0–1) through the
 * tracked content, used for the reading progress bar.
 */
export function useScrollSpy(sectionIds) {
  const [activeId, setActiveId] = useState(sectionIds[0] || null);
  const [progress, setProgress] = useState(0);
  const frame = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const updateProgress = () => {
      frame.current = null;
      const first = document.getElementById(sectionIds[0]);
      const last = document.getElementById(sectionIds[sectionIds.length - 1]);
      if (!first || !last) return;
      const start = first.offsetTop;
      const end = last.offsetTop + last.offsetHeight;
      const total = end - start || 1;
      const traveled = window.scrollY + window.innerHeight / 2 - start;
      setProgress(Math.min(1, Math.max(0, traveled / total)));
    };

    const onScroll = () => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(updateProgress);
    };

    if (reduceMotion) {
      updateProgress();
    } else {
      updateProgress();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionIds.join(",")]);

  return { activeId, progress };
}