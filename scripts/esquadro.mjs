/**
 * Mede o esquadro das fotografias da página: elas estão no prumo, ou tortas?
 *
 * Foto torta é o defeito que mais denuncia amadorismo numa página que se
 * apresenta como instituição, e é sutil o bastante para passar batido. Um grau
 * e meio de inclinação são vinte pixels de desnível numa moldura de 550px:
 * incomoda quem olha sem que a pessoa saiba dizer por quê.
 *
 * ## Como usar
 *
 *     npm run esquadro                      # todas as fotos publicadas
 *     npm run esquadro -- institucional/public/images/x.webp acervo/originais/y.jpg
 *
 * Sai com código 1 se alguma foto estiver torta. **Não roda no CI**, e é de
 * propósito: as fotos entram no repositório já recortadas e já no prumo, então
 * a hora de rodar é ao preparar a foto, não a cada push. Ver `docs/ASSETS.md`.
 *
 * ## Como funciona
 *
 * Contar pixels de contorno não basta: textura de multidão dá gradiente em
 * toda direção, e a média disso não significa nada. O que distingue uma reta
 * de uma textura é a **colinearidade**, e é ela que este script mede.
 *
 * Para cada ângulo candidato, os pixels de contorno são jogados num
 * histograma pela distância à origem medida naquele ângulo. Pixels que estão
 * numa mesma reta caem todos na mesma casa e formam um pico; textura se
 * espalha por todas. O ângulo em que o histograma fica mais espetado é o
 * alinhamento das retas da foto. É a ideia da transformada de Hough, reduzida
 * ao que este problema precisa: uma varredura de doze graus em vez de um
 * acumulador de plano inteiro.
 *
 * **As quase horizontais e as quase verticais são medidas em separado, e essa
 * é a parte que faz o teste valer.** Câmera torta desloca os dois grupos no
 * mesmo sentido e na mesma medida. Perspectiva desloca um só: a fachada da
 * sede, fotografada de baixo, tem as horizontais fora do esquadro e as
 * verticais a prumo. Num número único as duas coisas ficam idênticas, e girar
 * uma foto que só tem perspectiva entorta o que estava reto.
 *
 * Fotos sem reta longa (multidão, palco escuro, paisagem) saem como "sem
 * referência": não há o que medir nelas, e dizer isso é mais honesto do que
 * devolver um número tirado de textura.
 */

import { readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

/** Fotos publicadas ficam aqui. É o alvo padrão. */
const PASTA_PADRAO = "institucional/public/images";

/** Lado maior da análise. Acima disso o ganho some e o custo cresce. */
const LADO = 1400;

/**
 * Metade da varredura, em graus. Mais larga, e a busca começa a encontrar
 * diagonais de verdade (uma escada, um braço levantado) como se fossem
 * horizontal fora de esquadro.
 */
const FAIXA = 6;

/** Passo grosso e passo fino da varredura, em graus. */
const PASSO_GROSSO = 0.25;
const PASSO_FINO = 0.02;

/** Fração dos pixels de gradiente mais forte que entra na conta. */
const FRACAO_CONTORNO = 0.05;

/**
 * Expoente do somatório de nitidez. Dois já premia concentração; três abre a
 * distância entre foto com reta e foto de textura, que é o que o corte de
 * confiança precisa enxergar. Acima de três a escala infla sem separar mais.
 */
const EXPOENTE = 3;

/** A partir daqui a inclinação é visível numa moldura da página. */
const LIMITE_TORTA = 0.4;

/**
 * Quanto o pico precisa se destacar da média da varredura para o eixo contar
 * como referência. Abaixo disso a curva é plana: não há reta dominante, só
 * textura, e o ângulo do máximo é sorteio.
 *
 * Nas fotos desta página o corte separa com folga: as que têm arquitetura
 * ficam entre 3x e 8x, as de multidão e paisagem entre 1,1x e 1,9x. Sem ele,
 * a foto do time no palco do BTG, que é gente e luz e mais nada, saía como
 * torta em 1,4 graus, e girá-la teria estragado uma foto que está certa.
 */
const DESTAQUE_MINIMO = 2.0;

/**
 * Quanto os dois eixos podem divergir e ainda contarem como a mesma
 * inclinação: `max(FOLGA_BASE, FOLGA_RELATIVA × maior dos dois)`.
 *
 * Os dois termos existem por motivos diferentes, e nenhum sozinho resolve.
 *
 * A folga fixa cobre o viés que sobra em foto de interior: nem toda vertical
 * está mesmo a prumo, e ripa de lambri em fuga puxa o eixo vertical quase um
 * grau sem que a câmera esteja torta. Só com o termo relativo, uma foto
 * inclinada 1 grau caía como perspectiva, porque 0,8 de viés é quase tudo
 * que ela tem. O autoteste cobre exatamente esse caso.
 *
 * A folga proporcional cobre o oposto: entre eixos que marcam 6 graus, meio
 * grau de diferença não significa nada, e uma tolerância fixa deixaria passar
 * como torta o que é fuga de perspectiva. A fachada da sede marca +3,2 nas
 * horizontais e +0,8 nas verticais: 2,4 graus de diferença, muito além do que
 * o proporcional admite.
 */
const FOLGA_BASE = 0.9;
const FOLGA_RELATIVA = 0.35;

/** Mínimo de pixels de contorno num eixo para ele valer alguma coisa. */
const MINIMO_PIXELS = 1500;

/**
 * Gira `graus` e devolve o miolo, para o autoteste.
 *
 * O miolo é o que sobra sem as cunhas vazias que a rotação abre nos cantos:
 * medir o esquadro de uma borda preta em diagonal seria medir a própria
 * moldura, não a foto.
 */
async function giradaParaTeste(arquivo, graus) {
  const girada = sharp(arquivo).rotate(graus, { background: "#000" });
  const { width, height } = await girada.metadata();
  const largura = Math.round(width * 0.7);
  const altura = Math.round(height * 0.7);
  return girada
    .extract({
      left: Math.round((width - largura) / 2),
      top: Math.round((height - altura) / 2),
      width: largura,
      height: altura,
    })
    .toBuffer();
}

async function cinza(arquivo) {
  const { data, info } = await sharp(arquivo)
    .greyscale()
    .blur(1.2) // tira grão e textura fina sem comer contorno de arquitetura
    .resize({
      width: LADO,
      height: LADO,
      fit: "inside",
      withoutEnlargement: true,
    })
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { px: data, largura: info.width, altura: info.height };
}

/**
 * Pixels de contorno, separados por eixo.
 *
 * Um contorno horizontal tem gradiente vertical: o brilho muda ao subir, não
 * ao andar de lado. Por isso `|gy| > |gx|` classifica como horizontal.
 */
function contornos({ px, largura, altura }) {
  const h = { x: [], y: [], p: [] };
  const v = { x: [], y: [], p: [] };
  const forcas = [];

  const gxs = new Float32Array((largura - 2) * (altura - 2));
  const gys = new Float32Array((largura - 2) * (altura - 2));

  let k = 0;
  for (let y = 1; y < altura - 1; y++) {
    for (let x = 1; x < largura - 1; x++, k++) {
      const i = y * largura + x;
      const cima = i - largura;
      const baixo = i + largura;
      const gx =
        px[cima + 1] +
        2 * px[i + 1] +
        px[baixo + 1] -
        (px[cima - 1] + 2 * px[i - 1] + px[baixo - 1]);
      const gy =
        px[baixo - 1] +
        2 * px[baixo] +
        px[baixo + 1] -
        (px[cima - 1] + 2 * px[cima] + px[cima + 1]);
      gxs[k] = gx;
      gys[k] = gy;
      forcas.push(Math.abs(gx) + Math.abs(gy));
    }
  }

  // O corte é por quantil, e não por um valor fixo: foto escura e foto clara
  // não têm o mesmo gradiente.
  const ordenadas = Float64Array.from(forcas).sort();
  const corte = ordenadas[Math.floor(ordenadas.length * (1 - FRACAO_CONTORNO))];

  k = 0;
  for (let y = 1; y < altura - 1; y++) {
    for (let x = 1; x < largura - 1; x++, k++) {
      const gx = gxs[k];
      const gy = gys[k];
      if (Math.abs(gx) + Math.abs(gy) < corte) continue;
      const alvo = Math.abs(gy) > Math.abs(gx) ? h : v;
      alvo.x.push(x);
      alvo.y.push(y);
      alvo.p.push(Math.abs(gy) > Math.abs(gx) ? Math.abs(gy) : Math.abs(gx));
    }
  }
  return { h, v, largura, altura };
}

/**
 * O quanto o histograma fica espetado quando os pixels são projetados no
 * ângulo `graus`. Soma dos quadrados: concentrar a mesma massa em menos casas
 * aumenta o valor, espalhar diminui.
 *
 * Horizontais projetam em `y - x·tan θ`, que é constante ao longo de uma reta
 * de inclinação `tan θ`. Verticais projetam em `x + y·tan θ`, com o sinal
 * trocado porque girar a imagem inclina os dois eixos em sentidos opostos: é
 * o que põe os dois números na mesma régua.
 */
function nitidez(pontos, graus, eixo, casas) {
  const t = Math.tan((graus * Math.PI) / 180);
  const acumulador = new Float64Array(casas);
  const deslocamento = casas / 2;
  const { x, y, p } = pontos;
  for (let i = 0; i < x.length; i++) {
    const d = eixo === "H" ? y[i] - x[i] * t + deslocamento : x[i] + y[i] * t;
    const casa = Math.round(d);
    if (casa >= 0 && casa < casas) acumulador[casa] += p[i];
  }
  let soma = 0;
  for (const valor of acumulador) soma += valor ** EXPOENTE;
  return soma;
}

/** Varre a faixa e devolve o ângulo de maior nitidez, com seu destaque. */
function alinhamento(pontos, eixo, largura, altura) {
  if (pontos.x.length < MINIMO_PIXELS) return null;
  const casas = eixo === "H" ? altura + largura : largura + altura;

  const curva = [];
  for (let g = -FAIXA; g <= FAIXA + 1e-9; g += PASSO_GROSSO) {
    curva.push([g, nitidez(pontos, g, eixo, casas)]);
  }
  const media = curva.reduce((s, [, n]) => s + n, 0) / curva.length;
  let [melhor, pico] = curva.reduce((a, b) => (b[1] > a[1] ? b : a));

  for (
    let g = melhor - PASSO_GROSSO;
    g <= melhor + PASSO_GROSSO + 1e-9;
    g += PASSO_FINO
  ) {
    const n = nitidez(pontos, g, eixo, casas);
    if (n > pico) {
      pico = n;
      melhor = g;
    }
  }

  return { graus: melhor, destaque: pico / media, pixels: pontos.x.length };
}

async function medir(arquivo) {
  const { h, v, largura, altura } = contornos(await cinza(arquivo));
  return {
    H: alinhamento(h, "H", largura, altura),
    V: alinhamento(v, "V", largura, altura),
  };
}

/**
 * O diagnóstico, que é o ponto do script inteiro.
 *
 * Torta é quando os dois eixos apontam para o mesmo lado e na mesma ordem de
 * grandeza. Eixos que discordam é perspectiva: a foto está no prumo e o que
 * se vê é a cena se afastando da câmera.
 *
 * O ângulo sugerido é o do eixo de maior destaque, e não a média dos dois: o
 * eixo mais bem definido é o que menos sofre com plano em fuga, e a média
 * puxa a estimativa para baixo. Ainda assim é estimativa. A conferência é
 * rodar o script de novo na foto já girada: ele tem que dizer "no prumo".
 */
function diagnosticar(eixos) {
  const uteis = Object.entries(eixos).filter(
    ([, e]) => e && e.destaque >= DESTAQUE_MINIMO,
  );
  if (uteis.length === 0) return { estado: "sem-referencia" };

  const forte = uteis.reduce((a, b) =>
    b[1].destaque > a[1].destaque ? b : a,
  )[1];

  if (uteis.length === 2) {
    const { H, V } = eixos;
    const maior = Math.max(Math.abs(H.graus), Math.abs(V.graus));
    const folga = Math.max(FOLGA_BASE, FOLGA_RELATIVA * maior);
    const inclinacao = (H.graus + V.graus) / 2;

    if (Math.abs(H.graus - V.graus) > folga) return { estado: "perspectiva" };
    return Math.abs(forte.graus) >= LIMITE_TORTA
      ? { estado: "torta", inclinacao: forte.graus }
      : { estado: "no-prumo", inclinacao };
  }

  // Um eixo só não distingue as duas coisas: pode ser um plano em fuga. Vira
  // pedido de olho humano, não veredito.
  return Math.abs(forte.graus) >= LIMITE_TORTA
    ? { estado: "conferir", inclinacao: forte.graus }
    : { estado: "no-prumo", inclinacao: forte.graus };
}

const ROTULOS = {
  torta: "TORTA",
  conferir: "conferir a olho",
  perspectiva: "perspectiva",
  "no-prumo": "no prumo",
  "sem-referencia": "sem referência",
};

function comSinal(g) {
  return `${g >= 0 ? "+" : ""}${g.toFixed(2)}°`;
}

async function alvos() {
  const pedidos = process.argv.slice(2);
  if (pedidos.length > 0) return pedidos;
  const nomes = await readdir(PASTA_PADRAO);
  return nomes
    .filter((n) => /\.(webp|jpe?g|png)$/i.test(n))
    .sort()
    .map((n) => path.join(PASTA_PADRAO, n));
}

/**
 * Prova que o script ainda detecta o que promete.
 *
 * Toma uma foto que ele diz estar no prumo, entorta de propósito e cobra o
 * veredito. É o teste que faltaria se a única prova fosse a memória de quem
 * escreveu: se um ajuste de parâmetro cegar o detector, isto reprova.
 */
async function autoteste() {
  const referencia = "institucional/public/images/gdb-itinerante-goiania.webp";
  const inclinacoes = [-2, -1, 1, 2];
  let falhas = 0;

  console.log(`Autoteste em ${path.basename(referencia)}:\n`);
  const base = diagnosticar(await medir(referencia));
  const baseOk = base.estado === "no-prumo";
  console.log(
    `  sem girar        ${ROTULOS[base.estado].padEnd(16)} ${baseOk ? "ok" : "FALHOU: deveria estar no prumo"}`,
  );
  if (!baseOk) falhas++;

  for (const graus of inclinacoes) {
    const d = diagnosticar(
      await medir(await giradaParaTeste(referencia, graus)),
    );
    // sharp gira no sentido horário; a medida é do mesmo sinal.
    const acertou =
      d.estado === "torta" &&
      Math.sign(d.inclinacao) === Math.sign(graus) &&
      Math.abs(d.inclinacao - graus) <= 0.6;
    if (!acertou) falhas++;
    console.log(
      `  girada ${comSinal(graus).padEnd(9)} ${ROTULOS[d.estado].padEnd(16)} ` +
        `${d.inclinacao === undefined ? "--" : comSinal(d.inclinacao)}  ` +
        `${acertou ? "ok" : "FALHOU"}`,
    );
  }

  console.log(falhas === 0 ? "\nPassou." : `\n${falhas} falha(s).`);
  return falhas;
}

if (process.argv.includes("--autoteste")) {
  process.exit((await autoteste()) === 0 ? 0 : 1);
}

const arquivos = await alvos();
let tortas = 0;

for (const arquivo of arquivos) {
  const eixos = await medir(arquivo);
  const d = diagnosticar(eixos);
  const coluna = ["H", "V"]
    .map((k) =>
      eixos[k]
        ? `${k} ${comSinal(eixos[k].graus)} (${eixos[k].destaque.toFixed(2)}x)`
        : `${k} --`,
    )
    .join("  ");
  const grau = d.inclinacao === undefined ? "" : `  ${comSinal(d.inclinacao)}`;
  console.log(
    `${path.basename(arquivo).padEnd(38)} ${coluna.padEnd(34)} ${ROTULOS[d.estado]}${grau}`,
  );
  if (d.estado === "torta") tortas++;
}

if (tortas > 0) {
  console.log(
    `\n${tortas} foto(s) fora do esquadro. Endireite a partir do original, ` +
      `girando antes de recortar. Ver docs/ASSETS.md.`,
  );
  process.exit(1);
}
