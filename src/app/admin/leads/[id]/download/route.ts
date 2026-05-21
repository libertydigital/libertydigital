import { NextResponse } from "next/server";

import { requireAdminUser } from "@/lib/auth";
import { buildLeadDownloadDocument } from "@/lib/lead-export";
import { getPrisma } from "@/lib/prisma";
import { leadIdSchema } from "@/lib/validations";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  await requireAdminUser();

  const { id } = await context.params;
  const parsedLeadId = leadIdSchema.safeParse(id);

  if (!parsedLeadId.success) {
    return new NextResponse("Lead not found.", { status: 404 });
  }

  const prisma = getPrisma();

  try {
    const lead = await prisma.lead.findUnique({
      where: { id: parsedLeadId.data },
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
  } catch {
    return new NextResponse("Unable to generate this export right now.", {
      status: 500,
    });
  }
}
