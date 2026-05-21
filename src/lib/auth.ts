import "server-only";

import { redirect } from "next/navigation";

import { getSupabaseServerClient } from "@/lib/supabase/server";

type SupabaseAuthCompat = {
  getUser: () => Promise<{ data: { user: unknown | null } }>;
};

type SupabaseUserMetadata = {
  admin_access?: unknown;
};

type AdminUser = {
  id: string;
  email?: string | null;
  user_metadata?: SupabaseUserMetadata | null;
  app_metadata?: SupabaseUserMetadata | null;
};

const ADMIN_ALLOWED_EMAILS = new Set(
  (process.env.ADMIN_ALLOWED_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
);

export function hasAdminEmailAllowlist() {
  return ADMIN_ALLOWED_EMAILS.size > 0;
}

export function isAllowedAdminEmail(email: string | null | undefined) {
  if (!email) {
    return false;
  }

  return ADMIN_ALLOWED_EMAILS.has(email.trim().toLowerCase());
}

export function isAdminUserRecord(user: AdminUser | null | undefined) {
  if (!user?.id) {
    return false;
  }

  if (hasAdminEmailAllowlist()) {
    return isAllowedAdminEmail(user.email);
  }

  return (
    user.user_metadata?.admin_access === true ||
    user.app_metadata?.admin_access === true ||
    Boolean(user.email)
  );
}

export async function getOptionalAdminUser() {
  const supabase = await getSupabaseServerClient();
  const auth = supabase.auth as unknown as SupabaseAuthCompat;
  const {
    data: { user },
  } = await auth.getUser();
  const typedUser = (user as AdminUser | null) ?? null;

  return isAdminUserRecord(typedUser) ? typedUser : null;
}

export async function requireAdminUser() {
  const user = await getOptionalAdminUser();

  if (!user) {
    redirect("/login");
  }

  return {
    id: user.id,
    email: user.email ?? null,
  };
}
