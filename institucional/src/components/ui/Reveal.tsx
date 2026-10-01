import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Atraso em ms, para escalonar itens de uma mesma grade. */
  delay?: number;
  as?: "div" | "li" | "article";
};

/**
 * Revelação sutil na primeira entrada em tela. Não anima nada além de opacidade
 * e deslocamento, e é integralmente desligada por `prefers-reduced-motion`
 * (ver `globals.css`). O conteúdo já vem no HTML: nada depende do JS para existir.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Sem IntersectionObserver (navegador antigo), revelamos direto no DOM:
    // é uma escrita em sistema externo, não um novo ciclo de render.
    if (typeof IntersectionObserver === "undefined") {
      node.classList.add("reveal-in");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      // @ts-expect-error: ref polimórfico entre div/li/article
      ref={ref}
      className={cn("reveal", visible && "reveal-in", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
