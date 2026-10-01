import { useEffect, useRef } from "react";
import { prefersReducedMotion, viewportProgress } from "@/lib/motion";
import { cn } from "@/lib/cn";

type ParallaxProps = {
  children: React.ReactNode;
  className?: string;
  /** Deslocamento total, em pixels, ao longo da travessia pela janela. */
  distance?: number;
};

/**
 * Deslocamento vertical leve conforme o elemento atravessa a janela.
 *
 * Usado nas fotografias das dobras. `distance` fica deliberadamente baixo: o
 * efeito precisa dar profundidade, não chamar atenção para si.
 */
export function Parallax({
  children,
  className,
  distance = 48,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const progress = viewportProgress(
        node.getBoundingClientRect(),
        window.innerHeight,
      );
      node.style.transform = `translate3d(0, ${(0.5 - progress) * distance}px, 0)`;
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
      node.style.transform = "";
    };
  }, [distance]);

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}
