import { ArrowRight, Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ShieldIcon } from "@/components/ui/ModuleIcon";
import { Reveal } from "@/components/ui/Reveal";
import { guarantee } from "@/content/guarantee";
import { links } from "@/content/site";

/**
 * Dobra 07. Faixa horizontal única: ícone, promessa e CTA.
 *
 * O botão não centraliza na faixa: ele alinha pela descrição, o que o deixa
 * um pouco mais baixo. Centralizado, ele flutuava entre o título e o texto,
 * sem se ligar a nenhum dos dois; alinhado pela última linha do bloco de
 * texto, ele lê como a continuação natural da leitura.
 */
export function Guarantee() {
  return (
    <section className="bg-yellow text-ink">
      <Container className="py-14 md:py-16">
        <Reveal className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:gap-14">
          <ShieldIcon className="text-ink h-11 w-11 shrink-0 lg:mt-1 lg:self-start" />

          <div className="flex flex-col gap-2.5 lg:flex-1">
            <h2 className="text-ink font-[family-name:var(--font-display)] text-2xl leading-tight font-medium md:text-3xl">
              {guarantee.title}
            </h2>
            <p className="text-ink/75 max-w-[62ch] text-base leading-relaxed">
              {guarantee.description}
            </p>
          </div>

          <Button
            href={links.profileAnalysis}
            variant="solid"
            size="lg"
            className="shrink-0"
          >
            {guarantee.ctaLabel}
            <ArrowRight />
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
