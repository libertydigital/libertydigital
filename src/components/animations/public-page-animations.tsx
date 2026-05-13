"use client";

import type { ReactNode } from "react";
import { useRef } from "react";

import { usePublicPageAnimations } from "@/hooks/use-public-page-animations";

export function PublicPageAnimations({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  usePublicPageAnimations(rootRef);

  return <div className="contents" ref={rootRef}>{children}</div>;
}
