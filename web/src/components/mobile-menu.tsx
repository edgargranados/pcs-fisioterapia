"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Item = { href: string; label: string };

export function MobileMenu({
  links,
  cta,
  lang,
  openLabel,
  closeLabel,
}: {
  links: Item[];
  cta: Item;
  lang: Item & { aria: string };
  openLabel: string;
  closeLabel: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-11 rounded-full"
        aria-expanded={open}
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X /> : <Menu />}
      </Button>
      {open ? (
        <div className="fixed inset-0 top-[4.5rem] z-40 overflow-y-auto bg-background px-5 pb-28 pt-6">
          <nav className="grid gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-border py-4 font-serif text-3xl tracking-tight"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link
            href={cta.href}
            onClick={() => setOpen(false)}
            className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-primary-foreground"
          >
            {cta.label}
          </Link>
          <Link href={lang.href} hrefLang={lang.href.startsWith("/ca") ? "ca" : "es"} aria-label={lang.aria} className="mt-6 block text-sm text-muted-foreground" onClick={() => setOpen(false)}>
            {lang.label}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
