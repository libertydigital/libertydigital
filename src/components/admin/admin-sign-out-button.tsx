"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function AdminSignOutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await getSupabaseBrowserClient().auth.signOut();
          router.push("/login");
          router.refresh();
        });
      }}
      variant="secondary"
    >
      {isPending ? "Signing out..." : "Sign out"}
    </Button>
  );
}
