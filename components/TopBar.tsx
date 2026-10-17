import { profile, socials } from "@/lib/data";
import { CopyEmail } from "./CopyEmail";
import { ThemeToggle } from "./ThemeToggle";

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex items-center gap-1 text-sm text-muted ${className}`}>
      {socials.map((s, i) => (
        <li key={s.label} className="flex items-center gap-1">
          {i > 0 && (
            <span aria-hidden className="text-sage">
              /
            </span>
          )}
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded px-1.5 py-2 transition-colors hover:text-foreground"
          >
            {s.label}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function TopBar() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-1 py-5 sm:px-4">
      <div className="flex min-w-0 items-center gap-2">
        <a
          href={`mailto:${profile.email}`}
          className="mr-1 hidden truncate rounded text-sm text-muted transition-colors hover:text-foreground md:inline"
        >
          {profile.email}
        </a>
        <CopyEmail email={profile.email} />
        <a href={profile.cv} download className="btn-ghost px-4">
          CV
        </a>
      </div>
      <nav aria-label="Social" className="flex items-center gap-2">
        <SocialLinks className="hidden sm:flex" />
        <ThemeToggle />
      </nav>
    </header>
  );
}
