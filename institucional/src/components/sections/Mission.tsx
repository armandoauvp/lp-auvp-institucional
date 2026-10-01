import { Parallax } from "@/components/motion/Parallax";
import { Container } from "@/components/ui/Container";
import { Figure } from "@/components/ui/Figure";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { mission } from "@/content/mission";

/**
 * Dobra 03. Duas colunas: à esquerda o texto institucional; à direita a
 * fotografia da sede, um pouco mais larga e alinhada ao topo do título.
 */
export function Mission() {
  return (
    <Section id="missao" tone="warm" rule>
      <Container>
        {/*
            Duas colunas só a partir de `xl`. Em 1024px não cabem: a coluna de
            texto ficava com 361px, o que a deixava com 616px de altura, e a
            moldura ao lado, que copia essa altura, virava um retrato de 0,88
            para uma fotografia 16:9. Empilhado, o quadro fica inteiro.
          */}
        <div className="grid items-stretch gap-14 xl:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] xl:gap-16">
          <Reveal className="flex flex-col gap-7">
            <h2 className="max-w-[20ch] font-[family-name:var(--font-display)] text-4xl leading-[1.08] font-medium tracking-[-0.01em] text-balance md:text-5xl">
              {mission.title}
            </h2>

            <div className="text-graphite flex max-w-[62ch] flex-col gap-6 text-base leading-[1.75] md:text-[1.0625rem]">
              {mission.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          </Reveal>

          {/*
            A partir de `xl` a fotografia larga a proporção fixa e passa a ter a
            altura da coluna de texto. Em 4:3 ela terminava bem antes do último
            parágrafo, e a dobra fechava com um degrau de mais de 100px na borda
            de baixo. O `object-cover` resolve o recorte, e a fachada aguenta
            perder altura porque o assunto dela é horizontal.
          */}
          <Reveal delay={120} className="xl:h-full">
            <Parallax distance={56} className="xl:h-full">
              <Figure
                src={mission.photo.src}
                alt={mission.photo.alt}
                caption={mission.photo.caption}
                brief={mission.photo.brief}
                ratio="4/3"
                className="xl:h-full"
                frameClassName="xl:aspect-auto xl:min-h-0 xl:flex-1"
              />
            </Parallax>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
