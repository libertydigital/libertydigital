import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ScrollReset } from "@/components/layout/scroll-reset";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="site-stage min-h-screen">
      <ScrollReset />
      <Header />
      <main className="relative z-10">{children}</main>
      <Footer />
    </div>
  );
}
