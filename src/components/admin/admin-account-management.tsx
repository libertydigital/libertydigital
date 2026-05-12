"use client";

import { useActionState } from "react";

import { createAdminAccountAction } from "@/actions/admin-account-actions";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";

type AdminAccountItem = {
  id: string;
  email: string;
  createdAt: string | null;
  lastSignInAt: string | null;
};

export function AdminAccountManagement({
  accounts,
}: {
  accounts: AdminAccountItem[];
}) {
  const [state, formAction, isPending] = useActionState(
    createAdminAccountAction,
    undefined,
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 text-white backdrop-blur-md sm:p-8">
        <p className="section-kicker !text-[var(--color-gold-soft)]">Create admin</p>
        <h2 className="mt-3 font-serif text-3xl font-semibold text-white">
          Add another admin login
        </h2>
        <p className="mt-4 text-sm leading-7 text-white/66">
          Accounts created here can sign into the protected admin panel immediately.
        </p>
        <form action={formAction} className="mt-6 space-y-4">
          <div className="space-y-2">
            <label
              className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-soft)]"
              htmlFor="admin-email"
            >
              Admin email
            </label>
            <input
              className="w-full rounded-[20px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.04))] px-4 py-3 text-sm text-white shadow-inner shadow-black/10 placeholder:text-white/36"
              id="admin-email"
              name="email"
              placeholder="admin@example.com"
              type="email"
            />
          </div>
          <div className="space-y-2">
            <label
              className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-soft)]"
              htmlFor="admin-password"
            >
              Temporary password
            </label>
            <input
              className="w-full rounded-[20px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.04))] px-4 py-3 text-sm text-white shadow-inner shadow-black/10 placeholder:text-white/36"
              id="admin-password"
              name="password"
              placeholder="Minimum 10 characters"
              type="password"
            />
          </div>
          {state?.message ? (
            <p className={`text-sm ${state.success ? "text-emerald-300" : "text-rose-300"}`}>
              {state.message}
            </p>
          ) : null}
          <Button
            className="border-white/12 bg-white/8 text-white hover:border-[rgba(234,217,188,0.34)] hover:bg-white/12"
            disabled={isPending}
            type="submit"
            variant="secondary"
          >
            {isPending ? "Creating admin..." : "Create admin account"}
          </Button>
        </form>
      </section>

      <section className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 text-white backdrop-blur-md sm:p-8">
        <p className="section-kicker !text-[var(--color-gold-soft)]">Current admins</p>
        <h2 className="mt-3 font-serif text-3xl font-semibold text-white">
          Active login accounts
        </h2>
        <p className="mt-4 text-sm leading-7 text-white/66">
          Every account listed here can access the admin workspace.
        </p>
        <div className="mt-6 space-y-4">
          {accounts.map((account) => (
            <article
              className="rounded-[24px] border border-white/8 bg-white/5 px-4 py-4"
              key={account.id}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="break-words text-sm font-semibold text-white">{account.email}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/46">
                    Created {account.createdAt ? formatDateTime(account.createdAt) : "Unknown"}
                  </p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/68">
                  {account.lastSignInAt ? "Signed in before" : "No sign-in yet"}
                </span>
              </div>
              <p className="mt-3 text-sm text-white/58">
                Last sign-in: {account.lastSignInAt ? formatDateTime(account.lastSignInAt) : "Never"}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
