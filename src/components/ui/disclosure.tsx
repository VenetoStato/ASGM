import type { ReactNode } from "react";

type Props = {
  /** Per ancore tipo /#chi-siamo: mettere sull’elemento visibile (summary). */
  id?: string;
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
};

/**
 * Sezione comprimibile (HTML &lt;details&gt;) senza JavaScript: compatto in home.
 */
export function CompactDisclosure({
  id,
  title,
  subtitle,
  defaultOpen = false,
  children,
  className = "",
}: Props) {
  return (
    <details
      className={`group rounded-xl border border-stone-200/90 bg-white shadow-[var(--shadow-card)] ring-1 ring-stone-900/[0.03] ${className}`}
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-start justify-between gap-3 px-3 py-2.5 text-left sm:px-4 sm:py-3 [&::-webkit-details-marker]:hidden">
        <span className="min-w-0" id={id}>
          <span className="block text-base font-semibold text-emerald-950 sm:text-lg">
            {title}
          </span>
          {subtitle ? (
            <span className="mt-0.5 block text-xs leading-snug text-stone-500 sm:text-sm">
              {subtitle}
            </span>
          ) : null}
        </span>
        <span
          className="mt-0.5 shrink-0 text-sm text-stone-400 transition-transform duration-200 group-open:rotate-180"
          aria-hidden
        >
          ▼
        </span>
      </summary>
      <div className="border-t border-stone-100 px-3 py-3 sm:px-4 sm:py-4">
        {children}
      </div>
    </details>
  );
}
