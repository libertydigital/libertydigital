import { AdminSignOutButton } from "@/components/admin/admin-sign-out-button";

export function AdminHeader({
  user,
}: {
  user: { email?: string | null };
}) {
  return (
    <div className="flex flex-col gap-6 rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 text-white backdrop-blur-md sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="section-kicker !text-[var(--color-gold-soft)]">Lead dashboard</p>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-white sm:text-4xl">
          Manage service requests with cleaner follow-up
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">
          Review new enquiries, track status changes, and keep document-sensitive follow-up organised from one place.
        </p>
        <p className="mt-3 text-sm text-white/58">{user.email}</p>
      </div>
      <AdminSignOutButton />
    </div>
  );
}
