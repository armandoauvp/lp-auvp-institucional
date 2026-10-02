# Banco de imagens

**Estado atual: todas as fotografias da página estão mockadas.** Nenhuma foto
real é exibida. Cada lugar que receberá imagem mostra uma reserva editorial com
o briefing do que precisa ser produzido.

Este é o documento de trabalho entre conteúdo, design e produção audiovisual.

---

## 1. Como funciona a reserva de foto

Em `institucional/src/content/*.ts`, um item com `src: null` faz o componente `Figure`
desenhar uma moldura com hachura amarela, o rótulo `Foto pendente` e o briefing
em itálico:

```ts
photo: {
  /** Arquivado em acervo/fotos/sede-auvp-capital.webp */
  src: null as string | null,
  alt: "Sede da AUVP, em Goiânia.",
  caption: "Sede, Goiânia, Goiás",
  brief: "interior da sede: biblioteca, auditório ou sala de aula, paisagem 4:3",
},
```

Nas dobras em que a foto é o fundo da seção inteira (hero e encerramento), a
moldura não caberia: entra a `BackdropReserve`, que aplica só a textura e uma
etiqueta discreta no rodapé da dobra.

**Para publicar uma foto**, coloque o arquivo em `institucional/public/images/` e troque
`null` pelo caminho. Nada mais muda.

---

## 2. Fotos que a página espera

Resta **uma**, e ela não deixa buraco na página: a dobra publica hoje uma foto
que funciona.

O hero saiu desta lista. `private-day-plateia.webp` é registro próprio, não
aparece em nenhuma outra dobra e vem com 5168px de largura, folga suficiente
para uma dobra de sangria total.

O arquivo já trocou de fotografia uma vez, e a troca vale como critério: era o
palco, com o fundador de braços abertos diante do auditório, e passou a ser a
plateia em plano fechado. **Quem abre a página vê gente escutando, e não uma
pessoa falando**, que é a diferença entre uma instituição e um palestrante.

**Encerramento** (dobra final), paisagem larga

Estúdio com estantes de livros, plano aberto. Serve de fundo em baixa
opacidade, então tolera imagem menos perfeita. Existe registro no acervo.

### Como cada foto foi recortada

Todas as fotos publicadas foram recortadas para a proporção exata da dobra
antes de entrar no repositório, e **o recorte foi escolhido olhando a imagem**,
não por corte central automático. O registro serve para refazer, se a foto
precisar aparecer em outra proporção:

| Foto                                 | Origem    | Recorte                                    | Por quê                                                                                                                                                                                                                                                 |
| ------------------------------------ | --------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `private-day-salao.webp`             | 4200×2800 | 3:2, sem corte                             | Plano aberto: cabe inteiro                                                                                                                                                                                                                              |
| `private-day-palestras.webp`         | 1616×1080 | 4:3, fechado no convidado                  | O plano aberto do mesmo negativo agora abre a página. Aqui o recorte fecha na poltrona amarela e recusa a versão que pegava os dois: ela cortava a perna do entrevistador na borda                                                                      |
| `private-day-networking.webp`        | 2624×3936 | 4:3, janela em `y 280`                     | Retrato virando paisagem: a janela precisa pegar os dois rostos e o aperto de mãos. Um corte 150px mais baixo decepava a cabeça do homem à direita                                                                                                      |
| `ceia-ufg.webp`                      | 2730×1820 | 4:3, cortando 303px à esquerda             | Descarta as mesas vazias e mantém o grupo com a bandeira                                                                                                                                                                                                |
| `btg-pactual-time.webp`              | 1920×1080 | 4:3, largura centrada no grupo             | Descarta a escada vazia e a luz de palco                                                                                                                                                                                                                |
| `auvp-experience-hong-kong.webp`     | 4240×2832 | 4:3, janela em `x 475, y 150`              | O recorte anterior, de altura cheia, deixava o grupo 162px à esquerda do centro e sobrava margem à direita. A janela fechada centra o grupo e ainda descarta céu e asfalto vazios                                                                       |
| `auvp-atlas-embaixador.webp`         | 3072×2304 | 4:3, quase sem corte                       | O quadro já nasce 4:3 e bem composto: sai só uma faixa de piso embaixo                                                                                                                                                                                  |
| `private-day-plateia.webp`           | 5168×3448 | 3:2, sem corte, reduzida a 2400            | Abre a página em sangria total. O assunto é a plateia inteira, distribuída de ponta a ponta, sem um sujeito único que o corte possa perder: por isso entra sem recorte e quem decide o corte é o `object-cover`, conforme a altura da janela            |
| `b3-listagem-auvp11.webp`            | 6192×4128 | 4:3, cortando 688px à esquerda             | O painel AUVP11 encosta na borda direita e precisa continuar inteiro                                                                                                                                                                                    |
| `sede-auvp-capital.webp`             | 1920×1080 | sem corte                                  | Publicada como veio                                                                                                                                                                                                                                     |
| `gdb-itinerante-belo-horizonte.webp` | 1920×1280 | 4:3, largura centrada                      | Só sai faixa lateral: a plateia ocupa o quadro inteiro                                                                                                                                                                                                  |
| `gdb-itinerante-goiania.webp`        | 1200×1600 | girada −1,60°, depois 4:3 em `x 16, y 432` | Retrato virando paisagem, e a única foto da página que veio torta. A janela precisa pegar a câmera, os microfones e os dois à mesa: é o que faz a foto dizer que ali se grava um programa. Mais alta, entrava só a TV apagada; mais baixa, saía o tripé |

