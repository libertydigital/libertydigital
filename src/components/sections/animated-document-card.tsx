import Image from "next/image";

type AnimatedDocumentCardProps = {
  title: string;
  subtitle: string;
  badge: string;
  imageSrc?: string;
};

export function AnimatedDocumentCard({
  title,
  subtitle,
  badge,
  imageSrc,
}: AnimatedDocumentCardProps) {
  return (
    <div className="flex h-[292px] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,22,31,0.94),rgba(11,17,25,0.92))] text-white shadow-[0_24px_60px_rgba(4,10,18,0.22)] backdrop-blur-xl sm:h-[300px]">
      <div className="relative h-[190px] border-b border-white/10">
        {imageSrc ? (
          <Image
            alt={title}
            className="h-full w-full object-cover object-center"
            fill
            sizes="(min-width: 640px) 280px, 100vw"
            src={imageSrc}
          />
        ) : (
          <div className="h-full w-full border border-dashed border-white/12 bg-white/4" />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,14,0.18)_0%,rgba(7,10,14,0.3)_42%,rgba(7,10,14,0.62)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-20 bg-[linear-gradient(180deg,rgba(7,10,14,0.58),transparent)]" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-5">
          <div className="min-h-[5.35rem] max-w-[10.5rem]">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold-soft)]">
              {badge}
            </p>
            <p className="mt-2 text-[1.52rem] font-semibold leading-[1.02] text-white">
              {title}
            </p>
          </div>
          <div className="size-10 rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(234,217,188,0.78),rgba(255,255,255,0.26))] backdrop-blur-sm" />
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between p-5">
        <div className="space-y-3">
          <div className="h-2 rounded-full bg-white/18" />
          <div className="h-2 w-4/5 rounded-full bg-white/12" />
        </div>
        <p className="min-h-[3.5rem] max-w-[18rem] text-sm leading-6 text-white/76">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
