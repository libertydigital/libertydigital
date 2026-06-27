import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PublicPageAnimations } from "@/components/animations/public-page-animations";
import { LoginForm } from "@/components/forms/login-form";
import { getOptionalAdminUser } from "@/lib/auth";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Admin Login",
  description: "Secure dashboard login for Liberty Digital Consulting administrators.",
  path: "/login",
  noIndex: true,
});

export default async function LoginPage() {
  const user = await getOptionalAdminUser();

  if (user) {
    redirect("/admin");
  }

  return (
    <PublicPageAnimations>
      <div className="container-shell flex min-h-screen items-center justify-center py-16" data-animate-section>
        <LoginForm />
      </div>
    </PublicPageAnimations>
  );
}
