"use client";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-12">
      <div className="relative">
        <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-primary/20 via-purple-400/20 to-pink-400/20 blur-2xl animate-pulse" aria-hidden />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 shadow-lg shadow-primary/30 grid place-items-center">
            <span className="sr-only">EduGenius</span>
            <Image src="/app.png" alt="EduGenius" width={40} height={40} className="opacity-95" priority />
          </div>
          <h2 className="font-headline text-2xl md:text-3xl tracking-tight">Loading EduGenius…</h2>
          <p className="text-muted-foreground text-sm md:text-base">Personalizing your learning experience</p>
        </div>
      </div>

      <div className="mt-10 w-full max-w-5xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl border bg-card/50 backdrop-blur-sm p-4">
              <div className="h-32 w-full rounded-lg bg-muted animate-pulse" />
              <div className="mt-4 h-4 w-3/4 rounded bg-muted animate-pulse" />
              <div className="mt-2 h-4 w-1/2 rounded bg-muted animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 w-2/3 md:w-1/3 h-2 rounded-full overflow-hidden bg-muted" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-label="Loading">
        <div className="h-full w-1/3 bg-gradient-to-r from-primary to-purple-500 animate-[shimmer_1.8s_infinite]" />
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}
