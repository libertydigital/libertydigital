type SectionHeadingProps = {
  kicker: string;
  title: string;
  description: string;
  align?: "left" | "center";
};

export function SectionHeading({
  kicker,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div
      className={
        align === "center"
          ? "mx-auto max-w-3xl text-center"
          : "max-w-3xl"
      }
    >
      <p className="section-kicker">{kicker}</p>
      <h2 className="section-title mt-4 text-balance">{title}</h2>
      <p className="section-description mt-5 max-w-2xl">
        {description}
      </p>
    </div>
  );
}
