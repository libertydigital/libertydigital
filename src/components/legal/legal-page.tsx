import Link from "next/link";

type Section = { title: string; paragraphs: string[] };

export function LegalPage({ title, intro, sections }: { title: string; intro: string; sections: Section[] }) {
  return (
    <section className="premium-light-section py-20 sm:py-28">
      <article className="container-shell max-w-4xl">
        <p className="section-kicker">Last updated June 13, 2026</p>
        <h1 className="mt-5 section-title">{title}</h1>
        <p className="mt-6 section-description">{intro}</p>
        <div className="mt-12 grid gap-8">
          {sections.map((section) => (
            <section className="surface-card rounded-[28px] p-6 sm:p-8" key={section.title}>
              <h2 className="font-serif text-3xl font-semibold text-[var(--color-navy)]">{section.title}</h2>
              <div className="mt-4 grid gap-4 text-sm leading-7 text-[var(--color-navy-soft)]">
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </section>
          ))}
        </div>
        <p className="mt-10 text-sm text-[var(--color-navy-soft)]">
          Questions? <Link className="font-semibold text-[var(--color-navy)] underline" href="/contact">Contact Liberty Digital Consulting.</Link>
        </p>
      </article>
    </section>
  );
}