### As duas do Giro da Bolsa Itinerante

Vieram de `ProdutosAUVP/gdb-itinerante`, o repositório da landing do evento, e
os originais estão em `acervo/originais/gdb-*`. **Não são as únicas de lá, e
foram as duas escolhidas.** As outras seis são registro de celular em retrato,
de qualidade abaixo da linha desta página, e três delas são selfies. Estas duas
são as que sustentam a mesma moldura das do Private Day.

Uma é a plateia em Belo Horizonte, a outra é a gravação acontecendo em Goiânia.
Juntas dizem o que o evento é, e as duas cidades dizem por que ele se chama
itinerante. Uma só não diria.

Nada impede publicar mais uma edição depois: a grade da dobra mostra o que
estiver em `community.photos` depois da primeira foto, em duas colunas, e não
sabe quantas são.

### Esquadro

**Foto torta é o defeito que mais denuncia amadorismo numa página que se
apresenta como instituição**, e é sutil o bastante para passar: 1,6° de
inclinação dão vinte pixels de desnível numa moldura de 550px.

Antes de commitar uma foto:

```bash
npm run esquadro                          # todas as publicadas
npm run esquadro -- caminho/da/foto.jpg   # uma em particular
```

O script sai com código 1 se achar alguma torta. Ele **não roda na CI**, e é
de propósito: as fotos entram no repositório já recortadas e já no prumo, então
a hora de rodar é ao preparar a foto, não a cada push.

Ele responde uma de cinco coisas por foto: **no prumo**, **torta** (com o
ângulo a corrigir), **perspectiva**, **conferir a olho** (mediu um eixo só, que
não distingue as duas coisas) ou **sem referência** (não há reta longa na foto,
e um número aqui seria inventado).

**Torta e perspectiva são coisas diferentes, e confundi-las estraga foto.**
Câmera torta desloca as horizontais e as verticais no mesmo sentido e na mesma
medida; perspectiva desloca um eixo só. Girar uma foto que só tem perspectiva
entorta o que estava reto. Foi o que o script apurou aqui:

| Foto                             | Horizontais | Verticais | Diagnóstico                                    |
| -------------------------------- | ----------- | --------- | ---------------------------------------------- |
| `gdb-itinerante-goiania` (antes) | −1,53°      | −0,97°    | Torta: os dois eixos concordam. Corrigida      |
| `sede-auvp-capital`              | +3,24°      | +0,80°    | Fachada vista de baixo. Perspectiva, não mexer |
| `b3-listagem-auvp11`             | −6,25°      | +0,28°    | Painel oblíquo. Perspectiva, não mexer         |
| `auvp-atlas-embaixador`          | −3,57°      | −0,09°    | Prateleiras em fuga. Perspectiva, não mexer    |

