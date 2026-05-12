import Link from "next/link";

import { MobileNav } from "@/components/layout/mobile-nav";
import { ButtonLink } from "@/components/ui/button";
import { SITE_NAV_ITEMS } from "@/lib/services";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-[rgba(7,10,14,0.76)] backdrop-blur-2xl">
      <div className="container-shell flex items-center justify-between py-4">
        <Link className="flex flex-col" href="/">
          <span className="font-serif text-2xl font-semibold tracking-wide text-white">
            Liberty Digital
          </span>
          <span className="text-xs uppercase tracking-[0.3em] text-white/58">
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
