import { cn } from "@/lib/cn";

type SectionProps = {
  id?: string;
  children: React.ReactNode;
  className?: string;
  /** Faixas curtas, de uma linha só, pedem menos respiro que uma dobra longa. */
  compact?: boolean;
  /** `paper` claro, `warm` pergaminho, `ink` tinta institucional. */
  tone?: "paper" | "warm" | "ink";
  /** Régua fina no topo da dobra, separador editorial padrão da página. */
  rule?: boolean;
  as?: "section" | "footer" | "div";
};

const tones = {
  paper: "bg-paper text-ink",
  warm: "bg-paper-soft text-ink",
  ink: "bg-ink text-paper",
} as const;

const ruleTones = {
  paper: "border-paper-line",
  warm: "border-paper-line",
  ink: "border-ink-line",
} as const;

export function Section({
  id,
  children,
  className,
  tone = "paper",
  rule = false,
  compact = false,
  as: Tag = "section",
}: SectionProps) {
  return (
    <Tag
      id={id}
      className={cn(
        compact
          ? "py-14 md:py-16 lg:py-20"
          : "py-20 md:py-28 lg:py-[var(--spacing-section)]",
        tones[tone],
        rule && cn("border-t", ruleTones[tone]),
        className,
      )}
    >
      {children}
    </Tag>
  );
}
