import { faqCategories } from "@/content/faq";
import { links, site } from "@/content/site";

/**
 * JSON-LD de EducationalOrganization + FAQPage.
 *
 * As perguntas vêm da mesma fonte que alimenta a dobra visível, de modo que o
 * dado estruturado nunca diverge do que está na tela.
 */
export function StructuredData() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: site.legalName,
    alternateName: site.shortName,
    url: site.url,
    description: site.description,
    foundingDate: String(site.foundingYear),
    founder: { "@type": "Person", name: site.founder },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Goiânia",
      addressRegion: "GO",
      addressCountry: "BR",
    },
    sameAs: [links.instagram, links.youtube, links.spotify],
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqCategories.flatMap((category) =>
      category.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  );
}
