"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { SocialLinks } from "@/components/layout/social-links";
import { SITE_NAV_ITEMS } from "@/lib/services";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative lg:hidden">
      <button
        aria-expanded={open}
        aria-label="Toggle navigation"
        className="rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(14,24,36,0.78),rgba(8,16,24,0.68))] p-3 text-[var(--color-paper)] shadow-[0_16px_32px_rgba(4,10,18,0.18)] backdrop-blur-xl"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      {open ? (
        <div
          className={cn(
            "absolute right-0 top-16 z-50 w-[min(92vw,360px)] rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,22,33,0.96),rgba(8,16,24,0.94))] p-5 text-[var(--color-paper)] shadow-[0_32px_80px_rgba(4,10,18,0.22)] backdrop-blur-2xl",
          )}
        >
          <div className="mb-5 rounded-[24px] border border-white/10 bg-white/6 px-4 py-4">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-[var(--color-gold)]">
              Liberty Digital
            </p>
            <p className="mt-2 text-sm leading-6 text-white/68">
              Nigerian documentation and digital registration support in Rome.
            </p>
            <SocialLinks className="mt-4" />
          </div>
          <nav className="flex flex-col gap-4">
            {SITE_NAV_ITEMS.map((item, index) => (
              <Link
                className="rounded-[18px] border border-white/10 bg-white/8 px-4 py-3 text-base font-medium text-white/86 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                href={item.href}
                key={`${item.href}-${item.label}-${index}`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              className="rounded-[18px] border border-white/10 bg-white/8 px-4 py-3 text-base font-medium text-white/86 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
              href="/login"
              onClick={() => setOpen(false)}
            >
              Admin Login
            </Link>
            <ButtonLink className="mt-2" href="/contact" variant="primary">
              Request Support
              <ArrowUpRight className="ml-2 size-4" />
            </ButtonLink>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
