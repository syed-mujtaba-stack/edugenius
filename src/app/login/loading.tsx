"use client";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border bg-card/50 backdrop-blur-sm p-6">
        <div className="h-8 w-32 rounded bg-muted animate-pulse mb-6" />
        <div className="space-y-4">
          <div className="h-10 w-full rounded bg-muted animate-pulse" />
          <div className="h-10 w-full rounded bg-muted animate-pulse" />
          <div className="h-10 w-1/2 rounded bg-muted animate-pulse" />
        </div>
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <div className="h-4 w-20 rounded bg-muted animate-pulse" />
          <div className="h-4 w-12 rounded bg-muted animate-pulse" />
        </div>
      </div>
    </div>
  );
}
