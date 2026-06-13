import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center bg-[#07130f] px-4 py-20 text-white">
      <div className="container-shell text-center">
        <p className="section-kicker text-[#d9bd7c]">404 / page not found</p>
        <h1 className="mx-auto mt-6 max-w-4xl font-serif text-6xl font-semibold leading-[0.9] text-[#fff9ed] sm:text-8xl">This page is not in the document set.</h1>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/62">Return to the homepage or browse the support services available in Rome.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link className="rounded-full bg-[#d9bd7c] px-6 py-3 text-sm font-bold text-[#07130f]" href="/">Go home</Link>
          <Link className="rounded-full border border-white/15 px-6 py-3 text-sm font-bold text-white" href="/services">View services</Link>
        </div>
      </div>
    </main>
  );
}
