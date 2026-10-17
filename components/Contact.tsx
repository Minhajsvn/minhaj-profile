import { profile } from "@/lib/data";
import { Chat, Handshake, Mail } from "./Icons";
import { Reveal } from "./Reveal";
import { SocialLinks } from "./TopBar";

export function Contact() {
  const waText = encodeURIComponent("Hi Minhaj, I'd like to talk about a project.");

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="panel scroll-mt-6 px-4 pb-8 pt-16 sm:px-8 sm:pt-24"
    >
      <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <div className="grid h-24 w-24 place-items-center rounded-full bg-background text-sage">
          <Handshake />
        </div>
        <h2 id="contact-title" className="mt-8 text-balance text-4xl font-medium leading-[1.1] sm:text-5xl md:text-6xl">
          Tell me about your <span className="italic text-muted">next project.</span>
        </h2>
        <p className="mt-5 max-w-md text-muted">
          Open to full-time roles and freelance work in Dubai and remote. I usually reply within a day.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a href={`mailto:${profile.email}`} className="btn-primary px-6">
            <Mail /> Email me
          </a>
          <a
            href={`https://wa.me/${profile.whatsapp}?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost px-6"
          >
            <Chat /> WhatsApp<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </Reveal>

      <footer className="mt-20 flex flex-col-reverse items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted sm:mt-28 sm:flex-row">
        <p>
          &copy; {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
        <nav aria-label="Social links in footer">
          <SocialLinks />
        </nav>
      </footer>
    </section>
  );
}
