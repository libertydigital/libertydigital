import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

type SupabaseAuthCompat = {
  getUser: () => Promise<{ data: { user: unknown | null } }>;
};

export async function updateSupabaseSession(request: NextRequest) {
  const response = NextResponse.next({
    request,
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return response;
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const auth = supabase.auth as unknown as SupabaseAuthCompat;
  await auth.getUser();

  return response;
}
