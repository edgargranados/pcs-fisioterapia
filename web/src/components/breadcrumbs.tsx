import Link from "next/link";

export function Breadcrumbs({ items, light = false }: { items: { name: string; href?: string }[]; light?: boolean }) {
  const muted = light ? "text-[#f6f3ec]/75" : "text-muted-foreground";
  const link = light ? "text-[#f6f3ec] underline-offset-4 hover:underline" : "underline-offset-4 hover:text-foreground hover:underline";
  const current = light ? "text-[#f6f3ec]" : "text-foreground";

  return (
    <nav aria-label="Breadcrumb">
      <ol className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-sm ${muted}`}>
        {items.map((item, index) => (
          <li key={`${item.name}-${index}`} className="flex items-center gap-2">
            {index > 0 ? <span aria-hidden="true">/</span> : null}
            {item.href ? (
              <Link href={item.href} className={link}>
                {item.name}
              </Link>
            ) : (
              <span className={current}>{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
