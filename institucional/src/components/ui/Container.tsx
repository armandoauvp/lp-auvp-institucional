import { cn } from "@/lib/cn";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  /** `narrow` para colunas de texto corrido isolado. */
  width?: "default" | "narrow";
};

/**
 * Uma largura só para toda a página.
 *
 * Existiu uma variante `wide` para as grades de imagem, e ela custou caro: as
 * dobras que a usavam começavam 96px mais à esquerda que as outras, e a borda
 * do texto saltava a cada dobra durante a rolagem. Numa página cujo argumento
 * é a régua e a grade, isso é o defeito mais visível possível. Não reintroduzir.
 */
const widths = {
  default: "max-w-[76rem]",
  narrow: "max-w-[46rem]",
} as const;

export function Container({
  children,
  className,
  width = "default",
}: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full px-6 md:px-10", widths[width], className)}
    >
      {children}
    </div>
  );
}
