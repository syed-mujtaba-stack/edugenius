"use client";

export default function Loading() {
  return (
    <main className="flex-1 p-4 md:p-8">
      <div className="mb-6">
        <div className="h-8 w-48 rounded bg-muted animate-pulse" />
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <section className="xl:col-span-2 rounded-xl border bg-card/50 backdrop-blur-sm p-4">
          <div className="h-6 w-40 rounded bg-muted animate-pulse mb-4" />
          <div className="h-48 w-full rounded-lg bg-muted animate-pulse" />
        </section>

        <section className="rounded-xl border bg-card/50 backdrop-blur-sm p-4">
          <div className="h-6 w-40 rounded bg-muted animate-pulse mb-4" />
          <div className="h-48 w-full rounded-full bg-muted animate-pulse" />
        </section>

        {[...Array(6)].map((_, i) => (
          <section key={i} className="rounded-xl border bg-card/50 backdrop-blur-sm">
            <div className="h-40 w-full rounded-t-xl bg-muted animate-pulse" />
            <div className="p-4">
              <div className="h-5 w-3/4 rounded bg-muted animate-pulse mb-2" />
              <div className="h-4 w-full rounded bg-muted animate-pulse mb-2" />
              <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
            </div>
            <div className="p-4 pt-0 flex gap-2">
              <div className="h-8 w-24 rounded bg-muted animate-pulse" />
              <div className="h-8 w-20 rounded bg-muted animate-pulse" />
              <div className="h-8 w-28 rounded bg-muted animate-pulse" />
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
