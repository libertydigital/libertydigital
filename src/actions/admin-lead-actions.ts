"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";

import { requireAdminUser } from "@/lib/auth";
import { LEAD_PAID_REVENUE_KEY, parseEurToCents } from "@/lib/lead-revenue";
import { getPrisma } from "@/lib/prisma";
import {
  adminNoteSchema,
  followUpDateSchema,
  leadIdSchema,
  leadStatusUpdateSchema,
  publicTrackingUpdateSchema,
} from "@/lib/validations";

type AdminActionState =
  | { success: true; message: string }
  | { success: false; message: string };

function revalidateLeadViews(leadId: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function updateLeadStatusAction(
  _prevState: AdminActionState | undefined,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdminUser();

  const parsed = leadStatusUpdateSchema.safeParse({
    leadId: formData.get("leadId"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { success: false, message: "Unable to update lead status." };
  }

  const prisma = getPrisma();
  try {
    await prisma.lead.update({
      where: { id: parsed.data.leadId },
      data: {
        status: parsed.data.status,
        activities: {
          create: {
            type: "STATUS_UPDATED",
            description: `Lead status changed to ${parsed.data.status.replaceAll("_", " ")}.`,
          },
        },
      },
    });
  } catch {
    return { success: false, message: "Unable to update lead status." };
  }

  revalidateLeadViews(parsed.data.leadId);

  return { success: true, message: "Lead status updated." };
}

export async function quickUpdateLeadStatusAction(
  leadId: string,
  status: string,
): Promise<AdminActionState> {
  await requireAdminUser();

  const parsed = leadStatusUpdateSchema.safeParse({
    leadId,
    status,
  });

  if (!parsed.success) {
    return { success: false, message: "Unable to update lead status." };
  }

  const prisma = getPrisma();
  try {
    await prisma.lead.update({
      where: { id: parsed.data.leadId },
      data: {
        status: parsed.data.status,
        activities: {
          create: {
            type: "STATUS_UPDATED",
            description: `Lead status changed to ${parsed.data.status.replaceAll("_", " ")}.`,
          },
        },
      },
    });
  } catch {
    return { success: false, message: "Unable to update lead status." };
  }

  revalidateLeadViews(parsed.data.leadId);

  return { success: true, message: "Lead status updated." };
}

export async function addLeadNoteAction(
  _prevState: AdminActionState | undefined,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdminUser();

  const parsed = adminNoteSchema.safeParse({
    leadId: formData.get("leadId"),
    note: formData.get("note"),
  });

  if (!parsed.success) {
    return { success: false, message: "Unable to save note." };
  }

  const prisma = getPrisma();
  try {
    await prisma.lead.update({
      where: { id: parsed.data.leadId },
      data: {
        notes: {
          create: {
            note: parsed.data.note,
          },
        },
        activities: {
          create: {
            type: "NOTE_ADDED",
            description: "Internal note added.",
          },
        },
      },
    });
  } catch {
    return { success: false, message: "Unable to save note." };
  }

  revalidateLeadViews(parsed.data.leadId);

  return { success: true, message: "Note added." };
}

export async function setFollowUpDateAction(
  _prevState: AdminActionState | undefined,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdminUser();

  const parsed = followUpDateSchema.safeParse({
    leadId: formData.get("leadId"),
    followUpDate: formData.get("followUpDate"),
  });

  if (!parsed.success) {
    return { success: false, message: "Unable to save follow-up date." };
  }

  const prisma = getPrisma();
  try {
    await prisma.lead.update({
      where: { id: parsed.data.leadId },
      data: {
        followUpDate: new Date(`${parsed.data.followUpDate}T00:00:00.000Z`),
        activities: {
          create: {
            type: "FOLLOW_UP_SET",
            description: `Follow-up date set for ${parsed.data.followUpDate}.`,
          },
        },
      },
    });
  } catch {
    return { success: false, message: "Unable to save follow-up date." };
  }

  revalidateLeadViews(parsed.data.leadId);

  return { success: true, message: "Follow-up date saved." };
}

export async function deleteLeadAction(leadId: string): Promise<AdminActionState> {
  await requireAdminUser();

  const parsed = leadIdSchema.safeParse(leadId);

  if (!parsed.success) {
    return { success: false, message: "Unable to delete lead." };
  }

  const prisma = getPrisma();

  try {
    await prisma.lead.update({
      where: { id: parsed.data },
      data: {
        deletedAt: new Date(),
        activities: {
          create: {
            type: "NOTE_ADDED",
            description: "Lead archived from the admin dashboard.",
          },
        },
      },
    });
  } catch {
    return { success: false, message: "Unable to archive lead." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${parsed.data}`);

  return { success: true, message: "Lead archived." };
}

export async function restoreLeadAction(leadId: string): Promise<AdminActionState> {
  await requireAdminUser();

  const parsed = leadIdSchema.safeParse(leadId);

  if (!parsed.success) {
    return { success: false, message: "Unable to restore lead." };
  }

  const prisma = getPrisma();

  try {
    await prisma.lead.update({
      where: { id: parsed.data },
      data: {
        deletedAt: null,
        activities: {
          create: {
            type: "NOTE_ADDED",
            description: "Lead restored to the active pipeline.",
          },
        },
      },
    });
  } catch {
    return { success: false, message: "Unable to restore lead." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${parsed.data}`);

  return { success: true, message: "Lead restored." };
}

export async function updatePublicTrackingAction(
  _prevState: AdminActionState | undefined,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdminUser();

  const parsed = publicTrackingUpdateSchema.safeParse({
    leadId: formData.get("leadId"),
    trackingCategory: formData.get("trackingCategory"),
    trackingOption: formData.get("trackingOption"),
    publicTrackingStatus: formData.get("publicTrackingStatus"),
    publicTrackingNote: formData.get("publicTrackingNote"),
  });

  if (!parsed.success) {
    return { success: false, message: "Unable to update public tracking." };
  }

  const prisma = getPrisma();

  try {
    await prisma.lead.update({
      where: { id: parsed.data.leadId },
      data: {
        trackingCategory: parsed.data.trackingCategory,
        trackingOption: parsed.data.trackingOption,
        publicTrackingStatus: parsed.data.publicTrackingStatus,
        publicTrackingNote: parsed.data.publicTrackingNote,
        trackingLastUpdatedAt: new Date(),
        activities: {
          create: {
            type: "STATUS_UPDATED",
            description: "Public tracking details updated for customer lookup.",
          },
        },
      },
    });
  } catch {
    return { success: false, message: "Unable to update public tracking." };
  }

  revalidateLeadViews(parsed.data.leadId);
  revalidatePath("/track-request");

  return { success: true, message: "Public tracking updated." };
}


/** Store confirmed Liberty payments on the existing protected lead JSON record.
 * No database migration or payment collection is introduced.
 */
export async function updateLeadPaidRevenueAction(
  _prevState: AdminActionState | undefined,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdminUser();

  const parsedId = leadIdSchema.safeParse(formData.get("leadId"));
  const amountRaw = formData.get("paidAmount");
  if (!parsedId.success || typeof amountRaw !== "string") {
    return { success: false, message: "Choose a valid lead and amount." };
  }

  const cents = amountRaw.trim() === "" ? null : parseEurToCents(amountRaw);
  if (amountRaw.trim() !== "" && cents === null) {
    return { success: false, message: "Enter a positive euro amount with at most two decimals." };
  }

  const prisma = getPrisma();
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: parsedId.data },
      select: { formData: true, deletedAt: true },
    });
    if (!lead || lead.deletedAt) {
      return { success: false, message: "The lead is not available for editing." };
    }

    const data: Record<string, unknown> =
      lead.formData && typeof lead.formData === "object" && !Array.isArray(lead.formData)
        ? { ...(lead.formData as Record<string, unknown>) }
        : {};
    if (cents === null) {
      delete data[LEAD_PAID_REVENUE_KEY];
    } else {
      data[LEAD_PAID_REVENUE_KEY] = cents;
    }

    await prisma.lead.update({
      where: { id: parsedId.data },
      data: {
        formData: data as Prisma.InputJsonObject,
        activities: {
          create: {
            type: "NOTE_ADDED",
            description: cents === null
              ? "Internal paid revenue cleared."
              : "Internal paid revenue updated in EUR.",
          },
        },
      },
    });
  } catch {
    return { success: false, message: "Unable to save the payment amount." };
  }
  revalidateLeadViews(parsedId.data);
  return { success: true, message: "Payment record saved." };
}
