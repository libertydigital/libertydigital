"use server";

import { revalidatePath } from "next/cache";

import { hasAdminEmailAllowlist, isAllowedAdminEmail, requireAdminUser } from "@/lib/auth";
import { getSupabaseAdminAuth } from "@/lib/supabase/admin";
import { adminAccountCreateSchema } from "@/lib/validations";

type AdminAccountActionState =
  | { success: true; message: string }
  | { success: false; message: string };

export async function createAdminAccountAction(
  _prevState: AdminAccountActionState | undefined,
  formData: FormData,
): Promise<AdminAccountActionState> {
  await requireAdminUser();

  const parsed = adminAccountCreateSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Unable to create admin account.",
    };
  }

  if (hasAdminEmailAllowlist() && !isAllowedAdminEmail(parsed.data.email)) {
    return {
      success: false,
      message: "This email is not approved for admin access.",
    };
  }

  const supabaseAdmin = getSupabaseAdminAuth();
  try {
    const { error } = await supabaseAdmin.createUser({
      email: parsed.data.email,
      password: parsed.data.password,
      email_confirm: true,
      user_metadata: {
        admin_access: true,
      },
    });

    if (error) {
      return {
        success: false,
        message: "Unable to create admin account right now.",
      };
    }
  } catch {
    return {
      success: false,
      message: "Unable to create admin account right now.",
    };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/accounts");

  return {
    success: true,
    message: "Admin account created successfully.",
  };
}
