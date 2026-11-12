"use client";

import { useEffect, useRef, useState } from "react";
import { BookButton } from "@/components/appointment-wizard";

export function MobileCtaBar({
  label,
  dock = "fixed",
}: {
  label: string;
  dock?: "fixed" | "under-hero";
}) {
  const slotRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(dock === "fixed");

  useEffect(() => {
    if (dock !== "under-hero") return;
    const slot = slotRef.current;
    if (!slot) return;

    const update = () => {
      const height = slot.offsetHeight;
      const top = slot.getBoundingClientRect().top;
      setPinned(top < window.innerHeight - height - 1);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [dock]);

  const bar = (
    <div className={`mobile-cta backdrop-blur md:hidden ${pinned ? "is-pinned" : ""}`}>
      <BookButton className="flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
        {label}
      </BookButton>
    </div>
  );

  if (dock === "fixed") return bar;

  return (
    <div ref={slotRef} className="mobile-cta-slot md:hidden">
      {bar}
    </div>
  );
}
