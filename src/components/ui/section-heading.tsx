type SectionHeadingProps = {
  kicker: string;
  title: string;
  description: string;
  align?: "left" | "center";
  level?: 1 | 2;
};

export function SectionHeading({
  kicker,
  title,
  description,
  align = "left",
  level = 2,
}: SectionHeadingProps) {
  const HeadingTag = level === 1 ? "h1" : "h2";

  return (
    <div
      className={
        align === "center"
          ? "mx-auto max-w-3xl text-center"
          : "max-w-3xl"
      }
    >
      <p className="section-kicker" data-animate-text>{kicker}</p>
      <HeadingTag className="section-title mt-3 text-balance sm:mt-4" data-animate-text>
        {title}
      </HeadingTag>
      <p className="section-description mt-4 max-w-2xl sm:mt-5" data-animate-text>
        {description}
      </p>
    </div>
  );
}
