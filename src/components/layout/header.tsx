import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { MobileNav } from "@/components/layout/mobile-nav";
import { ButtonLink } from "@/components/ui/button";
import { SITE_NAV_ITEMS } from "@/lib/services";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-[linear-gradient(180deg,rgba(6,9,13,0.94),rgba(7,10,14,0.82))] backdrop-blur-2xl">
      <div className="container-shell py-3 sm:py-4">
        <div className="flex items-center justify-between rounded-[30px] border border-white/8 bg-[linear-gradient(180deg,rgba(12,16,22,0.82),rgba(8,11,15,0.74))] px-4 py-3 shadow-[0_24px_54px_rgba(3,8,15,0.24)] sm:px-5 lg:px-6">
        <Link
          aria-label="Liberty Digital Consulting Services"
          className="group flex items-center gap-3"
          href="/"
        >
          <Image
            alt="Liberty Digital Consulting Services"
            className="h-auto w-[132px] sm:w-[156px] lg:w-[172px]"
            height={757}
            priority
            src="/liberty-logo-light.png"
            width={1600}
          />
          <div className="hidden min-[1180px]:block">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-[var(--color-gold)]">
              Rome, Italy
            </p>
            <p className="mt-1 text-sm text-white/54 transition group-hover:text-white/72">
              Documentation and registration support
            </p>
          </div>
          <span className="sr-only">Liberty Digital Consulting Services</span>
        </Link>
        <nav className="hidden items-center gap-2 lg:flex">
          {SITE_NAV_ITEMS.map((item, index) => (
            <Link
              className="rounded-full px-4 py-2.5 text-sm font-medium text-white/64 transition hover:bg-white/6 hover:text-white"
              href={item.href}
              key={`${item.href}-${item.label}-${index}`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            className="rounded-full px-4 py-2.5 text-sm font-medium text-white/48 transition hover:bg-white/6 hover:text-white/76"
            href="/login"
          >
            Admin
          </Link>
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <ButtonLink
            className="px-5 py-3 shadow-[0_18px_36px_rgba(8,12,18,0.32)]"
            href="/contact"
          >
            Request Support
            <ArrowUpRight className="ml-2 size-4" />
          </ButtonLink>
        </div>
        <MobileNav />
        </div>
      </div>
    </header>
  );
}
