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
      const panel = panelRef.current;
      const active = document.activeElement;
      const typing = active instanceof HTMLInputElement && active.name !== "company" && !active.hasAttribute("data-keyboard-hold") && !!panel?.contains(active);
      const narrow = window.matchMedia("(max-width: 639px)").matches;
      const keyboard = window.innerHeight - viewport.height > 80;
      if (typing && viewport.height >= applied - 40) return;
      const next = !narrow && !keyboard ? null : { height: viewport.height, top: viewport.offsetTop, dock: narrow };
      window.clearTimeout(settle);
      if (next === null || next.height > applied + 40) {
        settle = window.setTimeout(() => {
          const current = document.activeElement;
          const stillTyping = current instanceof HTMLInputElement && current.name !== "company" && !!panelRef.current?.contains(current);
          if (stillTyping) return;
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
    window.addEventListener("resize", update);
    return () => {
      window.clearTimeout(settle);
      viewport.removeEventListener("resize", update);
      window.removeEventListener("resize", update);
      setKeyboardFrame(null);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    const focusable = () =>
      [...panel.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled])")].filter(
        (el) => el.tabIndex !== -1 && el.getAttribute("aria-hidden") !== "true",
      );

    let tabDirection: "forward" | "back" | null = null;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      tabDirection = event.shiftKey ? "back" : "forward";
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

    let pressedControl = false;
    let release = 0;
    const currentField = () => panel.querySelector<HTMLInputElement>("input[data-initial-focus]");
    const onPointerDown = (event: PointerEvent) => {
      pressedControl = event.target instanceof Element && Boolean(event.target.closest("button, a"));
      window.clearTimeout(release);
      release = window.setTimeout(() => {
        pressedControl = false;
      }, 400);
    };
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement) || !panel.contains(target) || !target.hasAttribute("data-keyboard-hold")) return;
      if (tabDirection === "forward" || tabDirection === "back") {
        const direction = tabDirection;
        tabDirection = null;
        const items = focusable();
        const field = currentField();
        const index = field ? items.indexOf(field) : -1;
        const destination = direction === "back" ? items[Math.max(0, index)] : items[index + 1] ?? items[0];
        destination?.focus();
        return;
      }
      currentField()?.focus({ preventScroll: true });
    };
    const onFocusOut = (event: FocusEvent) => {
      const next = event.relatedTarget;
      if (next instanceof Element && next.hasAttribute("data-keyboard-hold")) return;
      if (next instanceof Node && panel.contains(next)) return;
      if (pressedControl) return;
      const field = currentField();
      if (!field || !field.isConnected) return;
      field.focus({ preventScroll: true });
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
                        enterKeyHint="next"
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
                        enterKeyHint="next"
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
                        enterKeyHint="next"
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
      <div className="relative">
        {children}
        <input
          data-keyboard-hold=""
          name="keyboard-hold"
          autoComplete="off"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
          onFocus={(event) => {
            event.currentTarget.parentElement?.querySelector<HTMLInputElement>("input[data-initial-focus]")?.focus({ preventScroll: true });
          }}
        />
      </div>
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
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6 shrink-0 fill-current">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}
