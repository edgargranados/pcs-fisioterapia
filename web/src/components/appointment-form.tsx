"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ui } from "@/content/ui";
import type { Locale } from "@/lib/locale";
import { privacyPath } from "@/lib/paths";
import { cn } from "cn";

type Status = "idle" | "sending" | "success" | "error";

export function AppointmentForm({
  locale,
  page,
  whatsappNumber,
}: {
  locale: Locale;
  page: string;
  whatsappNumber: string;
}) {
  const copy = ui[locale];
  const nameId = useId();
  const phoneId = useId();
  const emailId = useId();
  const consentId = useId();
  const successRef = useRef<HTMLHeadingElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");
  const [savedName, setSavedName] = useState("");
  const [savedPhone, setSavedPhone] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const phone = String(data.get("phone") ?? "");
    const email = String(data.get("email") ?? "");
    const company = String(data.get("company") ?? "");
    const consent = data.get("consent") === "on";

    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/citas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, company, consent, locale, page }),
      });
      const payload = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!response.ok || !payload?.ok) {
        const code = payload?.error ?? "server";
        const known = code in copy.errors ? copy.errors[code as keyof typeof copy.errors] : copy.errors.server;
        setError(known);
        setStatus("error");
        return;
      }
      setSavedName(name.trim());
      setSavedPhone(phone.trim());
      setStatus("success");
      requestAnimationFrame(() => successRef.current?.focus());
    } catch {
      setError(copy.errors.server);
      setStatus("error");
    }
  }

  if (status === "success") {
    const safeName = savedName.replace(/[\r\n]/g, " ").slice(0, 80);
    const message = copy.whatsappMessage(safeName);
    const href = whatsappNumber
      ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
      : "";

    return (
      <div className="rounded-[1.6rem] border border-border bg-card p-6 sm:p-8" role="status">
        <p className="text-xs uppercase tracking-[0.18em] text-primary">{copy.formKicker}</p>
        <h2
          ref={successRef}
          tabIndex={-1}
          className="mt-3 font-serif text-4xl tracking-tight outline-none"
        >
          {copy.formSuccess}
        </h2>
        <p className="mt-4 text-lg leading-8">
          {copy.formThanks} {safeName}. {copy.formCall}{" "}
          <span className="font-medium">{savedPhone}</span>
        </p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-[#128C7E] px-6 text-base font-medium text-white transition hover:bg-[#0e7569] sm:w-auto"
          >
            <WhatsAppMark />
            {copy.formWhatsapp}
          </a>
        ) : (
          <p className="mt-6 max-w-md text-[15px] leading-7 text-muted-foreground">{copy.formNoWhatsapp}</p>
        )}
        <button
          type="button"
          className="mt-6 block text-sm text-muted-foreground underline-offset-4 hover:underline"
          onClick={() => setStatus("idle")}
        >
          {copy.formFix}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-[1.6rem] border border-border bg-card p-6 shadow-[0_24px_60px_-36px_rgba(28,33,28,0.55)] sm:p-8"
    >
      <div className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor={nameId}>{copy.formName}</Label>
          <Input id={nameId} name="name" autoComplete="name" required maxLength={80} className="h-12 text-base md:text-base" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor={phoneId}>{copy.formPhone}</Label>
          <Input
            id={phoneId}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            className="h-12 text-base md:text-base"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor={emailId}>{copy.formEmail}</Label>
          <Input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            maxLength={120}
            className="h-12 text-base md:text-base"
          />
        </div>
        <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
          <label>
            Company
            <input name="company" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <label htmlFor={consentId} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
          <input id={consentId} name="consent" type="checkbox" required className="mt-1 size-4 accent-[#1e4636]" />
          <span>
            {copy.formConsent}{" "}
            <Link href={privacyPath(locale)} className="text-foreground underline underline-offset-4">
              {copy.formPrivacy}
            </Link>
          </span>
        </label>
        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}
        <Button
          type="submit"
          disabled={status === "sending"}
          className={cn("h-12 rounded-full px-6 text-base")}
        >
          {status === "sending" ? copy.formSending : copy.formSubmit}
        </Button>
      </div>
    </form>
  );
}

function WhatsAppMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-current">
      <path d="M20.5 3.5A11 11 0 0 0 2.1 16.8L1 23l6.4-1.1A11 11 0 0 0 20.5 3.5zM12 20.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3.8.6.6-3.7-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.4.2-.3a.5.5 0 0 0 0-.5c0-.1-.5-1.3-.7-1.7s-.4-.4-.5-.4h-.4a.8.8 0 0 0-.6.3 2.5 2.5 0 0 0-.8 1.9 4.4 4.4 0 0 0 .9 2.3 10 10 0 0 0 3.8 3.3 12.7 12.7 0 0 0 2.6 1 2.2 2.2 0 0 0 1.5.1 1.9 1.9 0 0 0 1.2-.9 1.5 1.5 0 0 0 .1-1.1c-.1-.1-.2-.1-.4-.2z" />
    </svg>
  );
}
