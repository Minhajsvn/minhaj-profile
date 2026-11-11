import { Fragment } from "react";
import { clients } from "@/lib/data";
import { Section } from "./Section";

const line = "text-[clamp(2rem,6vw,5rem)] font-medium leading-none tracking-[-0.04em]";

function Names({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {clients.map((c) => (
        <Fragment key={c}>
          <li className="whitespace-nowrap">{c}</li>
          <li aria-hidden className="muted px-[0.4em]">
            /
          </li>
        </Fragment>
      ))}
    </ul>
  );
}

/** One slow line of client names. Static and wrapped when motion is reduced. */
export function Clients() {
  return (
    <Section tone="paper" labelledBy="clients-title" className="rule border-t py-12 md:py-16">
      <h2 id="clients-title" className="label muted gutter mb-6">
        Trusted by jewellers, refineries and brands across the UAE
      </h2>

      <div className={`flex w-max animate-marquee motion-reduce:hidden ${line}`}>
        <Names />
        <Names hidden />
      </div>

      <ul className={`gutter hidden flex-wrap gap-x-[0.4em] gap-y-2 motion-reduce:flex ${line}`}>
        {clients.map((c, i) => (
          <li key={c}>
            {c}
            {i < clients.length - 1 && <span className="muted"> /</span>}
          </li>
        ))}
      </ul>
    </Section>
  );
}
