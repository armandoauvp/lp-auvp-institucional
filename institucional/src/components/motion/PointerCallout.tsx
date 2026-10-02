import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "@/components/ui/Button";
import { prefersReducedMotion } from "@/lib/motion";

type PointerCalloutProps = {
  href: string;
  label: string;
  children: React.ReactNode;
};

/**
 * Transforma um bloco inteiro em chamada para ação, com um balão que acompanha
 * o ponteiro.
 *
 * O pedido era substituir o botão por esse balão. O problema é que um balão que
 * segue o mouse não existe para quem navega por teclado nem para quem usa toque,
 * e uma dobra inteira clicável por `onClick` num `<div>` não é anunciada como
 * link por leitor de tela. Então há três caminhos para a mesma ação, e o link
 * de verdade é sempre um `<a>`:
 *
 * - **Ponteiro fino** (mouse, trackpad): o balão segue o cursor e o clique em
 *   qualquer ponto do bloco navega. O botão fica escondido, como pedido.
 * - **Toque**, ou qualquer aparelho sem `hover`: sem cursor não há balão, então
 *   o botão aparece normalmente no fim do bloco.
 * - **Teclado**: o botão está sempre no DOM, na ordem de tabulação, e reaparece
 *   ao receber foco mesmo em aparelho com ponteiro fino. A regra está em
 *   `globals.css`, na utilitária `cta-ponteiro-fino`.
 *
 * O clique no bloco é ignorado quando há texto selecionado: sem isso, soltar o
 * mouse depois de selecionar um parágrafo levaria a pessoa para fora da página.
 */
export function PointerCallout({ href, label, children }: PointerCalloutProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const balloonRef = useRef<HTMLSpanElement>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const balloon = balloonRef.current;
    if (!root || !balloon) return;

    const fino = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fino.matches || prefersReducedMotion()) return;

    let frame = 0;
    const alvo = { x: 0, y: 0 };
    const atual = { x: 0, y: 0 };
    let primeiro = true;

    const desenhar = () => {
      frame = requestAnimationFrame(desenhar);
      // Interpolação: o balão persegue o cursor com um atraso curto, que é o
      // que dá a sensação de peso em vez de um retângulo grudado no ponteiro.
      const fator = primeiro ? 1 : 0.18;
      atual.x += (alvo.x - atual.x) * fator;
      atual.y += (alvo.y - atual.y) * fator;
      primeiro = false;
      balloon.style.transform = `translate3d(${atual.x}px, ${atual.y}px, 0)`;
    };

    const mover = (event: PointerEvent) => {
      alvo.x = event.clientX;
      alvo.y = event.clientY;
    };

    const entrar = (event: PointerEvent) => {
      alvo.x = event.clientX;
      alvo.y = event.clientY;
      primeiro = true;
      setVisivel(true);
      if (!frame) frame = requestAnimationFrame(desenhar);
    };

    const sair = () => {
      setVisivel(false);
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    root.addEventListener("pointerenter", entrar);
    root.addEventListener("pointermove", mover);
    root.addEventListener("pointerleave", sair);

    return () => {
      root.removeEventListener("pointerenter", entrar);
      root.removeEventListener("pointermove", mover);
      root.removeEventListener("pointerleave", sair);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const aoClicar = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.defaultPrevented) return;

    // Quem clicou num link ou botão de verdade já foi atendido por ele.
    if ((event.target as HTMLElement).closest("a, button")) return;

    // Selecionar texto termina em clique: navegar aqui seria roubar a página
    // de quem só queria copiar um trecho.
    if (window.getSelection()?.toString()) return;

    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      ref={rootRef}
      onClick={aoClicar}
      className="relative cursor-pointer"
      data-callout
    >
      {children}

      <span
        ref={balloonRef}
        aria-hidden
        className={`bg-yellow text-ink pointer-events-none fixed top-0 left-0 z-40 flex items-center gap-2 rounded-full px-5 py-2.5 text-[0.8125rem] font-medium tracking-[0.06em] whitespace-nowrap transition-opacity duration-300 ${
          visivel ? "opacity-100" : "opacity-0"
        }`}
        // O balão nasce no canto e é levado ao cursor pelo rAF. A margem
        // negativa o mantém acima e à direita do ponteiro, fora do que ele cobre.
        style={{ marginTop: "-3.25rem", marginLeft: "1rem" }}
      >
        {label}
        <ArrowRight />
      </span>
    </div>
  );
}
