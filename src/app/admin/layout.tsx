import type { ReactNode } from "react";

import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { requireAdminUser } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireAdminUser();

  return (
    <div className="site-stage min-h-screen">
      <Header />
      <main className="relative z-10">
        <div className="container-shell py-10">
          <div className="relative overflow-hidden rounded-[40px] border border-white/8 bg-[linear-gradient(180deg,rgba(8,11,15,0.94),rgba(10,14,19,0.9))] p-4 shadow-[0_30px_80px_rgba(4,10,18,0.22)] sm:p-6">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-70">
              <div className="absolute left-[8%] top-0 h-40 w-40 rounded-full bg-[rgba(234,217,188,0.06)] blur-3xl" />
              <div className="absolute right-[10%] top-10 h-48 w-48 rounded-full bg-[rgba(109,132,153,0.06)] blur-3xl" />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.016)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:140px_140px] opacity-15" />
            </div>
            <div className="relative">
              <AdminHeader user={user} />
              <div className="mt-8 grid gap-6 2xl:grid-cols-[285px_1fr]">
                <AdminSidebar />
                <div>{children}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
