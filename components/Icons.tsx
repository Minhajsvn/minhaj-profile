import type { SVGProps } from "react";
import type { ServiceIcon } from "@/lib/data";

type IconProps = SVGProps<SVGSVGElement>;

const base: IconProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export const ArrowUpRight = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="16" height="16" {...base} {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

export const ArrowDown = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="16" height="16" {...base} {...p}>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </svg>
);

export const Mail = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="16" height="16" {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

export const Chat = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="16" height="16" {...base} {...p}>
    <path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.1A8 8 0 1 1 20 11.5Z" />
  </svg>
);

export const Sun = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...base} {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

export const Moon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...base} {...p}>
    <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
  </svg>
);

const serviceIcons: Record<ServiceIcon, React.ReactNode> = {
  store: (
    <>
      <path d="M4 9h16l-1.5-5h-13L4 9Z" />
      <path d="M4 9a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0A2.7 2.7 0 0 0 20 9" />
      <path d="M5.5 11.5V20h13v-8.5M10 20v-5h4v5" />
    </>
  ),
  layout: (
    <>
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M3 8h18M8 12l-2 2 2 2M16 12l2 2-2 2M13 11.5 11 16.5" />
    </>
  ),
  server: (
    <>
      <rect x="4" y="3.5" width="16" height="7" rx="1.5" />
      <rect x="4" y="13.5" width="16" height="7" rx="1.5" />
      <path d="M8 7h.01M8 17h.01M12 7h4M12 17h4" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m20 20-5-5M7.5 12l2-2 1.5 1.5L13.5 9" />
    </>
  ),
};

export function ServiceGlyph({ name, ...p }: IconProps & { name: ServiceIcon }) {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" {...base} {...p}>
      {serviceIcons[name]}
    </svg>
  );
}

/** Line-art handshake, echoing the contact illustration in the reference. */
export const Handshake = (p: IconProps) => (
  <svg viewBox="0 0 64 40" width="64" height="40" {...base} strokeWidth={1.4} {...p}>
    <path d="M2 10h10l8 3 6-3h8l8 4 4-1h10" />
    <path d="M12 10v16l9 7c2 1.5 4.5 1.5 6 0l9-8" />
    <path d="M52 13v15l-10 2" />
    <path d="M26 10 18 18c-1.5 1.5.5 4 2.5 3l7.5-4.5 9 8" />
    <path d="M24 30l3-3M28 33l3-3M33 29l3-3" />
  </svg>
);
