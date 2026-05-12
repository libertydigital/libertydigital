import Link from "next/link";

export function AdminSidebar() {
  return (
    <aside className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))] p-6 text-white shadow-[0_20px_48px_rgba(4,10,18,0.14)] backdrop-blur-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--color-gold-soft)]">
        Admin navigation
      </p>
      <nav className="mt-6 flex flex-col gap-3">
        <Link
          className="rounded-[18px] border border-white/8 bg-white/5 px-4 py-3 text-sm font-medium text-white/78 hover:bg-white/10 hover:text-white"
          href="/admin"
        >
          Dashboard overview
        </Link>
        <Link
          className="rounded-[18px] border border-white/8 bg-white/5 px-4 py-3 text-sm font-medium text-white/78 hover:bg-white/10 hover:text-white"
          href="/admin/leads"
        >
          All leads
        </Link>
        <Link
          className="rounded-[18px] border border-white/8 bg-white/5 px-4 py-3 text-sm font-medium text-white/78 hover:bg-white/10 hover:text-white"
          href="/admin/accounts"
        >
          Admin accounts
        </Link>
      </nav>
      <div className="mt-6 rounded-[24px] border border-white/8 bg-[rgba(234,217,188,0.06)] px-4 py-4 text-sm leading-7 text-white/66">
        Keep statuses current so follow-up, document collection, and completion stages remain easy to track.
      </div>
    </aside>
  );
}
