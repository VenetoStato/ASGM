import type { ReactNode } from "react";

const bandClass = {
  default: "bg-transparent",
  muted: "bg-[var(--surface-muted)]",
  paper: "bg-[var(--surface-paper)]",
  accent: "bg-[var(--surface-accent)]",
} as const;

export type SectionBand = keyof typeof bandClass;

type SectionProps = {
  id?: string;
  band?: SectionBand;
  className?: string;
  children: ReactNode;
  narrow?: boolean;
};

export function Section({
  id,
  band = "default",
  className = "",
  children,
  narrow = false,
}: SectionProps) {
  const inner = narrow ? "max-w-2xl" : "max-w-3xl";
  return (
    <section
      id={id}
      className={`scroll-mt-24 border-stone-200/40 py-14 sm:scroll-mt-28 sm:py-16 ${bandClass[band]} ${className}`}
    >
      <div className={`mx-auto w-full px-4 ${inner}`}>{children}</div>
    </section>
  );
}

type SectionHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  compact?: boolean;
};

export function SectionHeader({
  title,
  description,
  action,
  compact,
}: SectionHeaderProps) {
  return (
    <div
      className={`flex flex-wrap items-end justify-between gap-4 border-b border-stone-300/80 ${compact ? "pb-3" : "pb-4"}`}
    >
      <div className="min-w-0 flex-1">
        <h2
          className={`font-semibold tracking-tight text-[var(--heading)] ${compact ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"}`}
        >
          {title}
        </h2>
        {description && (
          <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-stone-600 sm:text-[15px]">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

type ContentCardProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "article";
  hover?: boolean;
};

export function ContentCard({
  children,
  className = "",
  as: Tag = "div",
  hover = true,
}: ContentCardProps) {
  return (
    <Tag
      className={`rounded-2xl border border-stone-200/90 bg-white p-5 shadow-[var(--shadow-card)] ring-1 ring-stone-900/[0.03] sm:p-6 ${hover ? "transition hover:border-emerald-800/20 hover:shadow-md" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}

type ProseProps = {
  children: ReactNode;
  className?: string;
};

export function Prose({ children, className = "" }: ProseProps) {
  return (
    <div
      className={`max-w-prose whitespace-pre-wrap text-[15px] leading-relaxed text-stone-700 sm:text-base ${className}`}
    >
      {children}
    </div>
  );
}

type EmptyStateProps = {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
};

export function EmptyState({ title, children, action }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50/90 px-5 py-10 text-center sm:px-8">
      <p className="text-base font-medium text-stone-800">{title}</p>
      {children && (
        <div className="mt-2 text-sm leading-relaxed text-stone-600">
          {children}
        </div>
      )}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
