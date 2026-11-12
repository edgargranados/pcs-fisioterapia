"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { BookButton } from "@/components/appointment-wizard";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const panel =
    open && mounted
      ? createPortal(
          <div
            id="mobile-menu"
            className="fixed inset-x-0 bottom-0 top-[var(--site-header-height)] z-[70] overflow-y-auto overscroll-contain bg-background px-5 pb-8 pt-2"
          >
            <nav className="grid" aria-label={openLabel}>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-border py-4 font-serif text-2xl tracking-tight"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <BookButton
              onOpen={() => setOpen(false)}
              className="mt-8 flex h-12 items-center justify-center rounded-full bg-primary px-6 text-primary-foreground"
            >
              {cta.label}
            </BookButton>
            <Link
              href={lang.href}
              hrefLang={lang.href.startsWith("/ca") ? "ca" : "es"}
              aria-label={lang.aria}
              className="mt-6 block py-2 text-sm text-muted-foreground"
              onClick={() => setOpen(false)}
            >
              {lang.label}
            </Link>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="lg:hidden">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-11 rounded-full"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X /> : <Menu />}
      </Button>
      {panel}
    </div>
  );
}
