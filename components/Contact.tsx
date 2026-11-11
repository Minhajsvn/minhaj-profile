import { profile } from "@/lib/data";
import { CopyEmail } from "./CopyEmail";
import { DubaiClock } from "./DubaiClock";
import { Section } from "./Section";
import { SocialLinks } from "./TopBar";

/** Ink footer led by one lime band — the page's loudest moment. */
export function Contact() {
  const waText = encodeURIComponent("Hi Minhaj, I'd like to talk about a project.");

  return (
    <Section tone="ink" id="contact" labelledBy="contact-title" className="scroll-mt-14 pt-20 md:pt-28">
      <p className="label muted gutter mb-6">Open to full-time roles and freelance — Dubai or remote</p>

      <a
        href={`mailto:${profile.email}`}
        className="group block bg-lime text-ink transition-colors hover:bg-paper"
      >
        <h2 id="contact-title" className="text-title gutter py-6 md:py-10">
          LET&apos;S BUILD <span aria-hidden className="inline-block transition-transform group-hover:translate-x-4">→</span>
        </h2>
      </a>

      <div className="gutter grid-12 gap-y-10 py-14 md:py-20">
        <div className="col-span-12 md:col-span-6">
          <p className="label muted">Email</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <a href={`mailto:${profile.email}`} className="break-all text-xl underline-offset-4 hover:underline md:text-3xl">
              {profile.email}
            </a>
            <CopyEmail email={profile.email} />
          </div>
        </div>

        <div className="col-span-6 md:col-span-2 md:col-start-8">
          <p className="label muted">Elsewhere</p>
          <ul className="mt-3 space-y-2">
            <li>
              <a
                href={`https://wa.me/${profile.whatsapp}?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:underline"
              >
                WhatsApp<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={profile.cv} download className="underline-offset-4 hover:underline">
                CV (PDF)
              </a>
            </li>
          </ul>
        </div>

        <nav aria-label="Social links in footer" className="col-span-6 md:col-span-2">
          <p className="label muted">Social</p>
          <SocialLinks className="-ml-1.5 mt-1.5" />
        </nav>
      </div>

      <footer className="rule gutter label muted flex flex-wrap justify-between gap-3 border-t py-6">
        <span>
          &copy; {new Date().getFullYear()} {profile.name}
        </span>
        <DubaiClock />
      </footer>
    </Section>
  );
}
