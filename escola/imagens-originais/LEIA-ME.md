# Imagens originais

Masters em alta resolução das capas do mural de novidades e do selo do BTG.
Ficam **fora de `public/`** de propósito: o Vite copia `public/` inteira para o build, então um
arquivo aqui dentro seria publicado a cada deploy mesmo sem ninguém
referenciá-lo — e estes somam mais de 6 MB.

As capas que vão para o ar **não moram no repositório**: são servidas pelo CDN,
em `https://cdn.asupernova.com.br/LP AUVP ESCOLA/`, como o resto das imagens da
página. O que fica aqui é a fonte para regerar ou recortar de novo.

| Original | Capa publicada | Onde aparece |
|---|---|---|
| `Captura de tela 2026-08-17 180614.png` | `carteiras.webp` | card "Carteiras recomendadas" |
| `kanchanara-4KJJezDyo3M-unsplash.jpg` | `cripto.webp` | card "Módulo bônus de criptomoedas" |
| `kimberly-farmer-lUaaKCUANVI-unsplash.jpg` | — | **sem uso hoje**: o card "Cadernos de exercícios" saiu do mural. O master fica aqui caso ele volte. |
| `1 LUGAR NO RANKING-100.jpg` | `1 LUGAR NO RANKING-100.jpg` (o próprio master, no CDN) | selo na dobra "Acreditam no nosso trabalho" |

O selo do BTG é a exceção da tabela: ele foi para o CDN sem recorte nem
conversão, então o arquivo publicado é o próprio master de 1080×1080 — quase
1 MB para um selo que aparece a 96px. Gerar um WebP de 320px derrubaria isso
para ~7 KB, se algum dia valer o retrabalho.

As outras capas do mural (`minha-auvp`, `etfs`, `modulo-analitica` e
`escola-regravada`) vieram das artes do Mural de Novidades da Central de
Produto, e o master delas vive lá, em `src/assets/novidades/` e
`src/assets/lps/`.

Os nomes dos arquivos do Unsplash preservam autoria e origem: Kanchanara e
Kimberly Farmer. A licença do Unsplash permite uso comercial sem atribuição
obrigatória, mas manter o crédito no nome do arquivo custa nada e resolve
qualquer dúvida futura sobre a procedência.

## Ao trocar uma capa

O padrão das capas é **WebP em 800×400** (recorte 2:1). Gere o arquivo a partir
do master, suba no CDN na mesma pasta e ajuste o `src` no `index.html` — nada
no build depende desta pasta.
