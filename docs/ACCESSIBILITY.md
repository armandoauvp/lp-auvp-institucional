# Acessibilidade

Meta: **WCAG 2.1 nível AA**. Não é formalidade: parte relevante do público
da AUVP tem mais de 50 anos e acessa por celular.

## O que já está implementado

**Contraste.** Toda combinação de cor da paleta foi verificada. Os dois tons de
ouro existem exatamente por isso: `gold` (`#a8853f`) só aparece em elemento
gráfico; onde o ouro vira texto pequeno, usa-se `gold-ink` (5,7:1 sobre papel) ou
`gold-light` (7,7:1 sobre tinta). Ver `docs/BRAND.md`.

**Teclado.** Todo elemento interativo é `<a>` ou `<button>` nativo. O foco tem
anel visível de 2px em ouro com deslocamento de 3px, definido globalmente em
`:focus-visible`. Existe link "Pular para o conteúdo" como primeiro elemento
focável da página.

**Movimento.** `prefers-reduced-motion: reduce` desliga a revelação na rolagem,
o carrossel de apoios e a rolagem suave por âncora. Nenhum conteúdo depende de
animação para ser lido.

**Estrutura.** Um `<h1>` só, no hero. Cada dobra abre com `<h2>`; cards usam
`<h3>`. As estatísticas são `<dl>/<dt>/<dd>`, com o rótulo em `sr-only` no
`<dt>` para não duplicar a leitura visual.

**Acordeão.** `<details>/<summary>` nativos: funcionam sem JavaScript, o teclado
já opera, e o estado é anunciado pelo leitor de tela sem `aria` extra.

**Abas do FAQ.** `role="tablist"` com `aria-selected` e `aria-controls`.

**Carrossel.** A segunda cópia da lista leva `aria-hidden`, para o leitor de tela
não ler os apoiadores duas vezes.

**Imagens.** Todas têm `alt` descritivo em português, escrito no arquivo de
conteúdo. Imagem puramente decorativa, como o fundo da dobra de encerramento, leva
`alt=""` e `aria-hidden`.

**Menu móvel.** `aria-expanded` e `aria-controls` no botão; a rolagem do corpo é
travada enquanto o painel está aberto.

**Dobra do processo, clicável por inteiro.** O balão que segue o ponteiro é
decorativo (`aria-hidden`) e não existe para quem usa teclado ou toque. Por isso
a mesma ação tem três caminhos, e o link é sempre um `<a>` de verdade:

| Entrada                                 | O que aparece                                                                   |
| --------------------------------------- | ------------------------------------------------------------------------------- |
| Ponteiro fino                           | Balão seguindo o cursor; clique em qualquer ponto da dobra navega               |
| Toque, ou qualquer aparelho sem `hover` | Botão normal no fim da dobra                                                    |
| Teclado                                 | O botão está sempre no DOM e na ordem de tabulação, e reaparece ao receber foco |

O botão nunca sai por `display: none` nem por `hidden`, que o tirariam da
tabulação e do leitor de tela: ele é colapsado por altura e opacidade, e
`:focus-within` o traz de volta. Ver a utilitária `cta-ponteiro-fino` em
`globals.css`.

O clique na dobra é ignorado quando há texto selecionado, para que soltar o
mouse depois de selecionar um parágrafo não leve a pessoa para fora da página.

**Idioma.** `<html lang="pt-BR">`.

## Ao contribuir

- Todo elemento clicável é `<button>` ou `<a>`. Nunca `<div onClick>`.
- Toda imagem nova precisa de `alt`, ou `alt=""` se for decorativa.
- Toda cor nova precisa passar 4,5:1 para texto e 3:1 para elemento gráfico.
- Nenhuma informação transmitida só por cor.
- Área de toque mínima de 44×44px em telas pequenas.
- Ordem de foco deve seguir a ordem visual.

## Como verificar

```bash
npm run build && npm run preview   # http://localhost:4173/institucional/
```

- Lighthouse (aba Accessibility) em mobile e desktop.
- Percorrer a página inteira só com `Tab`: o foco precisa ser sempre visível e
  nunca ficar preso.
- Testar com `prefers-reduced-motion` ativo nas preferências do sistema.
- Zoom de 200% sem rolagem horizontal.
