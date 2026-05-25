import "server-only";

import { createClient } from "@supabase/supabase-js";

type SupabaseAdminUser = {
  id: string;
  email?: string | null;
  created_at?: string | null;
  last_sign_in_at?: string | null;
  user_metadata?: Record<string, unknown> | null;
  app_metadata?: Record<string, unknown> | null;
};

type SupabaseAdminCompat = {
  createUser: (attributes: {
    email: string;
    password: string;
    email_confirm?: boolean;
    user_metadata?: Record<string, unknown>;
  }) => Promise<{ error: { message?: string } | null }>;
  deleteUser: (
    id: string,
    shouldSoftDelete?: boolean,
  ) => Promise<{ error: { message?: string } | null }>;
  listUsers: () => Promise<{
    data: { users: SupabaseAdminUser[] };
    error: { message?: string } | null;
  }>;
};

export function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase admin environment variables are missing.");
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function getSupabaseAdminAuth() {
  const client = getSupabaseAdminClient();
  return (client.auth as unknown as { admin: SupabaseAdminCompat }).admin;
}

export type { SupabaseAdminUser };
