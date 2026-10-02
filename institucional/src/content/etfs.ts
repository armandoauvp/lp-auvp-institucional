/** Dobra 09: nossos ETFs. */

import { links } from "@/content/site";

export type Etf = {
  ticker: string;
  category: string;
  /**
   * Classe de cor da identidade do fundo, aplicada apenas ao subtitulo (a
   * categoria) dentro da dobra de fundo tinta. O literal precisa ficar
   * escrito por extenso para o Tailwind enxergar a classe na varredura.
   * Ver o bloco de tokens `--color-etf-*` em src/app/globals.css.
   */
  accentClass: string;
  description: string;
  /**
   * O fundo dentro de `auvpetfs.com.br`, que é onde a metodologia e a
   * composição de cada um ficam abertas. O site é de página única e cada fundo
   * é uma âncora nela, daí o `#`: não são quatro páginas, são quatro pontos da
   * mesma. Os quatro cartões apontaram um tempo para a raiz, porque o caminho
   * de cada fundo não estava em lugar nenhum que eu pudesse ler.
   */
  href: string;
};

export const etfsSection = {
  title: "Nossos ETFs.",
  subtitle:
    "Fundos de índice construídos com método, não com achismo. Quatro estratégias para acompanhar a evolução da carteira do investidor, cada uma com regras claras e transparentes.",
  ctaLabel: "Conheça todos os ETFs da AUVP",
  photo: {
    src: "/images/b3-listagem-auvp11.webp" as string | null,
    alt: "Raul Sena discursa diante do painel do AUVP11 na cerimônia de listagem.",
    caption: "Cerimônia de listagem na B3",
    brief: "pregão da B3 no dia da listagem, paisagem 4:3",
  },
} as const;

export const etfs: Etf[] = [
  {
    ticker: "AUVP11",
    category: "Ações",
    accentClass: "text-etf-auvp11",
    description:
      "Empresas sólidas, selecionadas por fundamentos consistentes e estrutura de capital saudável.",
    href: `${links.etfs}#auvp11`,
  },
  {
    ticker: "AUPO11",
    category: "Renda Fixa",
    accentClass: "text-etf-aupo11",
    description:
      "Carteira de renda fixa com controle de prazo, critérios objetivos e rebalanceamento periódico.",
    href: `${links.etfs}#aupo11`,
  },
  {
    ticker: "AREA11",
    category: "Fundos Imobiliários",
    accentClass: "text-etf-area11",
    description:
      "Alocação organizada em fundos imobiliários, com foco em distribuição de renda mensal.",
    href: `${links.etfs}#area11`,
  },
  {
    ticker: "ABTC11",
    category: "Bitcoin + Renda Fixa",
    accentClass: "text-etf-abtc11",
    description:
      "Combinação dinâmica entre Bitcoin e renda fixa, com alocação baseada no sentimento do mercado.",
    href: `${links.etfs}#abtc11`,
  },
];
