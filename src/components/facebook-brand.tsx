import type { ReactNode } from "react";

/** Icona Facebook: quadrato blu con “f” bianca. */
export function FacebookIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
    >
      <rect width="24" height="24" rx="4" fill="#1877F2" />
      <path
        fill="#fff"
        d="M13.5 22v-7.6h2.5l.4-3h-2.9V9.3c0-.9.3-1.5 1.6-1.5h1.5V5.1c-.8-.1-1.6-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.3H7v3h2.5V22h4z"
      />
    </svg>
  );
}

const baseBtn =
  "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1877F2]";

type LinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "solid" | "outline";
};

export function FacebookPageLink({
  href,
  children,
  className = "",
  variant = "solid",
}: LinkProps) {
  const cls =
    variant === "solid"
      ? `${baseBtn} bg-[#1877F2] text-white hover:bg-[#166fe5] ${className}`
      : `${baseBtn} border-2 border-[#1877F2]/50 bg-white text-[#1877F2] hover:bg-blue-50 ${className}`;

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      <FacebookIcon className="h-6 w-6 shrink-0" />
      <span>{children}</span>
    </a>
  );
}
