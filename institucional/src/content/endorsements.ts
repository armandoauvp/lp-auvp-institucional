/**
 * Dobra 10: acreditam no nosso trabalho.
 *
 * `logo` aponta para um arquivo em /public/images/brand. Enquanto ele não
 * existe, o carrossel exibe o nome em versalete espaçado, que funciona e é
 * honesto.
 *
 * `origem` guarda o endereço de onde o arquivo pode ser baixado, quando ele já
 * existe em algum lugar. Ver a seção de logos em docs/ASSETS.md para o comando
 * de download e para o padrão que o arquivo precisa atender.
 */

export type Endorsement = {
  name: string;
  logo: string | null;
  /** De onde baixar o arquivo. `null` quando ainda não há fonte conhecida. */
  origem: string | null;
};

export const endorsements = {
  title: "Acreditam no nosso trabalho.",
  items: [
    {
      name: "CEIA",
      // Único arquivo local do conjunto. Veio em PNG de 244x82, que é o
      // limite da resolução: renderizado a 80px de altura ele fica em 1x e
      // perde nitidez em tela retina. Trocar por um SVG quando o CEIA ou a
      // UFG enviarem um.
      logo: "/images/brand/ceia.png",
      origem: null,
    },
    {
      name: "BTG Pactual",
      logo: "https://cdn.asupernova.com.br/lp-auvp/vite/btg%20pactual.png",
      origem: "https://cdn.asupernova.com.br/lp-auvp/vite/btg%20pactual.png",
    },
    {
      name: "Governo de Goiás",
      logo: "https://cdn.asupernova.com.br/lp-auvp/vite/1-1024x596.webp",
      origem: "https://cdn.asupernova.com.br/lp-auvp/vite/1-1024x596.webp",
    },
    {
      name: "R7",
      logo: "https://cdn.asupernova.com.br/lp-auvp/vite/r7-300x257-1.webp",
      origem: "https://cdn.asupernova.com.br/lp-auvp/vite/r7-300x257-1.webp",
    },
  ] satisfies Endorsement[],
} as const;