As outras oito são multidão, palco escuro ou paisagem: não têm reta longa, saem
como "sem referência" e foram conferidas a olho, com grade sobreposta.

**Uma foto torta se corrige a partir do original: gira primeiro, recorta
depois.** Girar o arquivo já recortado obriga a recortar de novo para descartar
as cunhas vazias dos cantos, e cada recorte come enquadramento. Depois de
girar, rode o script na foto nova: ele tem que dizer "no prumo".

O ângulo que ele sugere é estimativa, não medida exata, porque plano em fuga
puxa o eixo vertical mesmo em foto reta. A conferência é sempre a segunda
passada.

Para saber se o próprio script ainda enxerga:

```bash
npm run esquadro -- --autoteste
```

Ele toma uma foto que considera no prumo, entorta de propósito em quatro
ângulos e cobra o veredito. Se um ajuste de parâmetro cegar o detector, isso
reprova.

**Ao adicionar uma foto, recorte antes de commitar.** A página não recorta: o
`Figure` define a proporção da moldura e a imagem preenche com `object-cover`,
então uma foto na proporção errada é cortada pelo navegador, no centro, sem
critério nenhum.

**Duas fotos publicadas têm dominante azul**, a do BTG e a da B3. É a cor do
palco e do painel, não uma escolha de arte, mas elas são hoje o ponto da página
mais distante de amarelo, branco e preto. Se incomodar, tratamento em preto e
branco resolve sem trocar a foto.

### Logos dos apoiadores (dobra 10)

Quando o arquivo falta, a dobra exibe o nome em versalete espaçado, o que
funciona e é honesto, mas logo é mais forte.

**O CEIA está em `institucional/public/images/brand/ceia.png`**, o único arquivo local do
conjunto. Veio em PNG de 244×82 com fundo transparente, e 82px é o limite: a
dobra o exibe com 80px de altura, ou seja, em 1x, e numa tela retina ele fica
macio. Trocar por SVG quando o CEIA ou a UFG enviarem um.

As quatro ficam lado a lado, numa fileira só, **em escala de cinza**. São marcas
de quatro donos diferentes, cada uma com a própria paleta, e em cor própria elas
viravam a área mais colorida de uma página de três cores.

Para caber na fileira, a coluna do título encolheu para 0,52 contra 1,48 da
coluna das logos: na divisão anterior cada célula ficava com 134px e o
`max-w-full` esmagava as logos largas a menos da metade da altura pedida. A
restrição sempre foi de largura, não de altura. Com a célula em 170px, `h-14` é
o teto para um arquivo de proporção 3:1.

**Os outros três estão na página servidos pelo CDN da AUVP**
(`cdn.asupernova.com.br`), o mesmo que serve a landing de produção da escola.
BTG Pactual, Governo de Goiás e R7 são carregados de lá, direto por `<img>`.

**Isso é temporário, de propósito.** Depender do CDN de outro projeto para uma
logo de terceiro numa página institucional é frágil. O passo certo é baixar os
arquivos:

```bash
mkdir -p public/images/brand
curl -L "https://cdn.asupernova.com.br/lp-auvp/vite/btg%20pactual.png" \
  -o public/images/brand/btg-pactual.png
curl -L "https://cdn.asupernova.com.br/lp-auvp/vite/1-1024x596.webp" \
  -o public/images/brand/governo-de-goias.webp
curl -L "https://cdn.asupernova.com.br/lp-auvp/vite/r7-300x257-1.webp" \
  -o public/images/brand/r7.webp
```

Depois é só trocar o campo `logo` em `institucional/src/content/endorsements.ts` pelos
caminhos locais e remover a entrada de `remotePatterns`.

As logos aparecem **em cor própria e em corpo grande**, num bloco de quatro ao
lado do título. Não há carrossel: quatro itens cabem na tela, e um carrossel com
poucos itens passa a mesma marca duas vezes por ciclo enquanto esconde parte do
conjunto a cada instante.

