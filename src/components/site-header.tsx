import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/#in-evidenza", label: "Evidenza" },
  { href: "/#chi-siamo", label: "Chi siamo" },
  { href: "/#schede", label: "Schede" },
  { href: "/#facebook", label: "Facebook" },
  { href: "/#annunci", label: "Annunci" },
  { href: "/eventi", label: "Eventi" },
  { href: "/funghi", label: "Funghi" },
  { href: "/news", label: "News" },
  { href: "/admin/login", label: "Organizzatori" },
] as const;

type Props = {
  logoUrl?: string | null;
};

export function SiteHeader({ logoUrl }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-emerald-950/25 bg-[#052e16] text-emerald-50 shadow-lg shadow-emerald-950/30 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:py-3.5">
        <Link
          href="/"
          className="group flex min-w-0 shrink-0 items-center gap-3"
        >
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt=""
              width={44}
              height={44}
              className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-white/25"
            />
          ) : (
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-800/80 text-sm font-bold tracking-tight text-amber-100 ring-2 ring-white/20"
              aria-hidden
            >
              GMC
            </div>
          )}
          <div className="min-w-0 flex flex-col gap-0">
            <span className="line-clamp-2 text-left text-[13px] font-bold leading-tight tracking-tight text-white sm:text-sm">
              Gruppo micologico culturale
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-emerald-300/90 sm:text-[11px]">
              Sandonatese · San Donà
            </span>
          </div>
        </Link>
        <nav
          className="-mx-1 flex min-w-0 flex-1 justify-end gap-0.5 overflow-x-auto pb-0.5 sm:flex-wrap sm:justify-end sm:overflow-visible sm:pb-0"
          aria-label="Navigazione principale"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="shrink-0 rounded-full px-2 py-2 text-[10px] font-medium text-emerald-100/95 transition-colors hover:bg-white/10 hover:text-white active:bg-white/15 sm:px-2.5 sm:text-xs"
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
