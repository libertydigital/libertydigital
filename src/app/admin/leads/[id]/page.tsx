import { notFound } from "next/navigation";

import { LeadDetailPanel } from "@/components/admin/lead-detail-panel";
import { requireAdminUser } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { leadIdSchema } from "@/lib/validations";

type LeadDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  await requireAdminUser();

  const { id } = await params;
  const parsedLeadId = leadIdSchema.safeParse(id);

  if (!parsedLeadId.success) {
    notFound();
  }

  const prisma = getPrisma();

  const lead = await prisma.lead.findUnique({
    where: { id: parsedLeadId.data },
    include: {
      notes: { orderBy: { createdAt: "desc" } },
      activities: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!lead) {
    notFound();
  }

  return <LeadDetailPanel lead={lead} />;
}
