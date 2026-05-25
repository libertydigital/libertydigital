import { LeadStatus } from "@prisma/client";

import { LeadFilters } from "@/components/admin/lead-filters";
import { LeadTable } from "@/components/admin/lead-table";
import { requireAdminUser } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

type LeadsPageProps = {
  searchParams: Promise<{
    archived?: string;
    search?: string;
    service?: string;
    status?: string;
  }>;
};

export default async function AdminLeadsPage({ searchParams }: LeadsPageProps) {
  await requireAdminUser();

  const { search = "", service = "", status = "", archived = "0" } = await searchParams;
  const showArchived = archived === "1";
  const prisma = getPrisma();

  const leads = await prisma.lead.findMany({
    where: {
      deletedAt: showArchived ? { not: null } : null,
      ...(service ? { serviceSlug: service } : {}),
      ...(status && Object.values(LeadStatus).includes(status as LeadStatus)
        ? { status: status as LeadStatus }
        : {}),
      ...(search
        ? {
            OR: [
              { fullName: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
              { phone: { contains: search, mode: "insensitive" } },
              { whatsapp: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <section className="rounded-[34px] border border-[var(--color-line)] bg-[var(--color-paper)] p-6 shadow-[0_22px_52px_rgba(17,32,49,0.08)]">
        <p className="section-kicker">Lead management</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-[var(--color-navy)]">
          {showArchived
            ? "Review and restore archived service requests"
            : "Review, filter, and open every service request"}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-navy-soft)]">
          {showArchived
            ? "Archived leads stay out of the active pipeline until you restore them for reference or follow-up."
            : "Search by contact detail, narrow by service or status, and move straight into the lead record that needs action."}
        </p>
      </section>
      <LeadFilters archived={archived} search={search} service={service} status={status} />
      <LeadTable leads={leads} />
    </div>
  );
}
