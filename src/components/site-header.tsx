import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/#chi-siamo", label: "Chi siamo" },
  { href: "/#schede", label: "Schede" },
  { href: "/#facebook", label: "Facebook" },
  { href: "/#annunci", label: "Annunci" },
  { href: "/#date", label: "Date" },
  { href: "/eventi", label: "Eventi" },
  { href: "/annunci", label: "Tutti" },
  { href: "/funghi", label: "Funghi" },
  { href: "/news", label: "News" },
  { href: "/admin/login", label: "Organizzatori" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-emerald-950/20 bg-emerald-950 text-emerald-50 shadow-md shadow-emerald-950/20 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:py-3.5">
        <Link href="/" className="group flex min-w-0 shrink-0 flex-col gap-0">
          <span className="line-clamp-2 text-left text-[13px] font-bold leading-tight tracking-tight text-emerald-50 sm:text-sm">
            G.M.C. Sandonatese
          </span>
          <span className="text-[10px] font-medium uppercase tracking-widest text-emerald-400/90 sm:text-[11px]">
            San Donà · micologia
          </span>
        </Link>
        <nav
          className="-mx-1 flex min-w-0 flex-1 justify-end gap-1 overflow-x-auto pb-0.5 sm:flex-wrap sm:justify-end sm:overflow-visible sm:pb-0"
          aria-label="Navigazione principale"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="shrink-0 rounded-full px-2.5 py-2 text-[11px] font-medium text-emerald-100/95 transition-colors hover:bg-white/10 hover:text-white active:bg-white/15 sm:px-3 sm:text-sm"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-white/10 px-4 py-2 text-center sm:hidden">
        <Link
          href="/admin/login"
          className="text-[11px] font-semibold text-emerald-200/95 underline decoration-emerald-500/40 underline-offset-2"
        >
          Accesso organizzatori
        </Link>
      </div>
    </header>
  );
}
