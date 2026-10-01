import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { Community } from "@/components/sections/Community";
import { Curriculum } from "@/components/sections/Curriculum";
import { Endorsements } from "@/components/sections/Endorsements";
import { Etfs } from "@/components/sections/Etfs";
import { Faq } from "@/components/sections/Faq";
import { Guarantee } from "@/components/sections/Guarantee";
import { Hero } from "@/components/sections/Hero";
import { Initiatives } from "@/components/sections/Initiatives";
import { Mission } from "@/components/sections/Mission";
import { Numbers } from "@/components/sections/Numbers";
import { Process } from "@/components/sections/Process";
import { StructuredData } from "@/components/StructuredData";

/**
 * Página institucional da AUVP. Montada no navegador por `main.tsx` e
 * pré-renderizada no build por `entry-server.tsx`.
 *
 * A ordem das dobras segue o roteiro aprovado (docs/CONTENT.md) e não deve ser
 * alterada sem alinhamento com marketing: cada dobra pressupõe o argumento da
 * anterior.
 *
 * O convite com o prazo da próxima turma vem antes do FAQ, e não depois: quem
 * chega ao fim dos apoiadores já tem o que precisa para decidir, e o FAQ existe
 * para quem ficou com uma dúvida específica. Pôr a decisão depois de doze
 * perguntas era fazer todo mundo passar pela objeção de alguém. A página então
 * termina no FAQ, e a ordem do menu acompanha a ordem das dobras.
 */
export function App() {
  return (
    <>
      <StructuredData />
      <SmoothScroll />
      <a
        href="#conteudo-principal"
        className="focus:bg-ink focus:text-paper sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-5 focus:py-3 focus:text-sm"
      >
        Pular para o conteúdo
      </a>

      <SiteHeader />

      <main id="conteudo-principal">
        <Hero />
        <Numbers />
        <Mission />
        <Curriculum />
        <Process />
        <Community />
        <Guarantee />
        <Initiatives />
        <Etfs />
        <Endorsements />
        <ClosingCta />
        <Faq />
      </main>

      <SiteFooter />
      <WhatsAppFloat />
    </>
  );
}
