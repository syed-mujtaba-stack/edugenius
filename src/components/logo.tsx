import { cn } from "@/lib/utils";
import * as React from "react";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-6 w-6", className)}
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v1.2a1 1 0 0 0 1 1h.3a1 1 0 0 0 .8-1.6L12.5 3" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v1.2a1 1 0 0 1-1 1h-.3a1 1 0 0 1-.8-1.6L11.5 3" />
      <path d="M12 10.42V14" />
      <path d="M15 9.5a2.5 2.5 0 1 1 0 5" />
      <path d="M9 9.5a2.5 2.5 0 1 0 0 5" />
      <path d="M17.5 12a5.5 5.5 0 1 0-11 0" />
      <path d="M17.5 12a5.5 5.5 0 1 1-11 0" />
      <path d="M12 22a8 8 0 0 0 8-8" />
      <path d="M12 22a8 8 0 0 1-8-8" />
    </svg>
  );
}
