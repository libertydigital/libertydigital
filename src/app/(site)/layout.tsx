import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { WhatsAppFloatingButton } from "@/components/layout/whatsapp-floating-button";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="site-stage min-h-screen">
      <Header />
      <main className="relative z-10">{children}</main>
      <WhatsAppFloatingButton />
      <Footer />
    </div>
  );
}
