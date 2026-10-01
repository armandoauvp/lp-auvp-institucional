/**
 * Prefixa um caminho de `/public` com a base em que o site é servido.
 *
 * Por que isto existe: o Vite reescreve a base nos assets importados, mas não
 * em strings de caminho que vivem nos arquivos de conteúdo (`/images/x.webp`).
 * Sob subcaminho, como `/institucional/` ou o Pages de repositório de projeto,
 * essas fotos dariam 404 sem o prefixo.
 *
 * `BASE_URL` sempre termina em barra, então a barra inicial do caminho sai.
 */
const base = import.meta.env.BASE_URL;

export function asset(path: string): string {
  return path.startsWith("/") ? `${base}${path.slice(1)}` : path;
}
