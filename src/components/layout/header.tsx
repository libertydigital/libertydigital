import Link from "next/link";

import { MobileNav } from "@/components/layout/mobile-nav";
import { ButtonLink } from "@/components/ui/button";
import { SITE_NAV_ITEMS } from "@/lib/services";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-[rgba(7,10,14,0.76)] backdrop-blur-2xl">
      <div className="container-shell flex items-center justify-between py-3 sm:py-4">
        <Link className="flex flex-col" href="/">
          <span className="font-serif text-[1.55rem] font-semibold tracking-wide text-white sm:text-2xl">
            Liberty Digital
          </span>
          <span className="text-[0.62rem] uppercase tracking-[0.24em] text-white/58 sm:text-xs sm:tracking-[0.3em]">
            Consulting Services
          </span>
        </Link>
        <nav className="hidden items-center gap-8 lg:flex">
          {SITE_NAV_ITEMS.map((item, index) => (
            <Link
              className="text-sm font-medium text-white/68 hover:text-white"
              href={item.href}
              key={`${item.href}-${item.label}-${index}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden lg:block">
          <ButtonLink href="/contact">Request Support</ButtonLink>
        </div>
        <MobileNav />
      </div>
    </header>
  );
}
