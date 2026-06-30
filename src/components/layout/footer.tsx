import Image from "next/image";
import Link from "next/link";

import { BUSINESS_DETAILS, SERVICES } from "@/lib/services";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/8 bg-[rgba(7,10,14,0.96)]" data-animate-footer>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute left-[10%] top-0 h-36 w-36 rounded-full bg-[rgba(234,217,188,0.06)] blur-3xl" />
        <div className="absolute right-[8%] top-10 h-44 w-44 rounded-full bg-[rgba(109,132,153,0.06)] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:140px_140px] opacity-15" />
      </div>
      <div className="container-shell relative py-14">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr_1fr]" data-animate-list>
          <div className="space-y-6">
            <p className="font-serif text-[1.9rem] font-semibold leading-[1.02] text-white sm:text-[2.15rem]">
              Liberty Digital Consulting Services
            </p>
            <p className="max-w-lg text-sm leading-8 text-white/64">
              Professional document preparation and digital consulting support for Nigerians and African diaspora residents in Italy.
            </p>
            <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] px-5 py-5 backdrop-blur-sm" data-animate-card>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-gold-soft)]">
                  Office
                </p>
                <p className="mt-3 max-w-[18rem] text-sm leading-7 text-white/72">
                  {BUSINESS_DETAILS.address}
                </p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] px-5 py-5 backdrop-blur-sm" data-animate-card>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-gold-soft)]">
                  Contact
                </p>
                <div className="mt-3 space-y-2 text-sm leading-7 text-white/72">
                  <a className="block break-all hover:text-white" href={`mailto:${BUSINESS_DETAILS.email}`}>
                    {BUSINESS_DETAILS.email}
                  </a>
                  <a className="block hover:text-white" href={`tel:${BUSINESS_DETAILS.phone}`}>
                    {BUSINESS_DETAILS.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div data-animate-card>
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[var(--color-gold)]">
              Services
            </p>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-white/64">
              {SERVICES.slice(0, 8).map((service) => (
                <li key={service.slug}>
                  <Link className="hover:text-white" href={`/services/${service.slug}`}>
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div data-animate-card>
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[var(--color-gold)]">
              Contact
            </p>
            <div className="mt-5 space-y-4 text-sm leading-7 text-white/64">
              <p>{BUSINESS_DETAILS.address}</p>
              <a className="block break-all hover:text-white" href={`mailto:${BUSINESS_DETAILS.email}`}>
                {BUSINESS_DETAILS.email}
              </a>
              <a className="block hover:text-white" href={`tel:${BUSINESS_DETAILS.phone}`}>
                {BUSINESS_DETAILS.phone}
              </a>
              <Link className="inline-flex items-center gap-2 text-white" href="/contact">
                Request support
                <span aria-hidden="true">-&gt;</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-white/8 pt-6 text-sm text-white/54">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p>(c) {new Date().getFullYear()} Liberty Digital Consulting Services. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-4">
              <Link className="hover:text-white" href="/about">
                About
              </Link>
              <Link className="hover:text-white" href="/services">
                Services
              </Link>
              <Link className="hover:text-white" href="/contact">
                Contact
              </Link>
              <Link className="hover:text-white" href="/resources">
                Resources
              </Link>
              <Link className="hover:text-white" href="/privacy-policy">
                Privacy
              </Link>
              <Link className="hover:text-white" href="/cookie-policy">
                Cookies
              </Link>
              <Link className="hover:text-white" href="/terms-of-service">
                Terms
              </Link>
              <Link className="hover:text-white" href="/disclaimer">
                Disclaimer
              </Link>
              <a
                className="inline-flex items-center gap-2 text-white hover:text-[var(--color-gold-soft)]"
                href="https://webgrowth.info"
                rel="noreferrer"
                target="_blank"
              >
                <Image
                  alt="Web Growth"
                  height={20}
                  src="/webgrowth-logo.ico"
                  width={20}
                />
                Built by Web Growth
              </a>
            </div>
          </div>
        </div>
        <p className="mt-7 border-t border-white/8 pt-6 text-xs leading-6 text-white/42">
          Liberty Digital Consulting provides document preparation and digital consulting support. We are not a government agency, embassy, consulate, NIMC, NIS, bank, or official issuing authority.
        </p>
      </div>
    </footer>
  );
}
