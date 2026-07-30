import Link from "next/link";

import { cn } from "@/lib/utils";

const SOCIAL_LINKS = [
  {
    href: "https://www.facebook.com/share/19ZoxwBF2L/?mibextid=wwXIfr",
    label: "Facebook",
    icon: FacebookIcon,
  },
  {
    href: "https://www.instagram.com/libertydigitalconsultingsr?igsh=MTR0aHFqaXJoaXVhaA%3D%3D&utm_source=qr",
    label: "Instagram",
    icon: InstagramIcon,
  },
  {
    href: "https://www.tiktok.com/@libertydigitalconsulting?_r=1&_t=ZN-98R2NKFaXlW",
    label: "TikTok",
    icon: TikTokIcon,
  },
] as const;

export function SocialLinks({
  className,
  linkClassName,
  iconClassName,
}: {
  className?: string;
  linkClassName?: string;
  iconClassName?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
        <Link
          aria-label={label}
          className={cn(
            "inline-flex size-11 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white transition hover:border-[rgba(234,217,188,0.32)] hover:bg-white/12 hover:text-[var(--color-gold-soft)]",
            linkClassName,
          )}
          href={href}
          key={label}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icon className={cn("size-4", iconClassName)} />
          <span className="sr-only">{label}</span>
        </Link>
      ))}
    </div>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M13.5 21v-8.1h2.7l.4-3.15h-3.1V7.74c0-.91.25-1.53 1.56-1.53H16.7V3.39c-.3-.04-1.3-.12-2.46-.12-2.44 0-4.11 1.49-4.11 4.23v2.24H7.36v3.15h2.77V21h3.37Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <rect height="16" rx="4.5" width="16" x="4" y="4" />
      <circle cx="12" cy="12" r="3.65" />
      <circle cx="17.2" cy="6.8" fill="currentColor" r="0.7" stroke="none" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M14.82 3c.25 2.01 1.38 3.76 3.18 4.74.83.45 1.72.71 2.5.77v2.93a8.75 8.75 0 0 1-3.25-.8v5.27c0 3.28-2.5 5.78-5.87 5.78S5.5 19.04 5.5 15.8c0-3.07 2.33-5.49 5.37-5.78v3.03a2.7 2.7 0 0 0-2.3 2.72c0 1.52 1.14 2.72 2.73 2.72 1.53 0 2.64-1.13 2.64-2.72V3h2.88Z" />
    </svg>
  );
}
