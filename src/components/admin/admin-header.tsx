import { AdminSignOutButton } from "@/components/admin/admin-sign-out-button";

export function AdminHeader({
  user,
}: {
  user: { email?: string | null };
}) {
  return (
    <div className="flex flex-col gap-5 rounded-[34px] border border-[var(--color-line)] bg-[var(--color-paper)] p-6 text-[var(--color-navy)] shadow-[0_20px_48px_rgba(17,32,49,0.08)] sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="section-kicker">Admin workspace</p>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-[var(--color-navy)] sm:text-4xl">
          Lead management dashboard
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-navy-soft)]">
          Review new enquiries, update statuses quickly, and keep document-sensitive follow-up organised from one place.
        </p>
        <div className="mt-4 inline-flex rounded-full border border-[rgba(177,138,81,0.18)] bg-[rgba(234,217,188,0.28)] px-4 py-2 text-sm text-[var(--color-navy-soft)]">
          {user.email}
        </div>
      </div>
      <AdminSignOutButton />
    </div>
  );
}
