import { redirect } from "next/navigation";

import { getSupabaseServerClient } from "@/lib/supabase/server";

type SupabaseAuthCompat = {
  getUser: () => Promise<{ data: { user: unknown | null } }>;
};

type AdminUser = {
  id?: string;
  email?: string | null;
};

export async function getOptionalAdminUser() {
  const supabase = await getSupabaseServerClient();
  const auth = supabase.auth as unknown as SupabaseAuthCompat;
  const {
    data: { user },
  } = await auth.getUser();

  return (user as AdminUser | null) ?? null;
}

export async function requireAdminUser() {
  const user = await getOptionalAdminUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
