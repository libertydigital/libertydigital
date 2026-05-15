import { Button } from "@/components/ui/button";
import { LEAD_STATUS_OPTIONS, SERVICES } from "@/lib/services";

export function LeadFilters({
  search,
  service,
  status,
}: {
  search?: string;
  service?: string;
  status?: string;
}) {
  return (
    <form className="grid gap-4 rounded-[30px] border border-[var(--color-line)] bg-[var(--color-paper)] p-5 shadow-[0_18px_40px_rgba(17,32,49,0.06)] lg:grid-cols-[1.4fr_1fr_1fr_auto]">
      <input
        className="rounded-[18px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm text-[var(--color-navy)] placeholder:text-[var(--color-navy-soft)]"
        defaultValue={search}
        name="search"
        placeholder="Search name, email, phone, WhatsApp"
      />
      <select
        className="rounded-[18px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm text-[var(--color-navy)]"
        defaultValue={service}
        name="service"
      >
        <option value="">All services</option>
        {SERVICES.map((item) => (
          <option key={item.slug} value={item.slug}>
            {item.title}
          </option>
        ))}
      </select>
      <select
        className="rounded-[18px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm text-[var(--color-navy)]"
        defaultValue={status}
        name="status"
      >
        <option value="">All statuses</option>
        {LEAD_STATUS_OPTIONS.map((value) => (
          <option key={value} value={value}>
            {value.replaceAll("_", " ")}
          </option>
        ))}
      </select>
      <Button type="submit" variant="secondary">
        Filter leads
      </Button>
    </form>
  );
}
