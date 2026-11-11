import { Clients } from "@/components/Clients";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Showreel } from "@/components/Showreel";
import { Story } from "@/components/Story";
import { Work } from "@/components/Work";
import { profile, socials } from "@/lib/data";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  email: `mailto:${profile.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE" },
  sameAs: socials.map((s) => s.href),
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main id="main" className="flex flex-col">
        <Hero />
        <Clients />
        <Showreel />
        <Work />
        <Story />
        <Services />
        <Contact />
      </main>
    </>
  );
}
