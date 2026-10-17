import { clients } from "@/lib/data";

/** Wordmark strip of client names. Scrolls gently; static and wrapped when motion is reduced. */
export function Clients() {
  return (
    <section aria-labelledby="clients-title" className="panel py-10 sm:py-14">
      <h2 id="clients-title" className="eyebrow w-full justify-center px-4 text-center font-sans">
        Trusted by jewellers, refineries &amp; brands across the UAE
      </h2>

      <div className="group relative mt-8 overflow-hidden motion-reduce:hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <ul className="flex w-max animate-marquee items-center gap-12 pr-12 group-hover:[animation-play-state:paused] sm:gap-16 sm:pr-16">
          {[...clients, ...clients].map((c, i) => (
            <li
              key={i}
              aria-hidden={i >= clients.length}
              className="whitespace-nowrap font-display text-xl text-muted sm:text-2xl"
            >
              {c}
            </li>
          ))}
        </ul>
      </div>

      <ul className="mt-8 hidden flex-wrap justify-center gap-x-8 gap-y-3 px-6 motion-reduce:flex">
        {clients.map((c) => (
          <li key={c} className="font-display text-lg text-muted">
            {c}
          </li>
        ))}
      </ul>
    </section>
  );
}
