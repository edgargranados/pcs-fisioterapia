"use client";

import { useCallback, useContext, useEffect, useId, useLayoutEffect, useRef, useState, createContext, type RefObject } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { ui } from "@/content/ui";
import { readAttribution } from "@/lib/attribution";
import type { Locale } from "@/lib/locale";
import { privacyPath } from "@/lib/paths";

type Step = "preference" | "name" | "phone" | "email" | "success";
type Preference = "morning" | "afternoon";
type ErrorCode = keyof (typeof ui)["es"]["errors"] | "";

type OpenWizard = (page?: string) => void;

const AppointmentContext = createContext<{ open: OpenWizard }>({ open: () => {} });

export function useAppointment() {
  return useContext(AppointmentContext);
}

export function BookButton({
  className,
  children,
  onOpen,
  page,
  tabIndex,
}: {
  className?: string;
  children: React.ReactNode;
  onOpen?: () => void;
  page?: string;
  tabIndex?: number;
}) {
  const { open } = useAppointment();
  return (
    <button
      type="button"
      className={className}
      tabIndex={tabIndex}
      onClick={() => {
        onOpen?.();
        open(page);
      }}
    >
      {children}
    </button>
  );
}

export function AppointmentProvider({
  locale,
  whatsappNumber,
  children,
}: {
  locale: Locale;
  whatsappNumber: string;
  children: React.ReactNode;
}) {
  const shellRef = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const pageRef = useRef<string | null>(null);
  const wasOpen = useRef(false);
  const [open, setOpen] = useState(false);

  const openWizard = useCallback<OpenWizard>((page) => {
    pageRef.current = page && page.length <= 180 && /^\/[a-z0-9/-]*$/.test(page) ? page : null;
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setOpen(true);
  }, []);

  const closeWizard = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const node = shellRef.current;
    if (node) {
      if (open) node.setAttribute("inert", "");
      else node.removeAttribute("inert");
    }
    if (wasOpen.current && !open) opener.current?.focus();
    wasOpen.current = open;
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <AppointmentContext.Provider value={{ open: openWizard }}>
      <div ref={shellRef} lang={locale} className="flex min-h-full flex-col bg-background text-foreground">
        {children}
      </div>
      <AppointmentDialog
        open={open}
        locale={locale}
        whatsappNumber={whatsappNumber}
        pageRef={pageRef}
        onClose={closeWizard}
      />
    </AppointmentContext.Provider>
  );
}

