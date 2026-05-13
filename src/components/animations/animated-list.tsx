import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function AnimatedList({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(className)} data-animate-list>
      {children}
    </div>
  );
}
