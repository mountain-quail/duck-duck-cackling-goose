/** Canvas visualizer for quiz audio (no Web Audio / CORS). */
export function startQuizAudioVisualizer(
  wrap: HTMLDivElement,
  audio: HTMLAudioElement
): () => void {
  const canvas = document.createElement("canvas");
  canvas.className = "quiz-audio-visualizer-canvas";
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", "Audio activity");
  wrap.replaceChildren(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => wrap.replaceChildren();

  const dpr = Math.min(2, window.devicePixelRatio || 1);
  let rafId = 0;
  let t = 0;

  const resize = (): void => {
    const rect = wrap.getBoundingClientRect();
    const w = Math.max(280, Math.floor(rect.width));
    const h = Math.max(180, Math.floor(rect.height));
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  resize();
  const ro = new ResizeObserver(() => resize());
  ro.observe(wrap);

  const BAR_COUNT = 56;
  const tick = (): void => {
    rafId = window.requestAnimationFrame(tick);
    t += 0.048;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    const playing = !audio.paused && !audio.ended;
    const beat = playing ? audio.currentTime * 8 : 0;

    ctx.fillStyle = "#e8f3eb";
    ctx.fillRect(0, 0, w, h);

    const barW = w / BAR_COUNT;
    const gap = barW * 0.12;
    const effW = Math.max(1, barW - gap);
    for (let i = 0; i < BAR_COUNT; i++) {
      const phase = t * (playing ? 2.4 : 0.35) + i * 0.12 + beat * 0.02;
      const base = playing ? 0.12 : 0.06;
      const pulse = playing
        ? 0.62 *
          (0.45 + 0.55 * Math.sin(phase)) *
          (0.65 + 0.35 * Math.sin(t * 3.1 + i * 0.35))
        : 0.04;
      const barH = Math.min(h * 0.9, h * (base + pulse));
      const x = i * barW + gap / 2;
      const y = h - barH;
      const g = ctx.createLinearGradient(x, y, x, h);
      g.addColorStop(0, "#7dd4a3");
      g.addColorStop(0.55, "#3da76e");
      g.addColorStop(1, "#1f6b4a");
      ctx.fillStyle = g;
      ctx.fillRect(x, y, effW, barH);
    }
  };
  rafId = window.requestAnimationFrame(tick);

  return (): void => {
    window.cancelAnimationFrame(rafId);
    ro.disconnect();
    wrap.replaceChildren();
  };
}
