export type Tone = "ink" | "paper";

const tones: Record<Tone, string> = {
  ink: "bg-ink text-paper",
  paper: "bg-paper text-ink",
};

/** A full-width band fixed to one tone. `data-tone` lets the cursor and UI checks know what is underneath. */
export function Section({
  tone,
  id,
  labelledBy,
  className = "",
  children,
}: {
  tone: Tone;
  id?: string;
  labelledBy?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-tone={tone}
      className={`relative w-full overflow-x-clip ${tones[tone]} ${className}`}
    >
      {children}
    </section>
  );
}