function AppointmentDialog({
  open,
  locale,
  whatsappNumber,
  pageRef,
  onClose,
}: {
  open: boolean;
  locale: Locale;
  whatsappNumber: string;
  pageRef: RefObject<string | null>;
  onClose: () => void;
}) {
  const copy = ui[locale];
  const titleId = useId();
  const ledeId = useId();
  const consentId = useId();
  const nameId = useId();
  const phoneId = useId();
  const emailId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const companyRef = useRef<HTMLInputElement>(null);
  const saving = useRef(false);
  const closeRef = useRef<() => void>(() => {});
  const [step, setStep] = useState<Step>("preference");
  const [preference, setPreference] = useState<Preference | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [leadId, setLeadId] = useState<number | null>(null);
  const [token, setToken] = useState("");
  const [honeypot, setHoneypot] = useState(false);
  const [error, setError] = useState("");
  const [errorCode, setErrorCode] = useState<ErrorCode>("");
  const [pending, setPending] = useState<string | null>(null);
  const [whatsappHref, setWhatsappHref] = useState("");
  const [keyboardFrame, setKeyboardFrame] = useState<{ height: number; top: number; dock: boolean } | null>(null);

  const reset = useCallback(() => {
    setStep("preference");
    setPreference(null);
    setName("");
    setPhone("");
    setEmail("");
    setConsent(false);
    setLeadId(null);
    setToken("");
    setHoneypot(false);
    setError("");
    setErrorCode("");
    setPending(null);
    setWhatsappHref("");
  }, []);

  const close = useCallback(() => {
    if (step === "success") reset();
    onClose();
  }, [onClose, reset, step]);

  useEffect(() => {
    closeRef.current = close;
  }, [close]);

  useLayoutEffect(() => {
    if (!open) return;
    const viewport = window.visualViewport;
    if (!viewport) return;
    let settle = 0;
    let applied = viewport.height;
    const update = () => {
      const narrow = window.matchMedia("(max-width: 639px)").matches;
      const keyboard = window.innerHeight - viewport.height > 80;
      const next = !narrow && !keyboard ? null : { height: viewport.height, top: viewport.offsetTop, dock: narrow };
      window.clearTimeout(settle);
      if (next === null || next.height > applied + 40) {
        settle = window.setTimeout(() => {
          applied = next?.height ?? window.innerHeight;
          setKeyboardFrame(next);
        }, 280);
        return;
      }
      applied = next.height;
      setKeyboardFrame(next);
    };
    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      window.clearTimeout(settle);
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      setKeyboardFrame(null);
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!keyboardFrame) return;
    const scroller = panelRef.current?.querySelector<HTMLElement>("[data-wizard-scroll]");
    const active = document.activeElement;
    if (!(active instanceof HTMLElement) || !scroller?.contains(active) || active.tagName !== "INPUT") return;
    const field = active.getBoundingClientRect();
    const view = scroller.getBoundingClientRect();
    if (field.bottom > view.bottom - 8) scroller.scrollTop += field.bottom - view.bottom + 16;
    else if (field.top < view.top + 8) scroller.scrollTop -= view.top - field.top + 16;
  }, [keyboardFrame]);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    const focusable = () =>
      [...panel.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled])")].filter(
        (el) => el.tabIndex !== -1 && el.getAttribute("aria-hidden") !== "true",
      );

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    let textField: HTMLInputElement | null = panel.querySelector("input:not([name=company])");
    let pressedControl = false;
    let release = 0;
    const onPointerDown = (event: PointerEvent) => {
      pressedControl = event.target instanceof Element && Boolean(event.target.closest("button, a"));
      window.clearTimeout(release);
      release = window.setTimeout(() => {
        pressedControl = false;
      }, 400);
    };
    const onFocusIn = (event: FocusEvent) => {
      if (event.target instanceof HTMLInputElement && event.target.name !== "company" && panel.contains(event.target)) {
        textField = event.target;
      }
    };
    const onFocusOut = (event: FocusEvent) => {
      const next = event.relatedTarget;
      if (next instanceof Node && panel.contains(next)) return;
      if (pressedControl) return;
      const field = textField;
      if (!field || !panel.contains(field)) return;
      window.setTimeout(() => {
        pressedControl = false;
        if (!panel.isConnected || !field.isConnected) return;
        const active = document.activeElement;
        if (active instanceof HTMLElement && panel.contains(active) && active !== field) return;
        field.focus({ preventScroll: true });
      }, 0);
    };

    document.addEventListener("keydown", onKey);
    panel.addEventListener("pointerdown", onPointerDown);
    panel.addEventListener("focusin", onFocusIn);
    panel.addEventListener("focusout", onFocusOut);
    panel.querySelector<HTMLElement>("[data-initial-focus]")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(release);
      panel.removeEventListener("pointerdown", onPointerDown);
      panel.removeEventListener("focusin", onFocusIn);
      panel.removeEventListener("focusout", onFocusOut);
    };
  }, [open, step]);

  async function send(current: Exclude<Step, "success">, extra: Record<string, unknown>) {
    if (saving.current) return;
    saving.current = true;
    setPending(current);
    setError("");
    setErrorCode("");
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_LEAD_API || "/api/citas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: current,
          consent,
          locale,
          page: pageForLead(pageRef.current),
          company: companyRef.current?.value ?? "",
          ...(leadId ? { id: leadId, token } : {}),
          ...readAttribution(),
          ...extra,
        }),
      });
      const payload = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        id?: number | string;
        token?: string;
        whatsapp?: string;
      } | null;
      if (!response.ok || !payload?.ok) {
        const code = payload?.error && payload.error in copy.errors ? payload.error : "server";
        setErrorCode(code as ErrorCode);
        setError(copy.errors[code as keyof typeof copy.errors] ?? copy.errors.server);
        return;
      }
      const nextId = readId(payload.id);
      if (typeof payload.token === "string" && /^[a-f0-9]{64}$/.test(payload.token)) setToken(payload.token);
      if (nextId) setLeadId(nextId);
      if (!nextId && !honeypot && !(current === "preference" && leadId === null)) {
        setErrorCode("lead");
        setError(copy.errors.lead);
        return;
      }
      if (!nextId && current === "preference" && leadId === null) setHoneypot(true);
      if (typeof payload.whatsapp === "string") setWhatsappHref(safeWhatsapp(payload.whatsapp));
      setStep(current === "preference" ? "name" : current === "name" ? "phone" : current === "phone" ? "email" : "success");
    } catch {
      setErrorCode("server");
      setError(copy.errors.server);
    } finally {
      saving.current = false;
      setPending(null);
    }
  }

  function choose(value: Preference) {
    setPreference(value);
    void send("preference", { preference: value });
  }

  function back() {
    if (pending) return;
    setError("");
    setErrorCode("");
    setStep((current) => (current === "email" ? "phone" : current === "phone" ? "name" : "preference"));
  }

  if (!open || typeof document === "undefined") return null;

  const stepNumber = step === "name" ? 2 : step === "phone" ? 3 : step === "email" || step === "success" ? 4 : 1;
  const prefLabel = preference === "morning" ? copy.wizardMorning : preference === "afternoon" ? copy.wizardAfternoon : "";
  const safeName = name.replace(/[\r\n]/g, " ").trim().slice(0, 80);
  const message = copy.whatsappMessage(safeName || (locale === "ca" ? "un pacient" : "un paciente"));
  const href =
    whatsappHref || (whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}` : "");

  return createPortal(
    <div className="fixed inset-0 z-[90] flex bg-[#1c211c]/55 sm:items-center sm:justify-center sm:p-6">
      <div className="absolute inset-0 hidden sm:block" onClick={close} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={ledeId}
        data-wizard-step={step}
        tabIndex={-1}
        style={
          keyboardFrame
            ? keyboardFrame.dock
              ? { position: "fixed", top: keyboardFrame.top, left: 0, right: 0, height: keyboardFrame.height, maxHeight: keyboardFrame.height }
              : {
                  position: "fixed",
                  top: keyboardFrame.top,
                  left: "50%",
                  width: "min(32rem, calc(100vw - 3rem))",
                  transform: "translateX(-50%)",
                  height: keyboardFrame.height,
                  maxHeight: keyboardFrame.height,
                }
            : undefined
        }
        className="relative z-10 flex h-[100dvh] w-full flex-col overflow-hidden bg-background text-foreground outline-none sm:h-auto sm:max-h-[min(42rem,calc(100dvh-3rem))] sm:max-w-lg sm:rounded-[1.75rem] sm:border sm:border-border sm:shadow-[0_24px_80px_-36px_rgba(28,33,28,0.55)]"
      >
        <form
          className="flex min-h-0 flex-auto flex-col"
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            if (step === "name") void send("name", { name });
            if (step === "phone") {
              if (!consent) {
                setErrorCode("consent");
                setError(copy.errors.consent);
                return;
              }
              void send("phone", { phone });
            }
            if (step === "email") void send("email", { email });
          }}
        >
        <div data-wizard-scroll className="relative flex min-h-0 flex-auto flex-col overflow-y-auto px-5 pb-4 pt-4 sm:px-8 sm:pt-8">
          <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
            <label>
              Company
              <input ref={companyRef} name="company" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.18em] text-[#0a7b71]">
              {step === "success" ? copy.formKicker : copy.wizardProgress(stepNumber)}
            </p>
            <button
              type="button"
              onClick={close}
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium"
            >
              <X className="size-4" aria-hidden />
              {copy.close}
            </button>
          </div>
          {step !== "preference" && step !== "success" ? (
            <button type="button" onClick={back} className="mt-4 self-start text-sm font-medium text-[#0a7b71] underline-offset-4 hover:underline">
              ← {copy.wizardBack}
            </button>
          ) : null}

          {step === "success" ? (
            <div className="mt-6 flex flex-1 flex-col" role="status">
              <h2 id={titleId} tabIndex={-1} data-initial-focus className="font-serif text-4xl tracking-tight outline-none">
                {copy.formSuccess}
              </h2>
              <p id={ledeId} className="mt-4 text-lg leading-8">
                {copy.formThanks} {safeName}. {prefLabel ? `${copy.wizardPrefSaved} ${prefLabel}. ` : null}
                {copy.formCall} <span className="font-medium">{phone.trim()}</span>
              </p>
            </div>
          ) : step === "preference" ? (
            <>
              <h2 id={titleId} tabIndex={-1} className="mt-6 font-serif text-4xl tracking-tight outline-none">
                {copy.wizardPrefTitle}
              </h2>
              <p id={ledeId} className="mt-3 text-base leading-7 text-muted-foreground">
                {copy.wizardPrefLede}
              </p>
              <div className="mt-8 grid gap-3 max-sm:absolute max-sm:inset-x-5 max-sm:top-1/2 max-sm:mt-0 max-sm:-translate-y-1/2">
                  {(["morning", "afternoon"] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      disabled={pending !== null}
                      aria-pressed={preference === value}
                      data-initial-focus={value === "morning" ? true : undefined}
                      onClick={() => choose(value)}
                      className="flex h-16 items-center justify-between rounded-2xl border border-border bg-card px-5 text-left font-serif text-2xl hover:border-[#0a7b71] disabled:opacity-60 aria-pressed:border-[#0a7b71] aria-pressed:bg-[#e5f4f2]"
                    >
                      {pending === "preference" && preference === value
                        ? copy.formSending
                        : value === "morning"
                          ? copy.wizardMorning
                          : copy.wizardAfternoon}
                      <span aria-hidden className="text-lg text-[#0a7b71]">
                        →
                      </span>
                    </button>
                  ))}
                  {error ? <ErrorText>{error}</ErrorText> : null}
                  {errorCode === "lead" ? (
                    <button type="button" className="text-sm text-[#0a7b71] underline" onClick={reset}>
                      {copy.wizardRestart}
                    </button>
                  ) : null}
              </div>
            </>
          ) : (
            <div className="mt-6 flex flex-1 flex-col">
              <h2 id={titleId} tabIndex={-1} className="font-serif text-4xl tracking-tight outline-none">
                {step === "name" ? copy.wizardNameTitle : step === "phone" ? copy.wizardPhoneTitle : copy.wizardEmailTitle}
              </h2>
              <p id={ledeId} className="mt-3 text-base leading-7 text-muted-foreground">
                {step === "name" ? copy.wizardNameLede : step === "phone" ? copy.wizardPhoneLede : copy.wizardEmailLede}
              </p>
              <div className="mt-6">
                  {step === "name" ? (
                    <Field id={nameId} label={copy.formName}>
                      <input
                        id={nameId}
                        data-initial-focus
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        autoComplete="name"
                        maxLength={80}
                        required
                        className={fieldClass}
                      />
                    </Field>
                  ) : null}
                  {step === "phone" ? (
                    <Field id={phoneId} label={copy.formPhone}>
                      <input
                        id={phoneId}
                        data-initial-focus
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        required
                        className={fieldClass}
                      />
                    </Field>
                  ) : null}
                  {step === "email" ? (
                    <Field id={emailId} label={copy.formEmail}>
                      <input
                        id={emailId}
                        data-initial-focus
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        type="email"
                        autoComplete="email"
                        maxLength={120}
                        className={fieldClass}
                      />
                    </Field>
                  ) : null}
                  {error && step !== "phone" ? <ErrorText>{error}</ErrorText> : null}
                  {errorCode === "lead" ? (
                    <button type="button" className="mt-3 self-start text-sm text-[#0a7b71] underline" onClick={reset}>
                      {copy.wizardRestart}
                    </button>
                  ) : null}
              </div>
            </div>
          )}
        </div>
        <div className={`shrink-0 bg-background px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-8 sm:pb-8 ${step === "preference" ? "hidden" : ""}`}>
          {step === "success" ? (
            <>
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-[#128C7E] px-6 text-base font-medium text-white hover:bg-[#0e7569]"
                >
                  <WhatsAppMark />
                  {copy.formWhatsapp}
                </a>
              ) : (
                <p className="text-[15px] leading-7 text-muted-foreground">{copy.formNoWhatsapp}</p>
              )}
              <button
                type="button"
                className="mt-4 block text-sm text-muted-foreground underline-offset-4 hover:underline"
                onClick={() => {
                  setError("");
                  setErrorCode("");
                  setStep("name");
                }}
              >
                {copy.formFix}
              </button>
            </>
          ) : step === "preference" ? null : (
            <div className="grid gap-3">
              {step === "phone" ? (
                <>
                  <label htmlFor={consentId} className="flex items-start gap-3 rounded-2xl bg-card p-4 text-sm leading-6 text-muted-foreground">
                    <input
                      id={consentId}
                      type="checkbox"
                      checked={consent}
                      onChange={(event) => {
                        setConsent(event.target.checked);
                        if (event.target.checked && errorCode === "consent") {
                          setError("");
                          setErrorCode("");
                        }
                      }}
                      className="mt-1 size-5 accent-[#0a7b71]"
                    />
                    <span>
                      {copy.formConsent}{" "}
                      <a href={privacyPath(locale)} target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-4">
                        {copy.formPrivacy}
                      </a>
                    </span>
                  </label>
                  {error ? <ErrorText>{error}</ErrorText> : null}
                </>
              ) : null}
              <button
                type="submit"
                disabled={pending !== null}
                onMouseDown={(event) => event.preventDefault()}
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#0a7b71] px-6 text-base font-medium text-[#f6f3ec] hover:bg-[#08685f] disabled:opacity-60"
              >
                {pending ? copy.formSending : copy.wizardNext}
              </button>
              {step === "email" ? (
                <button
                  type="button"
                  disabled={pending !== null}
                  onClick={() => void send("email", { email: "" })}
                  className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-6 text-base font-medium disabled:opacity-60"
                >
                  {copy.wizardSkip}
                </button>
              ) : null}
            </div>
          )}
        </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

const fieldClass =
  "h-14 w-full rounded-2xl border border-border bg-card px-4 text-base outline-none focus-visible:border-[#0a7b71] focus-visible:ring-3 focus-visible:ring-[#0a7b71]/30";

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="mt-4 text-sm text-destructive">
      {children}
    </p>
  );
}

function pageForLead(override: string | null) {
  if (override) return override;
  const path = window.location.pathname;
  if (path.length <= 180 && /^\/[a-z0-9/-]*$/.test(path)) return path;
  return "/";
}

function readId(value: unknown) {
  const id = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  return Number.isInteger(id) && id > 0 ? id : null;
}

function safeWhatsapp(value: string) {
  if (value.length > 600) return "";
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.hostname !== "wa.me") return "";
    return url.toString();
  } catch {
    return "";
  }
}

function WhatsAppMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-current">
      <path d="M20.5 3.5A11 11 0 0 0 2.1 16.8L1 23l6.4-1.1A11 11 0 0 0 20.5 3.5zM12 20.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3.8.6.6-3.7-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.4.2-.3a.5.5 0 0 0 0-.5c0-.1-.5-1.3-.7-1.7s-.4-.4-.5-.4h-.4a.8.8 0 0 0-.6.3 2.5 2.5 0 0 0-.8 1.9 4.4 4.4 0 0 0 .9 2.3 10 10 0 0 0 3.8 3.3 12.7 12.7 0 0 0 2.6 1 2.2 2.2 0 0 0 1.5.1 1.9 1.9 0 0 0 1.2-.9 1.5 1.5 0 0 0 .1-1.1c-.1-.1-.2-.1-.4-.2z" />
    </svg>
  );
}
