/* Lightweight pastel confetti. fireConfetti(container, originX, originY)
   draws into an absolutely-positioned canvas layered inside `container`.
   Coordinates are relative to the container's box. */
(function () {
  const COLORS = ["#e8809f", "#f4b8c8", "#f7d9a8", "#fff6ef", "#c98ba6", "#ec9bb4"];

  function ensureCanvas(container) {
    let cv = container.querySelector("canvas[data-confetti]");
    if (!cv) {
      cv = document.createElement("canvas");
      cv.setAttribute("data-confetti", "");
      Object.assign(cv.style, {
        position: "absolute",
        inset: "0",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: "60",
      });
      container.appendChild(cv);
    }
    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.max(1, rect.width * dpr);
    cv.height = Math.max(1, rect.height * dpr);
    const ctx = cv.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { cv, ctx, w: rect.width, h: rect.height };
  }

  window.fireConfetti = function (container, originX, originY, opts) {
    opts = opts || {};
    const count = opts.count || 90;
    const spread = opts.spread || 1; // 1 = burst, used to scale velocity
    if (!container) return;
    if (getComputedStyle(container).position === "static") {
      container.style.position = "relative";
    }
    const { cv, ctx, w, h } = ensureCanvas(container);
    const ox = originX == null ? w / 2 : originX;
    const oy = originY == null ? h * 0.4 : originY;

    const parts = [];
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const speed = (2 + Math.random() * 6) * spread;
      parts.push({
        x: ox,
        y: oy,
        vx: Math.cos(ang) * speed,
        vy: Math.sin(ang) * speed - 3,
        size: 4 + Math.random() * 6,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        shape: Math.random() > 0.5 ? "rect" : "circle",
        life: 0,
        ttl: 70 + Math.random() * 50,
      });
    }

    let raf;
    function frame() {
      ctx.clearRect(0, 0, w, h);
      let alive = false;
      for (const p of parts) {
        if (p.life > p.ttl) continue;
        alive = true;
        p.life++;
        p.vy += 0.18; // gravity
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        const fade = Math.max(0, 1 - p.life / p.ttl);
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      if (alive) {
        raf = requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, w, h);
        cancelAnimationFrame(raf);
      }
    }
    frame();
  };
})();
