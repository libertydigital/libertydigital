"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentPropsWithoutRef, MouseEvent } from "react";

type HomeScrollLinkProps = ComponentPropsWithoutRef<typeof Link>;

export function HomeScrollLink({
  href,
  onClick,
  scroll,
  ...props
}: HomeScrollLinkProps) {
  const pathname = usePathname();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    if (href === "/" && pathname === "/") {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return <Link {...props} href={href} onClick={handleClick} scroll={scroll ?? true} />;
}
