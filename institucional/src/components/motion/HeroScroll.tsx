import { useEffect, useRef } from "react";
import { clamp, prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Movimento de saída do hero, dirigido pela rolagem.
 *
 * A fotografia avança e cresce devagar enquanto o texto sobe e se dissolve:
 * duas velocidades diferentes na mesma rolagem. É o que dá profundidade sem
 * nenhum elemento decorativo a mais.
 *
 * Os dois componentes escrevem direto em `style` dentro do rAF: nada disso
 * passa por estado do React, então rolar não custa render.
 */

function useHeroProgress(
  apply: (node: HTMLDivElement, progress: number) => void,
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      apply(node, clamp(window.scrollY / window.innerHeight, 0, 1));
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
      node.style.cssText = "";
    };
    // `apply` é estável por construção: cada chamada passa uma função literal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

/** Camada da fotografia: aproxima e desce em ritmo mais lento que o texto. */
export function HeroBackdrop({ children }: { children: React.ReactNode }) {
  const ref = useHeroProgress((node, progress) => {
    node.style.transform = `translate3d(0, ${progress * 56}px, 0) scale(${1 + progress * 0.12})`;
  });

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute inset-0 will-change-transform"
    >
      {children}
    </div>
  );
}

/**
 * Camada do texto: dissolve antes de a próxima dobra encostar.
 *
 * Aqui havia também um deslocamento de 72px para cima, para o texto sair mais
 * rápido que a fotografia. Ele saiu quando a barra fixa passou a pousar sobre a
 * régua desta dobra: a régua vive dentro desta camada e a barra não, então o
 * deslocamento separava as duas em até 10px no meio da rolagem, e o menu
 * flutuava acima da própria linha. Duas camadas presas uma na outra não podem
 * andar em velocidades diferentes. A profundidade continua no `HeroBackdrop`,
 * que é a camada de trás e não tem nada preso a ela.
 */
export function HeroForeground({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useHeroProgress((node, progress) => {
    node.style.opacity = String(clamp(1 - progress * 1.35, 0, 1));
  });

  return (
    <div
      ref={ref}
      className={cn("relative w-full will-change-[opacity]", className)}
    >
      {children}
    </div>
  );
}
