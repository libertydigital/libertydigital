import { AnimatedList } from "@/components/animations/animated-list";
import { ServiceCard } from "@/components/services/service-card";
import type { ServiceContent } from "@/lib/services";

export function ServiceGrid({ services }: { services: ServiceContent[] }) {
  return (
    <AnimatedList className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {services.map((service) => (
        <ServiceCard key={service.slug} service={service} />
      ))}
    </AnimatedList>
  );
}
