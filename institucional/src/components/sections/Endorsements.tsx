import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { EndorsementLogo } from "./EndorsementLogo";
import { endorsements } from "@/content/endorsements";

/**
 * Dobra 10: acreditam no nosso trabalho.
 *
 * São quatro apoiadores, e quatro cabem na tela. O carrossel que existia aqui
 * antes resolvia um problema que a página não tem: com poucos itens ele passava
 * a mesma marca duas vezes por ciclo e escondia parte do conjunto a cada
 * instante. Sem ele, os quatro são vistos de uma vez, maiores e em cor própria.
 */
export function Endorsements() {
  return (
    <Section tone="paper" rule compact>
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.52fr)_minmax(0,1.48fr)] lg:gap-14">
          <h2 className="max-w-[14ch] font-[family-name:var(--font-display)] text-3xl leading-tight font-medium text-balance md:text-4xl">
            {endorsements.title}
          </h2>

          {/*
            Os quatro lado a lado, numa fileira só. A coluna do título encolheu
            para caber: numa divisão 0,8 por 1,2 cada célula ficava com 134px e
            o `max-w-full` esmagava as logos largas a menos da metade da altura
            pedida. A restrição sempre foi de largura, não de altura.
          */}
          <ul className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:gap-x-10">
            {endorsements.items.map((item) => (
              <li key={item.name} className="flex items-center justify-center">
                <EndorsementLogo name={item.name} logo={item.logo} />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
