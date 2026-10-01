import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
  /** Nível semântico do título. A página usa h1 só no hero. */
  as?: "h2" | "h3";
};

export function SectionHeading({
  title,
  subtitle,
  align = "left",
  tone = "light",
  className,
  as: Tag = "h2",
}: SectionHeadingProps) {
  const centered = align === "center";

  const heading = (
    <Tag
      className={cn(
        "font-[family-name:var(--font-display)] text-4xl leading-[1.08] font-medium tracking-[-0.01em] text-balance md:text-5xl lg:text-[3.5rem]",
        tone === "dark" && "text-paper",
      )}
    >
      {title}
    </Tag>
  );

  const support = subtitle ? (
    <p
      className={cn(
        "text-balance-pretty max-w-[46rem] text-base leading-relaxed md:text-lg",
        tone === "light" ? "text-graphite" : "text-mist",
      )}
    >
      {subtitle}
    </p>
  ) : null;

  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        centered && "items-center text-center",
        className,
      )}
    >
      {heading}
      {support}
    </div>
  );
}
