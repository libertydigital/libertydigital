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
        className="rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-3 text-white shadow-[0_16px_32px_rgba(4,10,18,0.18)] backdrop-blur-xl"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      <div
        className={cn(
          "absolute right-0 top-16 w-[min(92vw,340px)] rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,14,19,0.98),rgba(14,21,31,0.96))] p-5 text-white shadow-[0_32px_80px_rgba(4,10,18,0.28)] backdrop-blur-2xl transition",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0",
        )}
      >
        <nav className="flex flex-col gap-4">
          {SITE_NAV_ITEMS.map((item, index) => (
            <Link
              className="rounded-[18px] border border-white/8 bg-white/5 px-4 py-3 text-base font-medium text-white/82"
              href={item.href}
              key={`${item.href}-${item.label}-${index}`}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            className="rounded-[18px] border border-white/8 bg-white/5 px-4 py-3 text-base font-medium text-white/82"
            href="/login"
            onClick={() => setOpen(false)}
          >
            Admin Login
          </Link>
          <ButtonLink className="mt-2" href="/contact" variant="primary">
            Request Support
          </ButtonLink>
        </nav>
      </div>
    </div>
  );
}
