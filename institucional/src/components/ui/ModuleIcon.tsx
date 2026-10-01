import type { Module } from "@/content/curriculum";
import { cn } from "@/lib/cn";

/**
 * Ícones dos módulos, desenhados em traço fino e geometria simples para
 * conversar com a serifa do logo. Sem preenchimento, sem sombra: o repertório
 * é o da gravura, não o do ícone de aplicativo.
 *
 * `viewBox` 32×32 e traço 1 para todos, de modo que peguem o mesmo peso óptico.
 */

const paths: Record<Module["icon"], React.ReactNode> = {
  // 01 · Preparação Mental · cabeça em perfil com espiral
  mind: (
    <>
      <path d="M20.5 27.5v-3.2c0-1 .5-1.7 1.3-2.2 2.4-1.6 4.2-4.4 4.2-7.7A10.5 10.5 0 0 0 5.5 14c0 2.3.8 4.1 2 5.6.5.6.6 1 .2 1.5l-1 1.3c-.4.5-.2 1.2.5 1.3l1.8.4v3.4" />
      <path d="M16 10.5a3.5 3.5 0 1 0 3.5 3.5c0-1.2-1-2-2-2s-1.5.7-1.5 1.4" />
    </>
  ),
  // 02 · Organização Financeira · livro-caixa
  ledger: (
    <>
      <path d="M6.5 5.5h19v21h-19z" />
      <path d="M11 5.5v21" />
      <path d="M15 11.5h6.5M15 16h6.5M15 20.5h4" />
    </>
  ),
  // 03 · Renda Fixa · título com selo
  bond: (
    <>
      <path d="M4.5 8.5h23v15h-23z" />
      <circle cx="11" cy="16" r="3.5" />
      <path d="M18 13h6M18 16h6M18 19h3.5" />
    </>
  ),
  // 04 · Renda Variável · série temporal ascendente
  equity: (
    <>
      <path d="M4.5 26.5h23" />
      <path d="M4.5 21l6-6.5 5 4 6.5-9 5.5 6" />
      <path d="M21 9.5h5.5V15" />
    </>
  ),
  // 05 · Reservas de Valor · barra e moeda
  reserve: (
    <>
      <path d="M4.5 21.5l3-6h13l3 6z" />
      <path d="M7.5 15.5l2.5-5h10.5" />
      <circle cx="23" cy="10.5" r="4.5" />
      <path d="M23 8v5M21.5 9.3h3M21.5 11.7h3" />
    </>
  ),
  // 06 · Investimentos no Exterior · globo com meridianos
  globe: (
    <>
      <circle cx="16" cy="16" r="11" />
      <path d="M5 16h22" />
      <path d="M16 5c3 3.2 4.5 7 4.5 11S19 24.8 16 27c-3-2.2-4.5-6-4.5-11S13 8.2 16 5z" />
    </>
  ),
  // 07 · Construção da Carteira · alocação em quadrantes
  portfolio: (
    <>
      <circle cx="16" cy="16" r="11" />
      <path d="M16 5v11l8 7.5" />
      <path d="M5 16h11" />
    </>
  ),
  // Bônus · Imposto de Renda · formulário com carimbo
  tax: (
    <>
      <path d="M8.5 4.5h11l5 5v18h-16z" />
      <path d="M19.5 4.5v5h5" />
      <path d="M12 15h8M12 19h8M12 23h5" />
    </>
  ),
};

export function ModuleIcon({
  name,
  className,
}: {
  name: Module["icon"];
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-8 w-8", className)}
    >
      {paths[name]}
    </svg>
  );
}

/** Escudo com marca de verificação, usado na faixa de garantia (dobra 07). */
export function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-10 w-10", className)}
    >
      <path d="M16 3.5l10.5 4v9.2c0 5.6-4.2 10.6-10.5 12.8C9.7 27.3 5.5 22.3 5.5 16.7V7.5z" />
      <path d="M11.5 16.2l3.2 3.3 6.3-6.6" />
    </svg>
  );
}

/** Marca-d'água do WhatsApp para o botão flutuante. */
export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-5 w-5", className)}
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.16 8.16 0 0 1-1.25-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.25 8.23zm4.52-6.16c-.25-.13-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.19-.54.06-.25-.12-1.05-.38-2-1.23a7.5 7.5 0 0 1-1.38-1.72c-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.13-.14.17-.24.25-.41.09-.16.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.47c-.16 0-.43.06-.65.31-.23.25-.86.84-.86 2.05s.88 2.38 1 2.54c.13.17 1.74 2.65 4.2 3.72.59.25 1.05.4 1.4.52.59.18 1.13.16 1.55.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z" />
    </svg>
  );
}
