# Como contribuir

## Antes de começar

Leia o documento correspondente ao que você vai mexer:

- texto, número ou link → [docs/CONTENT.md](docs/CONTENT.md)
- foto → [docs/ASSETS.md](docs/ASSETS.md)
- cor, tipografia, espaçamento → [docs/BRAND.md](docs/BRAND.md)
- estrutura ou componente → [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## Fluxo

```bash
git checkout -b tipo/descricao-curta
# ... suas alterações ...
npm run check
git commit -m "tipo: o que mudou"
git push -u origin tipo/descricao-curta
```

Abra o PR para `main`.

### Prefixos

| Prefixo    | Uso                                     |
| ---------- | --------------------------------------- |
| `conteudo` | Texto, número, link, pergunta de FAQ    |
| `foto`     | Imagem nova, recorte, substituição      |
| `feat`     | Dobra, componente ou comportamento novo |
| `fix`      | Correção                                |
| `estilo`   | Ajuste visual sem mudança de conteúdo   |
| `docs`     | Documentação                            |
| `chore`    | Dependência, configuração, ferramenta   |

Mensagem no imperativo e em português: `conteudo: atualiza numeros do 3o
trimestre`, `foto: adiciona registros do Private Day 2025`.

## Antes de abrir o PR

```bash
npm run check
npm run build
```

Os dois precisam passar. A CI roda exatamente isso.

E confira você mesmo:

- [ ] Nenhum texto de exemplo ou lorem ipsum sobrou
- [ ] Toda imagem nova tem `alt` descritivo em português
- [ ] Foto nova passou no `npm run esquadro` (ver `docs/ASSETS.md`)
- [ ] Percorri a alteração com `Tab` e o foco está sempre visível
- [ ] Conferi em 390px de largura, não só no desktop
- [ ] Nenhuma cor nova fora dos tokens de `globals.css`
- [ ] Nenhum `border-radius`, sombra ou emoji (ver `docs/BRAND.md`)

## O que uma revisão vai olhar

**Em mudança de conteúdo:** se o tom continua institucional, se não há promessa
de rentabilidade, se número novo tem fonte, se o texto continua compatível com o
aviso legal do rodapé.

**Em mudança visual:** se respeita os tokens, se a alternância de fundo da página
continua íntegra, se o contraste passa AA, se o movimento respeita
`prefers-reduced-motion`.

**Em mudança estrutural:** se o componente novo poderia ser Server Component, se
o conteúdo foi para `institucional/src/content/` em vez de ficar no JSX, se o HTML é semântico.

## Ordem das dobras

A sequência em `institucional/src/App.tsx` segue o roteiro aprovado e **não deve ser
alterada sem alinhamento com marketing**. Cada dobra pressupõe o argumento da
anterior: a garantia só faz sentido depois do processo; os ETFs só fazem sentido
depois do método.
