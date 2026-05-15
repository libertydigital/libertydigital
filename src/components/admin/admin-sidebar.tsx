"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Shield, Users } from "lucide-react";

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
      </div>
      <div className="mt-4 rounded-[24px] border border-[rgba(177,138,81,0.14)] bg-[linear-gradient(180deg,rgba(234,217,188,0.22),rgba(255,250,243,0.82))] px-4 py-4 text-sm leading-7 text-[var(--color-navy-soft)]">
        Keep every request updated so follow-up and document collection stay easy to spot.
      </div>
    </aside>
  );
}
