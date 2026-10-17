import Image from "next/image";
import type { Category, Project } from "@/lib/projects";

// Fixed artwork colours (not theme tokens) so covers read as posters in both modes.
const themes: Record<Category, { bg: string; fg: string; line: string; dot: string }> = {
  shopify: { bg: "#002E23", fg: "#F2EEE9", line: "rgba(212,162,76,0.55)", dot: "#D4A24C" },
  web: { bg: "#0F4A3A", fg: "#F2EEE9", line: "rgba(143,168,154,0.5)", dot: "#D4A24C" },
  app: { bg: "#D4A24C", fg: "#002E23", line: "rgba(0,46,35,0.28)", dot: "#002E23" },
};

const label: Record<Category, string> = { shopify: "Shopify", web: "Website", app: "Platform" };

/** Small deterministic hash so each project gets its own composition. */
function seed(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

export function ProjectCover({
  project,
  size = "sm",
  priority = false,
  decorative = false,
}: {
  project: Project;
  size?: "sm" | "lg";
  priority?: boolean;
  /** Hide from assistive tech when the surrounding link already names the project. */
  decorative?: boolean;
}) {
  const a11y = decorative ? { "aria-hidden": true } : { role: "img", "aria-label": `${project.title} cover` };
  const t = themes[project.category];
  const h = seed(project.slug);
  const cx = 55 + (h % 35); // ring centre, % of width
  const cy = 20 + ((h >>> 5) % 50);
  const rings = 3 + ((h >>> 9) % 3);
  const initials = project.title
    .replace(/[^A-Za-z0-9 &]/g, "")
    .split(" ")
    .filter((w) => w && w !== "&")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  if (project.cover) {
    return (
      <div className="relative aspect-[16/10] w-full overflow-hidden" style={{ background: t.bg }}>
        <Image
          src={project.cover}
          alt={decorative ? "" : `${project.title} — ${project.type}`}
          fill
          priority={priority}
          sizes={size === "lg" ? "(min-width: 1024px) 1000px, 100vw" : "320px"}
          className="object-cover"
        />
      </div>
    );
  }

  const big = size === "lg";
  return (
    <div
      {...a11y}
      className="relative aspect-[16/10] w-full overflow-hidden"
      style={{ background: t.bg, color: t.fg }}
    >
      <svg aria-hidden className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 160 100">
        {Array.from({ length: rings }, (_, i) => (
          <circle key={i} cx={(cx / 100) * 160} cy={cy} r={14 + i * 13} fill="none" stroke={t.line} strokeWidth="0.4" />
        ))}
        <circle cx={(cx / 100) * 160} cy={cy} r="2.2" fill={t.dot} />
        {Array.from({ length: 7 }, (_, i) => (
          <line key={i} x1={0} x2={160} y1={14 * i + 2} y2={14 * i + 2} stroke={t.line} strokeWidth="0.15" opacity="0.5" />
        ))}
      </svg>

      <span
        aria-hidden
        className={`absolute -bottom-[0.18em] right-[4%] font-semibold leading-none tracking-tighter opacity-[0.1] ${
          big ? "text-[11rem] sm:text-[16rem]" : "text-[7rem]"
        }`}
      >
        {initials}
      </span>

      <div className={`absolute inset-0 flex flex-col justify-between ${big ? "p-6 sm:p-10" : "p-5"}`}>
        <div className="flex items-center gap-2">
          <span className="flex gap-1" aria-hidden>
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-1.5 w-1.5 rounded-full" style={{ background: t.fg, opacity: 0.35 }} />
            ))}
          </span>
          <span className={`font-medium uppercase tracking-[0.2em] opacity-70 ${big ? "text-xs" : "text-[0.6rem]"}`}>
            {label[project.category]}
          </span>
        </div>
        <div>
          <p className={`font-semibold leading-[1.05] tracking-tight ${big ? "text-3xl sm:text-5xl" : "text-xl"}`}>
            {project.title}
          </p>
          <p className={`mt-1 opacity-70 ${big ? "text-sm sm:text-base" : "text-[0.7rem] leading-snug"}`}>{project.type}</p>
        </div>
      </div>
    </div>
  );
}
