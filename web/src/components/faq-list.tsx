export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((item) => (
        <details key={item.q} className="group py-5">
          <summary className="flex cursor-pointer items-start justify-between gap-6 font-serif text-xl leading-snug tracking-tight md:text-2xl">
            {item.q}
            <span aria-hidden="true" className="mt-1 text-2xl leading-none text-muted-foreground transition group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="max-w-2xl pt-3 text-[16px] leading-7 text-muted-foreground">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
