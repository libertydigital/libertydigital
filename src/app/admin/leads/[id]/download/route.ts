import { NextResponse } from "next/server";

import { requireAdminUser } from "@/lib/auth";
import { buildLeadDownloadDocument } from "@/lib/lead-export";
import { getPrisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  await requireAdminUser();

  const { id } = await context.params;
  const prisma = getPrisma();

  const lead = await prisma.lead.findUnique({
    where: { id },
  });

  if (!lead) {
    return new NextResponse("Lead not found.", { status: 404 });
  }

  const { bytes, filename } = await buildLeadDownloadDocument(lead);

  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
