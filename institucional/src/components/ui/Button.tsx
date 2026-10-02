import { cn } from "@/lib/cn";

type Variant = "solid" | "yellow" | "outline" | "outline-light" | "quiet";
type Size = "sm" | "md" | "lg";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Abre em nova aba com rel seguro. Inferido para URLs http(s) externas. */
  external?: boolean;
};

/**
 * Botao em pilula.
 *
 * O canto reto era a regra ate as referencias chegarem: Lionheart, Oxford,
 * SOAS e Harvard usam pilula em todos os CTAs, e so a Penn mantem retangulo.
 * A pilula suaviza o unico elemento da pagina que precisa parecer clicavel,
 * sem tirar a rigidez de tudo o mais, que segue em canto reto.
 */
const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-sans " +
  "font-medium transition-colors duration-300 ease-out";

/** Deslocamento leve da seta no hover, para o botão responder ao ponteiro. */
const arrowShift =
  "[&>svg]:transition-transform [&>svg]:duration-500 hover:[&>svg]:translate-x-1";

const variants: Record<Variant, string> = {
  solid: "bg-ink text-paper hover:bg-ink-soft",
  yellow: "bg-yellow text-ink hover:bg-yellow-soft",
  outline:
    "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-paper",
  "outline-light":
    "border border-paper/30 text-paper hover:border-paper hover:bg-paper hover:text-ink",
  quiet: "text-ink underline-offset-[6px] hover:underline",
};

const sizes: Record<Size, string> = {
  sm: "px-5 py-2.5 text-[0.8125rem] tracking-[0.06em]",
  md: "px-7 py-3.5 text-sm tracking-[0.08em]",
  lg: "px-9 py-4 text-sm tracking-[0.1em]",
};

export function Button({
  href,
  children,
  variant = "solid",
  size = "md",
  className,
  external,
}: ButtonProps) {
  const isExternal = external ?? /^https?:\/\//.test(href);
  const classes = cn(
    base,
    arrowShift,
    variants[variant],
    variant === "quiet" ? "px-0 py-0 text-sm tracking-[0.02em]" : sizes[size],
    className,
  );

  if (isExternal) {
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <a href={href} className={classes}>
      {children}
    </a>
  );
}

/** Seta usada nos links "Saiba mais" e nos CTAs textuais. */
export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      fill="none"
      className={cn("h-3.5 w-3.5", className)}
    >
      <path
        d="M4 10h12m0 0-4.5-4.5M16 10l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
