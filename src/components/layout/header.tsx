import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowUpRight, MessageCircle } from "lucide-react";

import { HomeScrollLink } from "@/components/layout/home-scroll-link";
import { SocialLinks } from "@/components/layout/social-links";
import { ButtonLink } from "@/components/ui/button";
import { SITE_NAV_ITEMS } from "@/lib/services";
import { BUSINESS_DETAILS } from "@/lib/services";
import { buildWhatsAppLink } from "@/lib/utils";

const MobileNav = dynamic(
  () => import("@/components/layout/mobile-nav").then((module) => module.MobileNav),
  {
    loading: () => (
      <div className="relative lg:hidden">
        <button
          aria-label="Open navigation"
          className="rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(14,24,36,0.78),rgba(8,16,24,0.68))] p-3 text-[var(--color-paper)] shadow-[0_16px_32px_rgba(4,10,18,0.18)] backdrop-blur-xl"
          type="button"
        >
          <span className="sr-only">Open navigation</span>
          <span aria-hidden="true" className="block h-5 w-5" />
        </button>
      </div>
    ),
  },
);

export function Header() {
  const whatsappLink = buildWhatsAppLink(
    BUSINESS_DETAILS.phone,
    "Hello Liberty Digital Consulting, I need document support.",
  );

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-[linear-gradient(180deg,rgba(8,16,24,0.86),rgba(8,16,24,0.7))] backdrop-blur-2xl">
      <div className="container-premium py-2 sm:py-3">
        <div className="flex items-center justify-between rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,22,33,0.72),rgba(8,16,24,0.56))] px-3 py-2 shadow-[0_18px_42px_rgba(3,8,15,0.18)] backdrop-blur-xl sm:rounded-[26px] sm:px-5 sm:py-2.5 lg:flex lg:flex-wrap lg:items-center lg:gap-x-6 lg:gap-y-3 lg:px-7 xl:px-8">
          <HomeScrollLink
            aria-label="Liberty Digital Consulting Services"
            className="group flex items-center gap-3 lg:min-w-0"
            href="/"
          >
            <Image
              alt="Liberty Digital Consulting Services"
              className="h-auto w-[88px] brightness-110 contrast-125 drop-shadow-[0_8px_18px_rgba(0,0,0,0.24)] sm:w-[152px] lg:w-[172px]"
              height={983}
              priority
              sizes="(min-width: 1024px) 172px, (min-width: 640px) 152px, 88px"
              src="/liberty-logo-light.png"
              width={1600}
            />
            <div className="hidden min-[1180px]:block">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-[var(--color-gold)]">
                Rome, Italy
              </p>
              <p className="mt-0.5 text-[0.92rem] text-white/62 transition group-hover:text-white/82">
                Document preparation and consulting
              </p>
            </div>
            <span className="sr-only">Liberty Digital Consulting Services</span>
          </HomeScrollLink>
          <nav className="hidden min-w-0 items-center justify-center gap-1.5 border-t border-white/10 pt-2 lg:order-3 lg:flex lg:w-full lg:gap-2">
            {SITE_NAV_ITEMS.map((item, index) => (
              <Link
                className="whitespace-nowrap rounded-full px-3.5 py-2 text-[0.92rem] font-medium text-white/72 transition hover:bg-white/8 hover:text-white"
                href={item.href}
                key={`${item.href}-${item.label}-${index}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center justify-end gap-3 lg:ml-auto lg:flex">
            <SocialLinks linkClassName="size-11" iconClassName="size-[0.95rem]" />
            {whatsappLink ? (
              <Link
                className="inline-flex size-11 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white transition hover:bg-white/12"
                href={whatsappLink}
                rel="noopener noreferrer"
                target="_blank"
              >
                <MessageCircle className="size-4" />
                <span className="sr-only">WhatsApp Liberty Digital</span>
              </Link>
            ) : null}
            <ButtonLink
              aria-label="Book Support"
              className="inline-flex size-11 min-h-11 items-center justify-center rounded-full px-0 shadow-[0_14px_28px_rgba(8,12,18,0.24)]"
              href="/contact"
            >
              <ArrowUpRight className="size-4" />
            </ButtonLink>
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
