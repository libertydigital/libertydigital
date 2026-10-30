import type { ServiceContent } from "@/lib/services";

/**
 * Display prices from the maintained catalogue only.
 * A zero price means that a case-specific quote is required, not that a service is free.
 * Official authority fees and expenses are separate.
 */
export function getServicePricing(service: Pick<ServiceContent, "price">) {
  if (Number.isFinite(service.price) && service.price > 0) {
    return {
      label: `Indicative support fee: €${service.price.toLocaleString("en-IE")}`,
      shortLabel: `From €${service.price.toLocaleString("en-IE")}`,
      detail:
        "This is the published Liberty support fee, not an official government or bank charge. We confirm the final quote and any separate official fees before work begins.",
    };
  }
  return {
    label: "Fee confirmed after enquiry",
    shortLabel: "Request a quote",
    detail:
      "Tell us what documents and support you need. We will confirm Liberty's fee and any separate official charges before you proceed.",
  };
}
