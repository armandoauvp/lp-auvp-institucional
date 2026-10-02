/** Utilitários compartilhados pela camada de movimento. */

/** Respeita a preferência do sistema. Sempre `false` no servidor. */
export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function lerp(from: number, to: number, amount: number) {
  return from + (to - from) * amount;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** Fração de 0 a 1 do quanto o elemento já percorreu a janela. */
export function viewportProgress(rect: DOMRect, viewportHeight: number) {
  return clamp(
    (viewportHeight - rect.top) / (viewportHeight + rect.height),
    0,
    1,
  );
}