Se alguma logo deixar de carregar, aparece o nome em versalete no lugar:
`EndorsementLogo` tem essa reserva, então uma URL quebrada nunca produz o ícone
de imagem quebrada.

**Confira antes de publicar.** São arquivos rasterizados, não SVG, e vêm de uma
página com fundo escuro:

- **Fundo transparente é o esperado.** O carrossel fica sobre papel branco. A
  página aplica `mix-blend-multiply`, que some com fundo branco chapado, mas
  fundo escuro apareceria como um bloco. **Nenhum dos três arquivos foi
  conferido visualmente.**
- **O do Governo de Goiás merece atenção.** O arquivo se chama
  `1-1024x596.webp` e tem proporção de banner, não de logotipo. Pode ser uma
  arte com fundo, e não a marca isolada.
- **O ideal continua sendo SVG monocromático**, traçado em preto puro, sem fundo
  e sem sombra. A página aplica opacidade e `grayscale`, então versão colorida
  não é necessária. Se o time de design tiver os vetores, eles são preferíveis
  aos rasterizados do CDN.

**O CEIA não está em nenhum dos dois repositórios.** Precisa ser pedido ao time
do CEIA ou à UFG, de preferência em SVG.

> **Direito de uso:** logo de terceiro exige autorização de uso da marca. Antes
> de publicar, confirmar com o jurídico que existe permissão para os quatro,
> especialmente Governo de Goiás e BTG Pactual.

---

## 3. O acervo arquivado

Nada em `acervo/` é publicado. A pasta está fora de `public/` de propósito: o
site é export estático, e tudo que fica em `public/` é copiado para o build e
servido a cada visitante.

### `acervo/originais/`, arquivos em resolução cheia

Os originais como vieram, com os nomes de origem. Ficam fora de
`public/` porque **tudo que está em `public/` é copiado para o build e servido a
cada visitante**: são cerca de 3,5 MB que ninguém precisa baixar. Servem de
fonte quando for preciso gerar um recorte novo.

Entre eles está `item 1 - imagem vertical quem somos.webp`, que chegou junto com
as outras e ainda **não foi atribuída a nenhuma dobra**: Raul erguendo um troféu
num palco de luz azul. É a foto mais literal de "recebendo o prêmio" que o
roteiro pede para o BTG, embora a dobra use hoje a do time inteiro. Vale
decidir.

### `acervo/fotos/`, material aproveitável

Quatro fotos do site anterior, tiradas da página quando as imagens foram
mockadas. Continuam disponíveis e valem consideração quando a produção começar.
A quinta, a fachada da sede, voltou para `institucional/public/images/` e está publicada na
dobra de missão.

| Arquivo                     | Leitura                                                                                                                                   | Recorte sugerido                                                                                                                                                                                                                                                         |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `raul-sena-biblioteca.webp` | O melhor ativo do acervo. Marcenaria escura, estantes de livros encadernados, poltrona de couro. É o repertório visual de Wharton e Yale. | Cortar a câmera desfocada do primeiro plano à direita (cerca de 22% da largura) e fechar em 3:2 sobre estante e poltrona. O equipamento de vídeo entrega "creator"; a estante entrega o contrário. Atenção à boneca e aos objetos pessoais na estante superior esquerda. |
| `sede-auvp-capital.webp`    | Fachada da sede em Goiânia. Painel verde-escuro, letreiro dourado, arquitetura sóbria.                                                    | Para 4:3, cortar centrado no letreiro mantendo o galho de árvore do canto superior esquerdo, que dá profundidade e evita a leitura de catálogo imobiliário. **Nota de marca:** o verde e o dourado da fachada não pertencem à paleta da escola.                          |
| `raul-sena-palco-b3.webp`   | Ambiente corporativo azul, sujeito deslocado para a direita.                                                                              | **O azul do fundo conflita com a paleta.** Se for usada, precisa de tratamento em preto e branco.                                                                                                                                                                        |
| `raul-sena-ipo-auvp11.webp` | Cerimônia de listagem na B3, painel azul institucional ao fundo.                                                                          | Crop 4:3 fechado no busto e no painel. Mesmo problema de azul, mesma solução.                                                                                                                                                                                            |
| `raul-sena-retrato.webp`    | Retrato posado, letreiro de neon ao fundo.                                                                                                | O neon é o **logo antigo**, que conflita com a serifa. Crop vertical 3:4 fechado no busto, cortando todo o lado direito. Sem o neon, sobra um retrato de fundo escuro e luz lateral quente, ótimo para um bloco de fundador.                                             |

