import Link from "next/link";
import { FACEBOOK_PAGE_URL } from "@/lib/public-site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-stone-200 bg-white px-4 py-10 text-center text-sm text-stone-600">
      <p className="font-medium text-emerald-950">
        Gruppo Micologico Culturale Sandonatese — San Donà di Piave
      </p>
      <p className="mt-2">
        <Link
          href={FACEBOOK_PAGE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[#1877F2] hover:underline"
        >
          Pagina Facebook del gruppo
        </Link>
      </p>
      <p className="mt-4 text-xs text-stone-500">
        Le schede hanno scopo divulgativo: per la sicurezza rivolgersi sempre a
        esperti e alla normativa vigente.
      </p>
    </footer>
  );
}
