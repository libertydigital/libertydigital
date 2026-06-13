export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07130f] px-6 text-white">
      <div className="text-center">
        <div className="mx-auto size-12 animate-pulse rounded-full border border-[#d9bd7c]/35 bg-[#d9bd7c]/10" />
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.24em] text-[#d9bd7c]">
          Preparing your page
        </p>
      </div>
    </main>
  );
}
