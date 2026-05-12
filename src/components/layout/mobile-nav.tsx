"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { SITE_NAV_ITEMS } from "@/lib/services";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative lg:hidden">
      <button
        aria-expanded={open}
        aria-label="Toggle navigation"
        className="rounded-full border border-[var(--color-line)] bg-white/80 p-3"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      <div
        className={cn(
          "absolute right-0 top-16 w-[min(88vw,320px)] rounded-[28px] border border-[var(--color-line)] bg-[var(--color-paper)] p-6 shadow-[var(--shadow-card)] transition",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0",
        )}
      >
        <nav className="flex flex-col gap-4">
          {SITE_NAV_ITEMS.map((item, index) => (
            <Link
              className="text-base font-medium text-[var(--color-navy)]"
              href={item.href}
              key={`${item.href}-${item.label}-${index}`}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            className="text-base font-medium text-[var(--color-navy)]"
            href="/login"
            onClick={() => setOpen(false)}
          >
            Admin Login
          </Link>
          <ButtonLink href="/contact" variant="primary">
            Request Support
          </ButtonLink>
        </nav>
      </div>
    </div>
  );
}
