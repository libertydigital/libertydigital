import { AdminAccountManagement } from "@/components/admin/admin-account-management";
import { isAdminUserRecord, requireAdminUser } from "@/lib/auth";
import {
  getSupabaseAdminAuth,
  type SupabaseAdminUser,
} from "@/lib/supabase/admin";

export default async function AdminAccountsPage() {
  await requireAdminUser();

  const supabaseAdmin = getSupabaseAdminAuth();
  const { data, error } = await supabaseAdmin.listUsers();
  const loadError = error ? "Admin accounts could not be loaded right now." : null;

  type AdminAccountListItem = {
    id: string;
    email: string;
    createdAt: string | null;
    lastSignInAt: string | null;
  };

  const accounts = (data?.users ?? [])
    .filter((user: SupabaseAdminUser) => isAdminUserRecord(user))
    .map((user: SupabaseAdminUser) => ({
      id: user.id,
      email: user.email ?? "No email available",
      createdAt: user.created_at ?? null,
      lastSignInAt: user.last_sign_in_at ?? null,
    }))
    .sort((a: AdminAccountListItem, b: AdminAccountListItem) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="space-y-6">
      <section className="rounded-[34px] border border-[var(--color-line)] bg-[var(--color-paper)] p-6 shadow-[0_22px_52px_rgba(17,32,49,0.08)]">
        <p className="section-kicker">Admin accounts</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-[var(--color-navy)]">
          Manage who can access the backend
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-navy-soft)]">
          Create additional admin logins from inside the dashboard so handover stays fast and you do not need to open Supabase for every new teammate.
        </p>
        {loadError ? (
          <p className="mt-4 rounded-[20px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {loadError}
          </p>
        ) : null}
      </section>

      <AdminAccountManagement accounts={accounts} />
    </div>
  );
}
