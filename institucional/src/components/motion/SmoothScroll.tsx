import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Rolagem com inércia (Lenis).
 *
 * É o que dá a sensação de fluidez pedida sem tocar em nenhum layout: o
 * navegador continua rolando o documento, só que interpolado. Sob
 * `prefers-reduced-motion` nada é instanciado e a rolagem nativa segue valendo.
 *
 * O Lenis marca `<html class="lenis">`, e o `globals.css` usa essa classe para
 * desligar o `scroll-behavior: smooth` nativo, porque os dois juntos brigam.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;

      const lenis = new Lenis({
        lerp: 0.09,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.6,
      });

      let frame = requestAnimationFrame(function raf(time: number) {
        lenis.raf(time);
        frame = requestAnimationFrame(raf);
      });

      // Âncoras do menu: o Lenis assume o controle para manter a mesma inércia,
      // descontando a altura do cabeçalho fixo.
      const onClick = (event: MouseEvent) => {
        const anchor = (
          event.target as HTMLElement | null
        )?.closest<HTMLAnchorElement>('a[href^="#"]');
        const hash = anchor?.getAttribute("href");
        if (!anchor || !hash || hash === "#") return;

        const target = document.querySelector(hash);
        if (!target) return;

        event.preventDefault();
        lenis.scrollTo(target as HTMLElement, { offset: -96, duration: 1.3 });
      };

      document.addEventListener("click", onClick);

      cleanup = () => {
        document.removeEventListener("click", onClick);
        cancelAnimationFrame(frame);
        lenis.destroy();
      };
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return null;
}
