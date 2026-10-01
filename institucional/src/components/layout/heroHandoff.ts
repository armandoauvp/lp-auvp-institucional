import { useEffect, useState } from "react";

/**
 * O único limite que a página observa: o hero já saiu do topo?
 *
 * Três coisas dependem dessa mesma resposta, e é de propósito que dependam da
 * mesma: o fundo da barra fixa, que sobre a primeira dobra é só um filete e
 * depois vira papel; a cor do que está dentro dela; e o botão do WhatsApp, que
 * não aparece na abertura.
 *
 * O corte é geométrico, e não um `scrollY` comparado com um número mágico: vale
 * quando a base do hero alcança a base da barra. É o instante exato em que a
 * dobra seguinte, que é clara, passa a ficar atrás dela. Um pixel antes o texto
 * branco ainda está sobre a fotografia; um pixel depois estaria sobre papel.
 *
 * Houve aqui uma versão em que a barra descia até uma âncora no meio da
 * primeira dobra, para pousar sob a assinatura AUVP em corpo grande. A
 * assinatura saiu do hero, e a viagem saiu com ela: sem nada para pousar
 * embaixo, mover a barra era movimento sem motivo. O que ficou da ideia é o que
 * importava, e está no cabeçalho: a barra é a mesma nos dois estados, com logo,
 * itens e botão no mesmo lugar e no mesmo tamanho.
 */

/** Altura da barra fixa, `h-24` no cabeçalho. */
const ALTURA_BARRA = 96;

export function usePassouOHero() {
  const [passou, setPassou] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("principal");
    let frame = 0;

    const medir = () => {
      frame = 0;
      // Página sem hero, como a 404: vale direto o estado de dentro da página.
      setPassou(!hero || hero.getBoundingClientRect().bottom <= ALTURA_BARRA);
    };

    const agendar = () => {
      if (frame) return;
      frame = requestAnimationFrame(medir);
    };

    // A primeira medida também vai pelo rAF: recarregar a página no meio da
    // rolagem precisa acertar o estado, e escrever estado direto no corpo do
    // efeito é render a mais e erro de lint.
    agendar();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
    };
  }, []);

  return passou;
}
