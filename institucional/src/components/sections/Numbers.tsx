import { CountUp } from "@/components/motion/CountUp";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { stats } from "@/content/stats";

/**
 * Dobra 02. Quatro números separados por réguas verticais, na mesma
 * construção usada em relatórios anuais de universidade.
 */
export function Numbers() {
  return (
    <Section tone="paper" compact>
      <Container>
        <dl className="grid grid-cols-2 gap-y-12 sm:gap-y-14 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Reveal
              key={stat.label}
              delay={index * 90}
              className="lg:border-paper-line flex flex-col items-center gap-3 px-4 text-center lg:border-l lg:first:border-l-0"
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd className="flex flex-col items-center gap-3">
                <span className="text-ink font-[family-name:var(--font-display)] text-4xl leading-none font-semibold tracking-[-0.02em] sm:text-5xl lg:text-[3.25rem]">
                  <CountUp value={stat.value} />
                </span>
                <span aria-hidden className="bg-ink/30 h-px w-8" />
                <span className="text-graphite max-w-[18ch] text-sm leading-snug">
                  {stat.label}
                </span>
              </dd>
            </Reveal>
          ))}
        </dl>
      </Container>
    </Section>
  );
}
