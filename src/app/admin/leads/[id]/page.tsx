import { notFound } from "next/navigation";

import { LeadDetailPanel } from "@/components/admin/lead-detail-panel";
import { getPrisma } from "@/lib/prisma";

type LeadDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;
  const prisma = getPrisma();

  const lead = await prisma.lead.findUnique({
    where: { id },
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
