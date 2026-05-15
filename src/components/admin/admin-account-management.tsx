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
      <section className="rounded-[34px] border border-[var(--color-line)] bg-[var(--color-paper)] p-6 shadow-[0_22px_52px_rgba(17,32,49,0.08)] sm:p-8">
        <p className="section-kicker">Create admin</p>
        <h2 className="mt-3 font-serif text-3xl font-semibold text-[var(--color-navy)]">
          Add another admin login
        </h2>
        <p className="mt-4 text-sm leading-7 text-[var(--color-navy-soft)]">
          Accounts created here can sign into the protected admin panel immediately.
        </p>
        <form action={formAction} className="mt-6 space-y-4">
          <div className="space-y-2">
            <label
              className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]"
              htmlFor="admin-email"
            >
              Admin email
            </label>
            <input
              className="w-full rounded-[20px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm text-[var(--color-navy)] placeholder:text-[var(--color-navy-soft)]"
              id="admin-email"
              name="email"
              placeholder="admin@example.com"
              type="email"
            />
          </div>
          <div className="space-y-2">
            <label
              className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]"
              htmlFor="admin-password"
            >
              Temporary password
            </label>
            <input
              className="w-full rounded-[20px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm text-[var(--color-navy)] placeholder:text-[var(--color-navy-soft)]"
              id="admin-password"
              name="password"
              placeholder="Minimum 10 characters"
              type="password"
            />
          </div>
          {state?.message ? (
            <p className={`text-sm ${state.success ? "text-emerald-700" : "text-rose-700"}`}>
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

      <section className="rounded-[34px] border border-[var(--color-line)] bg-[var(--color-paper)] p-6 shadow-[0_22px_52px_rgba(17,32,49,0.08)] sm:p-8">
        <p className="section-kicker">Current admins</p>
        <h2 className="mt-3 font-serif text-3xl font-semibold text-[var(--color-navy)]">
          Active login accounts
        </h2>
        <p className="mt-4 text-sm leading-7 text-[var(--color-navy-soft)]">
          Every account listed here can access the admin workspace.
        </p>
        <div className="mt-6 space-y-4">
          {accounts.map((account) => (
            <article
              className="rounded-[24px] border border-[var(--color-line)] bg-white px-4 py-4"
              key={account.id}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="break-words text-sm font-semibold text-[var(--color-navy)]">{account.email}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--color-navy-soft)]">
                    Created {account.createdAt ? formatDateTime(account.createdAt) : "Unknown"}
                  </p>
                </div>
                <span className="rounded-full border border-[var(--color-line)] bg-[rgba(220,229,237,0.32)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-navy-soft)]">
                  {account.lastSignInAt ? "Signed in before" : "No sign-in yet"}
                </span>
              </div>
              <p className="mt-3 text-sm text-[var(--color-navy-soft)]">
                Last sign-in: {account.lastSignInAt ? formatDateTime(account.lastSignInAt) : "Never"}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
