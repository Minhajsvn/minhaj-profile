export function Tags({ items, max }: { items: string[]; max?: number }) {
  const shown = max ? items.slice(0, max) : items;
  const rest = items.length - shown.length;
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
      {shown.map((t) => (
        <li key={t} className="chip">
          {t}
        </li>
      ))}
      {rest > 0 && (
        <li className="chip bg-transparent text-muted ring-1 ring-inset ring-border" aria-label={`and ${rest} more`}>
          +{rest}
        </li>
      )}
    </ul>
  );
}
