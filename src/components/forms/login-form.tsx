"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="surface-card w-full max-w-md rounded-[32px] p-8"
      data-animate-card
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = String(formData.get("email") || "");
        const password = String(formData.get("password") || "");

        startTransition(async () => {
          try {
            setError(null);
            const supabase = getSupabaseBrowserClient();
            const { error: signInError } = await supabase.auth.signInWithPassword({
              email,
              password,
            });

            if (signInError) {
              setError("Unable to sign in with those credentials.");
              return;
            }

            router.push("/admin");
            router.refresh();
          } catch (err) {
            console.error("Login error:", err);
            setError("An unexpected error occurred. Please try again.");
          }
        });
      }}
    >
      <p className="section-kicker">Admin access</p>
      <h1 className="mt-4 font-serif text-4xl font-semibold text-[var(--color-navy)]">
        Sign in to the lead dashboard
      </h1>
      <p className="mt-4 text-sm leading-7 text-[var(--color-navy-soft)]">
        Only manually created admin users should access this area.
      </p>
      <div className="mt-8 space-y-5">
        <label className="block space-y-2 text-sm font-semibold text-[var(--color-navy)]">
          <span>Email</span>
          <input
            className="w-full rounded-[20px] border border-[var(--color-line)] bg-white/85 px-4 py-3 text-sm"
            name="email"
            autoComplete="username"
            required
            type="email"
          />
        </label>
        <label className="block space-y-2 text-sm font-semibold text-[var(--color-navy)]">
          <span>Password</span>
          <input
            className="w-full rounded-[20px] border border-[var(--color-line)] bg-white/85 px-4 py-3 text-sm"
            name="password"
            autoComplete="current-password"
            required
            type="password"
          />
        </label>
      </div>
      {error ? (
        <div aria-live="polite" className="mt-5 rounded-[22px] border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      <div className="mt-6">
        <Button className="w-full" disabled={isPending} type="submit">
          {isPending ? "Signing in..." : "Sign in"}
        </Button>
      </div>
    </form>
  );
}
