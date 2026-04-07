"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";

const PAGE_LINKS = [
  { href: "/", label: "Home" },
  { href: "/eventi", label: "Eventi" },
  { href: "/funghi", label: "Funghi" },
  { href: "/annunci", label: "Annunci" },
  { href: "/news", label: "News" },
] as const;

const HOME_SECTION_LINKS = [
  { href: "/#in-evidenza", label: "In evidenza" },
  { href: "/#chi-siamo", label: "Chi siamo" },
  { href: "/#pubblicazioni", label: "Pubblicazioni" },
  { href: "/#sostegno", label: "Sostegno" },
  { href: "/#schede", label: "Schede funghi" },
  { href: "/#annunci", label: "Annunci" },
  { href: "/#facebook", label: "Facebook" },
  { href: "/#date", label: "Prossime date" },
] as const;

const ORG_LINK = {
  href: "/admin/login",
  label: "Organizzatori",
} as const;

type Props = {
  logoUrl?: string | null;
};

export function SiteHeaderNav({ logoUrl }: Props) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-950/30 bg-[#052e16] text-emerald-50 shadow-md shadow-emerald-950/25">
      <div className="mx-auto flex min-h-16 max-w-5xl items-center justify-between gap-2 px-3 py-2 sm:gap-4 sm:px-4 sm:py-2.5">
        <Link
          href="/"
          onClick={close}
          className="group flex min-w-0 shrink items-center gap-2.5 sm:gap-3"
        >
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-white/20 sm:h-11 sm:w-11"
            />
          ) : (
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-800/80 text-xs font-bold tracking-tight text-amber-100 ring-2 ring-white/15 sm:h-11 sm:w-11 sm:text-sm"
              aria-hidden
            >
              GMC
            </div>
          )}
          <div className="min-w-0 flex flex-col gap-0">
            <span className="line-clamp-2 text-left text-[12px] font-semibold leading-snug tracking-tight text-white sm:text-sm">
              Gruppo micologico culturale
            </span>
            <span className="truncate text-[9px] font-medium uppercase tracking-widest text-emerald-300/90 sm:text-[11px]">
              Sandonatese · San Donà
            </span>
          </div>
        </Link>

        {/* Desktop / tablet: link a capo, ben leggibili */}
        <nav
          className="hidden min-w-0 flex-1 items-center justify-end lg:flex"
          aria-label="Navigazione principale"
        >
          <ul className="flex max-w-[min(100%,44rem)] flex-wrap justify-end gap-x-1 gap-y-1.5">
            {[...PAGE_LINKS, ORG_LINK].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`inline-block rounded-full px-2.5 py-1.5 text-[13px] font-medium transition-colors hover:bg-white/10 hover:text-white active:bg-white/15 ${
                    l.href === ORG_LINK.href
                      ? "text-amber-200/95 ring-1 ring-amber-400/35"
                      : "text-emerald-50/95"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="inline-flex h-11 min-w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10 lg:hidden"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? "Chiudi menu" : "Apri menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <span aria-hidden>✕</span>
          ) : (
            <span className="flex flex-col gap-1" aria-hidden>
              <span className="block h-0.5 w-5 rounded-full bg-current" />
              <span className="block h-0.5 w-5 rounded-full bg-current" />
              <span className="block h-0.5 w-5 rounded-full bg-current" />
            </span>
          )}
        </button>
      </div>

      {/* Mobile pannello a tutta larghezza */}
      {open ? (
        <div
          id={panelId}
          className="fixed inset-x-0 bottom-0 top-16 z-50 flex flex-col bg-[#041a10]/98 backdrop-blur-md lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu di navigazione"
          onClick={close}
        >
          <nav
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-4"
            aria-label="Navigazione principale"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-400/90">
              Pagine
            </p>
            <ul className="mt-2 flex flex-col gap-0.5 border-b border-white/10 pb-4">
              {PAGE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={close}
                    className="block rounded-xl px-3 py-3 text-base font-medium text-white hover:bg-white/10"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[11px] font-bold uppercase tracking-widest text-emerald-400/90">
              Sezioni della home
            </p>
            <ul className="mt-2 flex flex-col gap-0.5 border-b border-white/10 pb-4">
              {HOME_SECTION_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={close}
                    className="block rounded-xl px-3 py-2.5 text-[15px] text-emerald-100/95 hover:bg-white/10"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={ORG_LINK.href}
              onClick={close}
              className="mt-6 block rounded-xl border border-amber-400/40 bg-amber-950/40 px-4 py-3 text-center text-base font-semibold text-amber-100"
            >
              {ORG_LINK.label}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
