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

    /* 01 — Luscious: independent depth layers that move at different speeds. */
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

    /* 02 — Freedom: lightweight floating service words/cards around the story. */
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

    /* 03 — Steakhouse: cinematic image scale/focus transition. */
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

    /* 05 — Between Us: separate foreground/background layers around editorial images. */
    root.querySelectorAll(".fixly-image-frame").forEach((frame, index) => {
      if (frame.querySelector(".fixly-depth-image-layers")) return;
      const image = frame.querySelector("img");
      if (!image) return;
      const layers = document.createElement("div");
      layers.className = "fixly-depth-image-layers";
      layers.setAttribute("aria-hidden", "true");
      layers.innerHTML = `
        <span class="fixly-depth-image-shadow"></span>
        <span class="fixly-depth-image-glass"></span>
        <span class="fixly-depth-image-line"></span>
      `;
      frame.appendChild(layers);
      frame.dataset.depthIndex = String(index);
      generated.push(layers);
    });

    /* Existing four-piece image scatter is retained and becomes the Alaska-style transition. */
    root.querySelectorAll(".fixly-image-frame").forEach((frame) => {
      if (frame.querySelector(".fixly-scatter-layer")) return;
      const image = frame.querySelector("img");
      if (!image) return;

      const layer = document.createElement("div");
      layer.className = "fixly-scatter-layer";
      layer.setAttribute("aria-hidden", "true");
      const pieces = [
        ["0 0", -82, -62, -7],
        ["50% 0", 78, -52, 6],
        ["0 50%", -72, 58, 5],
        ["50% 50%", 84, 66, -6],
      ];

      pieces.forEach(([position, x, y, rotation], index) => {
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

    /* 06 — Alaska: clip-path reveal for each editorial image as it crosses the viewport. */
    root.querySelectorAll(".fixly-image-frame").forEach((frame) => {
      frame.classList.add("fx-alaska-transition");
    });

    /* 04 — Land Rover: cards travel horizontally and respond subtly to pointer position. */
    const horizontalItems = [
      ...root.querySelectorAll(".fixly-bento"),
      ...root.querySelectorAll(".fixly-cinema-step"),
      ...root.querySelectorAll(".fixly-stat-line"),
      ...root.querySelectorAll(".fixly-feature-card"),
      ...root.querySelectorAll(".fixly-editorial-copy"),
    ];

    horizontalItems.forEach((el, index) => {
      const pattern = [-1, 1, 0.65, -0.7];
      const base = isMobile() ? 22 : 62;
      el.dataset.motionX = String((pattern[index % pattern.length] * base).toFixed(0));
    });

    const pointerItems = [...root.querySelectorAll(".fixly-bento, .fixly-feature-card, .fixly-image-frame")];
    const onPointerMove = (event) => {
      if (reduceMotion.matches || isMobile()) return;
      pointerItems.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const px = clamp((event.clientX - rect.left) / rect.width - 0.5, -0.5, 0.5);
        const py = clamp((event.clientY - rect.top) / rect.height - 0.5, -0.5, 0.5);
        el.style.setProperty("--fx-pointer-x", `${(px * 10).toFixed(2)}px`);
        el.style.setProperty("--fx-pointer-y", `${(py * -8).toFixed(2)}px`);
      });
    };

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

        const image = el.querySelector("img");
        if (image && el.classList.contains("fixly-feature-card")) {
          image.style.setProperty("--fx-feature-image-x", `${(-x * 0.22).toFixed(2)}px`);
          image.style.setProperty("--fx-feature-image-y", `${(Math.abs(progress) * 4).toFixed(2)}px`);
        }
      });

      const depthScene = root.querySelector(".fx-depth-scene");
      if (depthScene) {
        const rect = services?.getBoundingClientRect();
        if (rect) {
          const p = clamp((viewport / 2 - (rect.top + rect.height / 2)) / viewport, -1, 1);
          depthScene.style.setProperty("--depth-back", `${(p * (mobile ? 18 : 42)).toFixed(2)}px`);
          depthScene.style.setProperty("--depth-mid", `${(p * (mobile ? 34 : 76)).toFixed(2)}px`);
          depthScene.style.setProperty("--depth-front", `${(p * (mobile ? 48 : 108)).toFixed(2)}px`);
        }
      }

      root.querySelectorAll("[data-freedom]").forEach((el) => {
        const rect = el.getBoundingClientRect();
        const p = clamp((viewport / 2 - (rect.top + rect.height / 2)) / viewport, -1, 1);
        const direction = Number(el.dataset.freedom || 1);
        el.style.setProperty("--freedom-x", `${(p * direction * (mobile ? 18 : 48)).toFixed(2)}px`);
        el.style.setProperty("--freedom-y", `${(-p * (mobile ? 8 : 18)).toFixed(2)}px`);
      });

      root.querySelectorAll(".fixly-image-frame").forEach((frame) => {
        const rect = frame.getBoundingClientRect();
        if (rect.bottom < -180 || rect.top > viewport + 180) return;
        const center = rect.top + rect.height / 2;
        const progress = clamp((viewport / 2 - center) / (viewport / 2 + rect.height / 2), -1, 1);
        const focus = 1 - Math.min(1, Math.abs(progress) * 1.55);
        const imageX = progress * (mobile ? 18 : 48);
        const reveal = clamp(1 - Math.abs(progress) * 1.25, 0, 1);
        frame.style.setProperty("--fx-image-focus", focus.toFixed(3));
        frame.style.setProperty("--fx-image-x", `${imageX.toFixed(2)}px`);
        frame.style.setProperty("--fx-image-rotate", `${(progress * (mobile ? 1.5 : 3)).toFixed(2)}deg`);
        frame.style.setProperty("--fx-alaska-reveal", reveal.toFixed(3));
        frame.style.setProperty("--fx-pointer-x", frame.style.getPropertyValue("--fx-pointer-x") || "0px");
        frame.style.setProperty("--fx-pointer-y", frame.style.getPropertyValue("--fx-pointer-y") || "0px");

        frame.querySelectorAll(".fixly-scatter-piece").forEach((piece) => {
          const scatterStrength = 1 - focus;
          const x = Number(piece.dataset.scatterX || 0) * (mobile ? 0.58 : 1) * scatterStrength;
          const y = Number(piece.dataset.scatterY || 0) * (mobile ? 0.58 : 1) * scatterStrength;
          const rotation = Number(piece.dataset.scatterRotate || 0) * scatterStrength;
          piece.style.setProperty("--scatter-x", `${x.toFixed(2)}px`);
          piece.style.setProperty("--scatter-y", `${y.toFixed(2)}px`);
          piece.style.setProperty("--scatter-r", `${rotation.toFixed(2)}deg`);
        });

        frame.querySelector(".fixly-depth-image-glass")?.style.setProperty("--depth-glass-y", `${(progress * (mobile ? 12 : 30)).toFixed(2)}px`);
        frame.querySelector(".fixly-depth-image-line")?.style.setProperty("--depth-line-x", `${(progress * (mobile ? 14 : 36)).toFixed(2)}px`);
      });

      const backdrop = root.querySelector(".fixly-cinema-backdrop");
      if (backdrop && cinema) {
        const rect = cinema.getBoundingClientRect();
        const p = clamp((viewport / 2 - (rect.top + rect.height / 2)) / (viewport * 1.2), -1, 1);
        backdrop.style.setProperty("--cinema-scale", (1.06 + Math.abs(p) * 0.08).toFixed(3));
        backdrop.style.setProperty("--cinema-x", `${(p * (mobile ? 10 : 28)).toFixed(2)}px`);
      }

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
