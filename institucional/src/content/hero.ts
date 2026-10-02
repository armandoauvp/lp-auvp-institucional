/** Dobra 01: hero. */

export const hero = {
  positioning: "A maior escola de investimentos do Brasil",
  /**
   * O título vem partido em dois porque a dobra o distribui nos cantos de
   * baixo, um em cada ponta da mesma linha de base. Lido em voz alta continua
   * sendo uma frase só: "Aprenda a investir. Viva com liberdade."
   */
  headline: {
    left: ["Aprenda", "a investir."],
    right: ["Viva com", "liberdade."],
  },
  support:
    "A AUVP forma investidores independentes, capazes de tomar suas próprias decisões financeiras e construir patrimônio com autonomia. Uma instituição criada para mudar a relação do brasileiro com o dinheiro.",
  ctaLabel: "Estude com a AUVP",
  photo: {
    src: "/images/private-day-plateia.webp" as string | null,
    alt: "Plateia do Private Day da AUVP acompanhando uma palestra, em plano fechado.",
    /**
     * Plano fechado da plateia, e não do palco: quem abre a página vê gente
     * escutando, que é o que a instituição faz, e não uma pessoa falando.
     *
     * O quadro já nasce 3:2 e entra sem recorte, então quem decide o corte é o
     * `object-cover`, conforme a altura da janela. Serve nas duas direções: o
     * assunto é uma plateia inteira, distribuída de ponta a ponta, então não há
     * um sujeito que possa ficar de fora quando a janela aperta.
     */
    brief:
      "plano fechado da plateia atenta, escuro e quente, sem um sujeito único que o corte possa perder, paisagem 3:2 com 2400px ou mais",
  },
} as const;
