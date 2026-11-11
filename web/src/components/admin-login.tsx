"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const password = String(new FormData(event.currentTarget).get("password") ?? "");
    setPending(true);
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setPending(false);
    if (!response.ok) {
      setError(response.status === 429 ? "Demasiados intentos. Espera un rato." : "Contraseña incorrecta.");
      return;
    }
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 grid max-w-sm gap-4">
      <div className="grid gap-2">
        <Label htmlFor="admin-password">Contraseña</Label>
        <Input id="admin-password" name="password" type="password" autoComplete="current-password" required className="h-12 text-base" />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" disabled={pending} className="h-12 rounded-full">
        {pending ? "Entrando…" : "Entrar"}
      </Button>
    </form>
  );
}

export function AdminLogout() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <button type="button" onClick={logout} className="text-sm underline underline-offset-4">
      Cerrar sesión
    </button>
  );
}
