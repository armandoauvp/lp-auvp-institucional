import { ArrowRight, Button } from "@/components/ui/Button";
import { Parallax } from "@/components/motion/Parallax";
import { Container } from "@/components/ui/Container";
import { Figure } from "@/components/ui/Figure";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { etfs, etfsSection } from "@/content/etfs";
import { links } from "@/content/site";

/** Dobra 09. Abertura em duas colunas e, abaixo, a grade dos quatro fundos. */
export function Etfs() {
  return (
    <Section id="etfs" tone="ink" rule>
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="flex flex-col items-start gap-8">
            <SectionHeading
              title={etfsSection.title}
              subtitle={etfsSection.subtitle}
              tone="dark"
            />
            <Button href={links.etfs} variant="outline-light" size="lg">
              {etfsSection.ctaLabel}
              <ArrowRight />
            </Button>
          </Reveal>

          <Reveal delay={120}>
            <Parallax distance={48}>
              <Figure
                src={etfsSection.photo.src}
                alt={etfsSection.photo.alt}
                caption={etfsSection.photo.caption}
                brief={etfsSection.photo.brief}
                ratio="4/3"
                tone="dark"
              />
            </Parallax>
          </Reveal>
        </div>

        <ul className="bg-ink-line mt-16 grid gap-px sm:grid-cols-2 lg:grid-cols-4">
          {etfs.map((etf, index) => (
            <Reveal
              key={etf.ticker}
              as="li"
              delay={(index % 4) * 80}
              className="bg-ink"
            >
              <a
                href={etf.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group hover:bg-ink-soft flex h-full flex-col gap-3 p-7 transition-colors duration-500"
              >
                <span className="text-paper font-[family-name:var(--font-display)] text-3xl leading-none font-semibold tracking-[-0.01em]">
                  {etf.ticker}
                </span>
                <span className={`eyebrow ${etf.accentClass}`}>
                  {etf.category}
                </span>
                <p className="text-mist mt-1 flex-1 text-sm leading-relaxed">
                  {etf.description}
                </p>
                <span className="eyebrow text-paper/70 mt-3 flex items-center gap-2 transition-transform duration-500 group-hover:translate-x-1">
                  Ver o ETF
                  <ArrowRight className="h-3 w-3" />
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
