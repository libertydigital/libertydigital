import { NextResponse } from "next/server";

import { requireAdminUser } from "@/lib/auth";
import { buildLeadDownloadContent, buildLeadDownloadFilename } from "@/lib/lead-export";
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

  const content = buildLeadDownloadContent(lead);
  const filename = buildLeadDownloadFilename(lead);

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
