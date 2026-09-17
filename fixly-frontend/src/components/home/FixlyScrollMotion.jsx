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

    const services = root.querySelector(".fixly-services");
    if (services && !services.querySelector(".fx-depth-scene")) {
      const scene = document.createElement("div");
      scene.className = "fx-depth-scene";
      scene.setAttribute("aria-hidden", "true");
      scene.innerHTML = `
        <span class="fx-depth-layer fx-depth-back"></span>
        <span class="fx-depth-layer fx-depth-mid"></span>
        <span class="fx-depth-layer fx-depth-front"></span>
      `;
      services.prepend(scene);
      generated.push(scene);
    }

    if (services && !services.querySelector(".fx-freedom-float")) {
      const float = document.createElement("div");
      float.className = "fx-freedom-float";
      float.setAttribute("aria-hidden", "true");
      float.innerHTML = `
        <span data-freedom="-1">TRUST</span>
        <span data-freedom="1">CARE</span>
        <span data-freedom="-0.65">SIMPLE</span>
      `;
      services.appendChild(float);
      generated.push(float);
    }

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

    /* Text/image reveal: image enters from the left while copy enters from the right. */
    root.querySelectorAll(".fixly-editorial-row").forEach((row) => {
      row.classList.add("fx-side-reveal");
    });

    /* Remove the previous image-scattering behavior completely. */
    root.querySelectorAll(".fixly-image-frame").forEach((frame) => {
      frame.classList.remove("fixly-has-scatter", "fx-alaska-transition");
      frame.querySelector(".fixly-scatter-layer")?.remove();
      frame.querySelector(".fixly-depth-image-layers")?.remove();
    });

    const horizontalItems = [
      ...root.querySelectorAll(".fixly-bento"),
      ...root.querySelectorAll(".fixly-cinema-step"),
      ...root.querySelectorAll(".fixly-stat-line"),
      ...root.querySelectorAll(".fixly-feature-card"),
    ];

    horizontalItems.forEach((el, index) => {
      const pattern = [-1, 1, 0.65, -0.7];
      const base = isMobile() ? 12 : 42;
      el.dataset.motionX = String((pattern[index % pattern.length] * base).toFixed(0));
    });

    const pointerItems = [...root.querySelectorAll(".fixly-bento, .fixly-feature-card")];
    const onPointerMove = (event) => {
      if (reduceMotion.matches || isMobile()) return;
      pointerItems.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const px = clamp((event.clientX - rect.left) / rect.width - 0.5, -0.5, 0.5);
        const py = clamp((event.clientY - rect.top) / rect.height - 0.5, -0.5, 0.5);
        el.style.setProperty("--fx-pointer-x", `${(px * 6).toFixed(2)}px`);
        el.style.setProperty("--fx-pointer-y", `${(py * -5).toFixed(2)}px`);
      });
    };

    const update = () => {
      raf = 0;
      if (reduceMotion.matches) return;

      const viewport = window.innerHeight;
      const mobile = isMobile();
      const maxDistance = mobile ? 14 : 46;

      horizontalItems.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -180 || rect.top > viewport + 180) return;
        const center = rect.top + rect.height / 2;
        const progress = clamp((viewport / 2 - center) / (viewport / 2 + rect.height / 2), -1, 1);
        const x = clamp(Number(el.dataset.motionX || 0) * progress, -maxDistance, maxDistance);
        const rotate = x * 0.012;
        const scale = 1 - Math.min(Math.abs(progress) * 0.018, 0.018);
        el.style.setProperty("--fx-scroll-x", `${x.toFixed(2)}px`);
        el.style.setProperty("--fx-scroll-rotate", `${rotate.toFixed(2)}deg`);
        el.style.setProperty("--fx-scroll-scale", scale.toFixed(3));

        const image = el.querySelector("img");
        if (image && el.classList.contains("fixly-feature-card")) {
          image.style.setProperty("--fx-feature-image-x", `${(-x * 0.16).toFixed(2)}px`);
          image.style.setProperty("--fx-feature-image-y", `${(Math.abs(progress) * 3).toFixed(2)}px`);
        }
      });

      const depthScene = root.querySelector(".fx-depth-scene");
      if (depthScene && services) {
        const rect = services.getBoundingClientRect();
        const p = clamp((viewport / 2 - (rect.top + rect.height / 2)) / viewport, -1, 1);
        depthScene.style.setProperty("--depth-back", `${(p * (mobile ? 12 : 30)).toFixed(2)}px`);
        depthScene.style.setProperty("--depth-mid", `${(p * (mobile ? 22 : 52)).toFixed(2)}px`);
        depthScene.style.setProperty("--depth-front", `${(p * (mobile ? 32 : 72)).toFixed(2)}px`);
      }

      root.querySelectorAll("[data-freedom]").forEach((el) => {
        const rect = el.getBoundingClientRect();
        const p = clamp((viewport / 2 - (rect.top + rect.height / 2)) / viewport, -1, 1);
        const direction = Number(el.dataset.freedom || 1);
        el.style.setProperty("--freedom-x", `${(p * direction * (mobile ? 12 : 32)).toFixed(2)}px`);
        el.style.setProperty("--freedom-y", `${(-p * (mobile ? 5 : 12)).toFixed(2)}px`);
      });

      /* Main editorial interaction: image from left, text from right. */
      root.querySelectorAll(".fx-side-reveal").forEach((row) => {
        const rect = row.getBoundingClientRect();
        if (rect.bottom < -120 || rect.top > viewport + 120) return;
        const center = rect.top + rect.height / 2;
        const progress = clamp((viewport / 2 - center) / (viewport * 0.72), -1, 1);
        const distance = mobile ? 70 : 150;
        const travel = 1 - Math.abs(progress);
        const reveal = clamp(1 - Math.abs(progress) * 1.12, 0, 1);
        row.style.setProperty("--fx-side-progress", travel.toFixed(3));
        row.style.setProperty("--fx-side-reveal", reveal.toFixed(3));
        row.style.setProperty("--fx-image-enter", `${((1 - travel) * -distance).toFixed(2)}px`);
        row.style.setProperty("--fx-copy-enter", `${((1 - travel) * distance).toFixed(2)}px`);
      });

      const backdrop = root.querySelector(".fixly-cinema-backdrop");
      if (backdrop && cinema) {
        const rect = cinema.getBoundingClientRect();
        const p = clamp((viewport / 2 - (rect.top + rect.height / 2)) / (viewport * 1.2), -1, 1);
        backdrop.style.setProperty("--cinema-scale", (1.05 + Math.abs(p) * 0.06).toFixed(3));
        backdrop.style.setProperty("--cinema-x", `${(p * (mobile ? 7 : 20)).toFixed(2)}px`);
      }

      if (marquee) {
        const rect = marquee.getBoundingClientRect();
        const p = clamp((viewport / 2 - (rect.top + rect.height / 2)) / viewport, -1, 1);
        marquee.style.setProperty("--fx-marquee-x", `${(p * (mobile ? 24 : 80)).toFixed(2)}px`);
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      generated.forEach((node) => node.remove());
    };
  }, []);

  return null;
};

export default FixlyScrollMotion;
