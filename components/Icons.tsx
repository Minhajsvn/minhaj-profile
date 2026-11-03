import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  ArrowDown02Icon,
  ArrowLeft02Icon,
  ArrowUpRight01Icon,
  Download04Icon,
  HandshakeIcon,
  Mail01Icon,
  Moon02Icon,
  PauseIcon,
  PlayIcon,
  SeoIcon,
  ServerStack01Icon,
  Store01Icon,
  Sun03Icon,
  WebDesign01Icon,
  WhatsappIcon,
} from "@hugeicons/core-free-icons";
import type { ServiceIcon } from "@/lib/data";

// All icons come from Hugeicons (free set). Names here stay stable so call sites never change.

type IconProps = { width?: number; height?: number; className?: string; strokeWidth?: number };

function icon(svg: IconSvgElement, defaultSize = 16) {
  function Icon({ width, height, className, strokeWidth = 1.8 }: IconProps) {
    return (
      <HugeiconsIcon
        icon={svg}
        size={width ?? height ?? defaultSize}
        color="currentColor"
        strokeWidth={strokeWidth}
        className={className}
        aria-hidden
      />
    );
  }
  return Icon;
}

export const ArrowUpRight = icon(ArrowUpRight01Icon);
export const ArrowDown = icon(ArrowDown02Icon);
export const ArrowLeft = icon(ArrowLeft02Icon);
export const Download = icon(Download04Icon);
export const Mail = icon(Mail01Icon);
export const Chat = icon(WhatsappIcon);
export const Sun = icon(Sun03Icon, 18);
export const Moon = icon(Moon02Icon, 18);
export const Handshake = icon(HandshakeIcon, 40);
export const Play = icon(PlayIcon, 18);
export const Pause = icon(PauseIcon, 18);

const serviceIcons: Record<ServiceIcon, IconSvgElement> = {
  store: Store01Icon,
  layout: WebDesign01Icon,
  server: ServerStack01Icon,
  search: SeoIcon,
};

export function ServiceGlyph({ name, className }: { name: ServiceIcon; className?: string }) {
  return (
    <HugeiconsIcon icon={serviceIcons[name]} size={28} color="currentColor" strokeWidth={1.5} className={className} aria-hidden />
  );
}
