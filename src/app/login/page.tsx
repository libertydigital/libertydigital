import { redirect } from "next/navigation";

import { PublicPageAnimations } from "@/components/animations/public-page-animations";
import { LoginForm } from "@/components/forms/login-form";
import { getOptionalAdminUser } from "@/lib/auth";

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
