"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { motion, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { aedPerGram24, KARATS, money, useRates } from "@/lib/rates";
import { ArrowUpRight } from "./Icons";
import { Reveal } from "./Reveal";
import { SplitReveal } from "./motion/SplitReveal";

const VAT = 0.05;
const SAMPLE_24K = 490; // AED/g, only used if the live feed is down

const specialties = [
  { title: "Prices that follow the market", body: "Catalogs re-priced from live gold and silver rates, with every change previewed before it goes live." },
  { title: "Enquiries in one tap", body: "WhatsApp flows that open a pre-filled chat with the exact piece a customer is viewing." },
  { title: "English & Arabic", body: "Bilingual storefronts with proper right-to-left layouts, multi-currency and GCC shipping." },
];

function AnimatedAED({ value }: { value: number }) {
  const reduce = useReducedMotion();
  const spring = useSpring(value, { stiffness: 140, damping: 22, mass: 0.6 });
  useEffect(() => spring.set(value), [spring, value]);
  const text = useTransform(spring, (v) => money(Math.round(v), 0));
  return <motion.span className="tabular-nums">{reduce ? money(Math.round(value), 0) : text}</motion.span>;
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  const id = useId();
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        <output htmlFor={id} className="text-sm font-semibold tabular-nums">
          {money(value, step < 1 ? 1 : 0)} <span className="text-xs font-normal text-muted">{unit}</span>
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 h-2 w-full cursor-pointer appearance-auto"
        style={{ accentColor: "rgb(var(--primary))" }}
      />
    </div>
  );
}

export function PriceLab() {
  const { rates, failed } = useRates();
  const [karat, setKarat] = useState<(typeof KARATS)[number]["k"]>("22K");
  const [weight, setWeight] = useState(12);
  const [making, setMaking] = useState(30);
  const [stones, setStones] = useState(0);
  const [vat, setVat] = useState(true);

  const live = !!rates;
  const rate24 = rates ? aedPerGram24(rates.gold) : SAMPLE_24K;
  const purity = KARATS.find((k) => k.k === karat)!.purity;
  const ratePerGram = rate24 * purity;

  const goldValue = ratePerGram * weight;
  const makingValue = making * weight;
  const subtotal = goldValue + makingValue + stones;
  const vatValue = vat ? subtotal * VAT : 0;
  const total = subtotal + vatValue;

  const rows = [
    { label: `Gold · ${weight}g × AED ${money(ratePerGram)}`, value: goldValue },
    { label: `Making · AED ${making}/g`, value: makingValue },
    { label: "Stones & diamonds", value: stones },
    { label: vat ? "UAE VAT · 5%" : "VAT exempt", value: vatValue },
  ];

  return (
    <section id="price-lab" aria-labelledby="price-lab-title" className="px-4 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto grid max-w-5xl items-start gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div>
          <p className="eyebrow">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
            Built for the gold trade
          </p>
          <SplitReveal
            id="price-lab-title"
            parts={[{ text: "Price a piece." }, { text: "Live, right now.", soft: true }]}
            className="mt-4 text-balance text-3xl font-semibold leading-tight sm:text-[2.6rem]"
          />
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md text-pretty leading-relaxed text-muted">
              Jewellery prices move with the market every day. This is the kind of pricing logic I build into Shopify
              stores — try it with today&rsquo;s gold rate.
            </p>
          </Reveal>

          <ul className="mt-10 space-y-6">
            {specialties.map((s, i) => (
              <Reveal as="li" key={s.title} delay={0.1 + i * 0.06} className="flex gap-4">
                <span
                  aria-hidden
                  className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-tag text-xs font-semibold text-tag-foreground"
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-sans text-base font-semibold tracking-normal">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>

          <Link
            href="/work/live-rate-app"
            data-transition-label="Live Rate App"
            className="mt-10 inline-flex items-center gap-1.5 text-sm font-semibold underline decoration-accent decoration-2 underline-offset-[6px] transition-colors hover:text-primary-hover"
          >
            See how I built this for real stores <ArrowUpRight />
          </Link>
        </div>

        <Reveal className="panel p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-medium uppercase tracking-wider text-muted">Jewellery price calculator</p>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold ${
                live ? "bg-tag text-tag-foreground" : "border border-border text-muted"
              }`}
            >
              <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${live ? "bg-accent" : "bg-sage"}`} />
              {live ? "Live rate" : failed ? "Sample rate" : "Connecting…"}
            </span>
          </div>

          <fieldset className="mt-6">
            <legend className="text-sm font-medium">Karat</legend>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {KARATS.map((k) => (
                <label key={k.k} className="relative">
                  <input
                    type="radio"
                    name="karat"
                    value={k.k}
                    checked={karat === k.k}
                    onChange={() => setKarat(k.k)}
                    className="peer sr-only"
                  />
                  <span className="flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-border text-sm font-semibold transition-colors peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent hover:border-sage">
                    {k.k}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-7 space-y-6">
            <Slider label="Gold weight" value={weight} min={1} max={60} step={0.5} unit="g" onChange={setWeight} />
            <Slider label="Making charge" value={making} min={0} max={120} step={1} unit="AED/g" onChange={setMaking} />
            <Slider label="Stones & diamonds" value={stones} min={0} max={15000} step={100} unit="AED" onChange={setStones} />
            <label className="flex cursor-pointer items-center justify-between gap-4 text-sm font-medium">
              Include UAE VAT (5%)
              <input
                type="checkbox"
                checked={vat}
                onChange={(e) => setVat(e.target.checked)}
                className="h-5 w-5 cursor-pointer"
                style={{ accentColor: "rgb(var(--primary))" }}
              />
            </label>
          </div>

          <div className="mt-8 rounded-3xl bg-background p-5 sm:p-6">
            <dl className="space-y-2 text-sm">
              {rows.map((r) => (
                <div key={r.label} className="flex justify-between gap-4">
                  <dt className="text-muted">{r.label}</dt>
                  <dd className="tabular-nums">AED {money(r.value)}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 flex items-end justify-between gap-4 border-t border-border pt-4">
              <span className="text-sm font-medium">Final price</span>
              <span className="text-3xl font-semibold tracking-tight sm:text-4xl">
                <span className="mr-1.5 text-base font-medium text-muted">AED</span>
                <span aria-hidden>
                  <AnimatedAED value={total} />
                </span>
                <span className="sr-only">{money(Math.round(total), 0)}</span>
              </span>
            </div>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-muted">
            {live
              ? `Indicative: 24K at AED ${money(rate24)}/g, derived from the spot price. Retail DJG rates and store margins differ.`
              : `Live feed unavailable — showing a sample 24K rate of AED ${SAMPLE_24K}/g.`}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
