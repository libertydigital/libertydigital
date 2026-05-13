import type { ReactNode } from "react";

import { PublicPageAnimations } from "@/components/animations/public-page-animations";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="site-stage min-h-screen">
      <PublicPageAnimations>
        <Header />
        <main className="relative z-10">{children}</main>
        <Footer />
      </PublicPageAnimations>
    </div>
  );
}
