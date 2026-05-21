"use server";

import { revalidatePath } from "next/cache";

import { requireAdminUser } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import {
  adminNoteSchema,
  followUpDateSchema,
  leadStatusUpdateSchema,
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
