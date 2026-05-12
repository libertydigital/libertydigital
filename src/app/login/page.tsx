import { redirect } from "next/navigation";

import { LoginForm } from "@/components/forms/login-form";
import { getOptionalAdminUser } from "@/lib/auth";

export default async function LoginPage() {
  const user = await getOptionalAdminUser();

  if (user) {
    redirect("/admin");
  }

  return (
    <div className="container-shell flex min-h-screen items-center justify-center py-16">
      <LoginForm />
    </div>
  );
}
