import { AdminAccountManagement } from "@/components/admin/admin-account-management";
import {
  getSupabaseAdminAuth,
  type SupabaseAdminUser,
} from "@/lib/supabase/admin";

export default async function AdminAccountsPage() {
  const supabaseAdmin = getSupabaseAdminAuth();
  const { data, error } = await supabaseAdmin.listUsers();

  if (error) {
    throw new Error(`Unable to load admin accounts: ${error.message}`);
  }

  type AdminAccountListItem = {
    id: string;
    email: string;
    createdAt: string | null;
    lastSignInAt: string | null;
  };

  const accounts = data.users
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
      <section className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 text-white backdrop-blur-md">
        <p className="section-kicker !text-[var(--color-gold-soft)]">Admin accounts</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-white">
          Manage who can access the backend
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/68">
          Create additional admin logins from inside the dashboard so handover stays fast and you do not need to open Supabase for every new teammate.
        </p>
      </section>

      <AdminAccountManagement accounts={accounts} />
    </div>
  );
}
