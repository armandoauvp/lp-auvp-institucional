import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Contagem crescente de um número institucional.
 *
 * Recebe o valor já formatado ("+62.285", "40 MI") e preserva prefixo, sufixo e
 * separador de milhar: a animação só interpola os dígitos. O texto final está no
 * HTML desde o servidor, então quem não roda JavaScript, ou pediu menos
 * movimento, lê o número correto de imediato.
 */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return;

    const digits = value.replace(/\D/g, "");
    const target = Number(digits);
    if (!digits || !Number.isFinite(target) || target === 0) return;

    const format = (current: number) => {
      const rendered = String(Math.round(current)).padStart(digits.length, "0");
      let index = 0;
      return value.replace(/\d/g, () => rendered[index++] ?? "0");
    };

    let frame = 0;
    let start = 0;
    const duration = 1600;

    const run = (time: number) => {
      if (!start) start = time;
      const t = Math.min((time - start) / duration, 1);
      // easeOutExpo: rápido no começo, assentando no fim.
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      node.textContent = format(target * eased);
      if (t < 1) frame = requestAnimationFrame(run);
      else node.textContent = value;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        node.textContent = format(0);
        frame = requestAnimationFrame(run);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
    </span>
  );
}
