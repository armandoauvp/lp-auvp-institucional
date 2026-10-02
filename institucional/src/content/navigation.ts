/**
 * Itens da barra fixa. `href` com # aponta para o id de uma dobra.
 *
 * **A ordem daqui é a ordem em que as dobras aparecem na página**, e é assim
 * que precisa continuar. Havia aqui "Dúvidas frequentes" antes de "Consultoria
 * especializada" enquanto na página a consultoria vinha primeiro: um menu que
 * lista fora de ordem faz quem lê perder a noção de onde está, que é
 * justamente o que um menu deveria dar.
 */

export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

export const primaryNav: NavItem[] = [
  { label: "Principal", href: "#principal" },
  { label: "Nosso processo", href: "#processo" },
  { label: "Consultoria especializada", href: "#iniciativas" },
  { label: "Dúvidas frequentes", href: "#faq" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "A instituição",
    items: [
      { label: "Missão", href: "#missao" },
      { label: "Conteúdo programático", href: "#conteudo" },
      { label: "Nosso processo", href: "#processo" },
      { label: "Comunidade", href: "#comunidade" },
    ],
  },
  {
    title: "Iniciativas",
    items: [
      { label: "AUVP Capital", href: "#iniciativas" },
      { label: "AUVP Wealth", href: "#iniciativas" },
      { label: "Nossos ETFs", href: "#etfs" },
      { label: "AUVP Pro", href: "#iniciativas" },
    ],
  },
];
