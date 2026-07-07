import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PublicPageAnimations } from "@/components/animations/public-page-animations";
import { LoginForm } from "@/components/forms/login-form";
import { getOptionalAdminUser } from "@/lib/auth";
import { buildPageMetadata, createWebPageSchema } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Admin Login",
  description:
    "Secure administrator login for the Liberty Digital Consulting lead dashboard and internal request management area.",
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
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            createWebPageSchema({
              title: "Admin Login",
              description:
                "Secure administrator login for the Liberty Digital Consulting lead dashboard and internal request management area.",
              path: "/login",
            }),
          ),
        }}
        type="application/ld+json"
      />
      <div className="container-shell flex min-h-screen items-center justify-center py-16" data-animate-section>
        <LoginForm />
      </div>
    </PublicPageAnimations>
  );
}
