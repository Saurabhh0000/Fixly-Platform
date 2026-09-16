import { useEffect } from "react";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const FixlyScrollMotion = () => {
  useEffect(() => {
    const root = document.querySelector(".fixly-parallax-page");
    if (!root) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isMobile = () => window.matchMedia("(max-width: 600px)").matches;
    let raf = 0;
    let marquee = null;
    const generated = [];

    // Add a scroll-reactive horizontal service ribbon between the services and flow sections.
    const cinema = root.querySelector(".fixly-parallax-cinema");
    if (cinema && !root.querySelector(".fixly-scroll-marquee")) {
      marquee = document.createElement("div");
      marquee.className = "fixly-scroll-marquee";
      marquee.setAttribute("aria-hidden", "true");
      marquee.innerHTML = `
        <div class="fixly-marquee-row fx-marquee-forward">REPAIR <i>•</i> CLEANING <i>•</i> PLUMBING <i>•</i> ELECTRICAL <i>•</i> MAINTENANCE <i>•</i></div>
        <div class="fixly-marquee-row fx-marquee-reverse">HOME CARE <i>•</i> INSTANT HELP <i>•</i> VERIFIED EXPERTS <i>•</i> SECURE SERVICE <i>•</i> FAST BOOKING <i>•</i></div>
      `;
      cinema.parentNode.insertBefore(marquee, cinema);
      generated.push(marquee);
    }

    // Build four visual fragments from the existing image. They assemble near the
    // center of the viewport and scatter again as the user leaves the section.
    root.querySelectorAll(".fixly-image-frame").forEach((frame) => {
      if (frame.querySelector(".fixly-scatter-layer")) return;
      const image = frame.querySelector("img");
      if (!image) return;

      const layer = document.createElement("div");
      layer.className = "fixly-scatter-layer";
      layer.setAttribute("aria-hidden", "true");
      const pieces = [
        ["0 0", "50% 50%", -82, -62, -7],
        ["50% 0", "50% 50%", 78, -52, 6],
        ["0 50%", "50% 50%", -72, 58, 5],
        ["50% 50%", "50% 50%", 84, 66, -6],
      ];

      pieces.forEach(([position, size, x, y, rotation], index) => {
        const piece = document.createElement("span");
        piece.className = `fixly-scatter-piece fixly-scatter-${index + 1}`;
        piece.style.backgroundImage = `url(${image.currentSrc || image.src})`;
        piece.style.backgroundPosition = position;
        piece.style.backgroundSize = "200% 200%";
        piece.dataset.scatterX = String(x);
        piece.dataset.scatterY = String(y);
        piece.dataset.scatterRotate = String(rotation);
        layer.appendChild(piece);
      });

      frame.appendChild(layer);
      frame.classList.add("fixly-has-scatter");
      generated.push(layer);
    });

    const horizontalItems = [
      ...root.querySelectorAll(".fixly-bento"),
      ...root.querySelectorAll(".fixly-cinema-step"),
      ...root.querySelectorAll(".fixly-stat-line"),
      ...root.querySelectorAll(".fixly-feature-card"),
      ...root.querySelectorAll(".fixly-editorial-copy"),
    ];

    horizontalItems.forEach((el, index) => {
      if (!el.dataset.motionX) {
        const pattern = [-1, 1, 0.65, -0.7];
        el.dataset.motionX = String((pattern[index % pattern.length] * (isMobile() ? 22 : 62)).toFixed(0));
      }
    });

    const update = () => {
      raf = 0;
      if (reduceMotion.matches) return;

      const viewport = window.innerHeight;
      const mobile = isMobile();
      const maxDistance = mobile ? 24 : 78;

      horizontalItems.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -180 || rect.top > viewport + 180) return;
        const center = rect.top + rect.height / 2;
        const progress = clamp((viewport / 2 - center) / (viewport / 2 + rect.height / 2), -1, 1);
        const x = clamp(Number(el.dataset.motionX || 0) * progress, -maxDistance, maxDistance);
        const rotate = x * 0.018;
        const scale = 1 - Math.min(Math.abs(progress) * 0.025, 0.025);
        el.style.setProperty("--fx-scroll-x", `${x.toFixed(2)}px`);
        el.style.setProperty("--fx-scroll-rotate", `${rotate.toFixed(2)}deg`);
        el.style.setProperty("--fx-scroll-scale", scale.toFixed(3));
      });

      root.querySelectorAll(".fixly-image-frame").forEach((frame) => {
        const rect = frame.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const progress = clamp((viewport / 2 - center) / (viewport / 2 + rect.height / 2), -1, 1);
        const focus = 1 - Math.min(1, Math.abs(progress) * 1.55);
        frame.style.setProperty("--fx-image-focus", focus.toFixed(3));
        frame.style.setProperty("--fx-image-x", `${(progress * (mobile ? 18 : 48)).toFixed(2)}px`);
        frame.style.setProperty("--fx-image-rotate", `${(progress * (mobile ? 1.5 : 3)).toFixed(2)}deg`);
      });

      if (marquee) {
        const rect = marquee.getBoundingClientRect();
        const p = clamp((viewport / 2 - (rect.top + rect.height / 2)) / viewport, -1, 1);
        marquee.style.setProperty("--fx-marquee-x", `${(p * (mobile ? 35 : 110)).toFixed(2)}px`);
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      generated.forEach((node) => node.remove());
    };
  }, []);

  return null;
};

export default FixlyScrollMotion;