### `acervo/legado/`, branding antigo

Fora de uso, e não devem entrar na página.

| Arquivo                                  | Por que não entra                                                                                                                                                              |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `modulo-1` a `modulo-7`, `modulo-bonus`  | Cards do branding antigo: preto e ouro, sans condensada, ícones em degradê metálico. Substituídos por ícones em traço fino (`institucional/src/components/ui/ModuleIcon.tsx`). |
| `prancheta-55-300x300.png`               | Selo "Garantia 100% AUVP" skeuomórfico, com relevo e estrelas. O roteiro pede ícone simples de escudo com check, feito em SVG.                                                 |
| `computer-contador-de-proxima-turma.png` | Mockup de contagem regressiva de campanha. Urgência de lançamento é o oposto do tom institucional.                                                                             |

Também foi descartado o `hero (1).webp`, duplicata byte a byte de `hero.webp`.

---

## 4. Padrão técnico

| Item              | Regra                                                                         |
| ----------------- | ----------------------------------------------------------------------------- |
| Formato           | `.webp`, qualidade 80 a 85                                                    |
| Largura máxima    | 2400px em faixa larga, 1600px em card e retrato                               |
| Peso alvo         | até 250 KB por arquivo                                                        |
| Redimensionamento | obrigatório antes do commit                                                   |
| Nome              | minúsculas, sem acento, separado por hífen: `private-day-2025-palestras.webp` |
| Local             | `institucional/public/images/`                                                |
| Proporção         | recorte feito no arquivo, não no CSS                                          |

**Sobre redimensionar:** o site roda em hospedagem estática, sem otimizador de
imagem. O navegador baixa o arquivo exatamente como ele está no
repositório, sem variante por breakpoint. Uma foto de 6000px custa a mesma banda
no celular e no desktop.

```bash
npx sharp-cli --input original.jpg --output institucional/public/images/nome-da-foto.webp \
  resize 2000 --withoutEnlargement -- webp --quality 82
```

As fotos do acervo já passaram por isso: a da B3 saiu de 6192px e 606 KB para
2000px e 55 KB, e a do palco de 2560px e 538 KB para 2000px e 40 KB, sem
diferença visível no tamanho em que apareciam na tela.

**Sobre acento e espaço em nome de arquivo:** os arquivos originais chegaram
como `Conhe%C3%A7a%20Raul%20Sena%20mobile.webp`. Isso quebra em servidor Linux e
em CDN. Todo arquivo novo entra normalizado.

**Texto alternativo:** toda imagem precisa de `alt` descritivo em português, no
próprio arquivo de conteúdo. Descreve o que se vê, não o que se quer provar:
"Raul Sena discursa na cerimônia de listagem de um ETF da AUVP na B3", e não
"Sucesso da AUVP na bolsa".

---

## 5. Direção de fotografia

Para que o conjunto leia como escola clássica, e não como funil de lançamento:

- **Luz natural ou contínua quente.** Nunca flash direto no rosto.
- **Cor dessaturada.** Madeira, papel, preto, branco. A paleta da escola é
  amarelo, branco e preto: fotografia com dominante azul ou verde briga com ela.
  Quando o cenário não colabora, preto e branco resolve e é mais elegante.
- **Pessoas trabalhando, não posando.** Olhar para a câmera só em retrato formal.
- **Arquitetura no quadro.** Pé-direito, estante, janela, coluna. O espaço
  físico é parte do argumento de solidez.
- **Sem elemento de urgência.** Contagem regressiva, seta, selo, círculo vermelho.
- **Sem o branding antigo no quadro.** Olho espiral e tipografia arredondada
  contradizem o logo serifado que sustenta a página.
