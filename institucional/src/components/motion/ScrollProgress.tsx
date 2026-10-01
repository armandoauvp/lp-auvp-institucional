import { useEffect, useRef } from "react";

/**
 * Filete dourado de progresso, na base do cabeçalho fixo.
 *
 * Escreve direto em `style.transform` dentro do rAF, sem passar por estado do
 * React, então rolar a página não dispara render nenhum.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = ref.current;
    if (!bar) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      bar.style.transform = `scaleX(${progress})`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 overflow-hidden"
    >
      {/* Estado inicial em `style`, e não pela utilitária `scale-*` do
          Tailwind: na v4 essas utilitárias escrevem na propriedade `scale`,
          que é independente de `transform` e se multiplica com ela. Uma classe
          `scale-x-0` junto do `transform` escrito pelo rAF dá zero, e o filete
          nunca aparece. */}
      <div
        ref={ref}
        className="bg-ink h-full w-full origin-left"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
