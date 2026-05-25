"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Archive, Home, Shield, Users } from "lucide-react";

const navItems = [
  {
    href: "/admin",
    label: "Dashboard",
    description: "Overview",
    icon: Home,
  },
  {
    href: "/admin/leads",
    label: "Leads",
    description: "Requests",
    icon: Shield,
  },
  {
    href: "/admin/accounts",
    label: "Accounts",
    description: "Access",
    icon: Users,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isArchivedView = pathname === "/admin/leads" && searchParams.get("archived") === "1";

  return (
    <aside className="rounded-[32px] border border-[var(--color-line)] bg-[var(--color-paper)] p-4 shadow-[0_20px_50px_rgba(17,32,49,0.08)]">
      <div className="flex flex-col gap-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              className={`rounded-[22px] border px-4 py-4 transition ${
                isActive
                  ? "border-[rgba(177,138,81,0.24)] bg-[linear-gradient(180deg,rgba(17,32,49,0.96),rgba(24,39,57,0.92))] text-white shadow-[0_16px_32px_rgba(17,32,49,0.18)]"
                  : "border-[var(--color-line)] bg-white text-[var(--color-navy)] hover:border-[rgba(177,138,81,0.22)] hover:bg-[rgba(220,229,237,0.26)]"
              }`}
              href={item.href}
              key={item.href}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex size-11 items-center justify-center rounded-[16px] ${
                    isActive
                      ? "bg-white/10 text-[var(--color-gold-soft)]"
                      : "bg-[rgba(220,229,237,0.48)] text-[var(--color-navy)]"
                  }`}
                >
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className={`text-xs ${isActive ? "text-white/58" : "text-[var(--color-navy-soft)]"}`}>
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
        <Link
          className={`rounded-[22px] border px-4 py-4 transition ${
            isArchivedView
              ? "border-[rgba(151,39,54,0.18)] bg-[linear-gradient(180deg,rgba(122,18,38,0.96),rgba(151,39,54,0.92))] text-white shadow-[0_16px_32px_rgba(122,18,38,0.18)]"
              : "border-[rgba(151,39,54,0.14)] bg-[linear-gradient(180deg,rgba(255,245,245,0.92),rgba(255,251,251,0.98))] text-[color:#7a1226] hover:border-[rgba(151,39,54,0.22)] hover:bg-[rgba(255,241,241,0.95)]"
          }`}
          href="/admin/leads?archived=1"
        >
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex size-11 items-center justify-center rounded-[16px] ${
                isArchivedView
                  ? "bg-white/10 text-white"
                  : "bg-[rgba(151,39,54,0.08)] text-[color:#972736]"
              }`}
            >
              <Archive className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold">Archived</p>
              <p
                className={`text-xs ${
                  isArchivedView ? "text-white/70" : "text-[color:#972736]"
                }`}
              >
                Hidden leads
              </p>
            </div>
          </div>
        </Link>
      </div>
      <div className="mt-4 rounded-[24px] border border-[rgba(177,138,81,0.14)] bg-[linear-gradient(180deg,rgba(234,217,188,0.22),rgba(255,250,243,0.82))] px-4 py-4 text-sm leading-7 text-[var(--color-navy-soft)]">
        Keep every request updated so follow-up and document collection stay easy to spot.
      </div>
    </aside>
  );
}
