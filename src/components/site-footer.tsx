import Link from "next/link";
import { FACEBOOK_PAGE_URL } from "@/lib/public-site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-stone-300/80 bg-[#0c1f14] px-4 py-12 text-center text-sm text-stone-300">
      <p className="text-base font-semibold tracking-tight text-white">
        Gruppo Micologico Culturale Sandonatese
      </p>
      <p className="mt-1 text-emerald-200/90">San Donà di Piave</p>
      <div className="mx-auto mt-6 flex max-w-md flex-wrap justify-center gap-x-6 gap-y-2 text-[13px]">
        <Link href="/#chi-siamo" className="hover:text-white">
          Chi siamo
        </Link>
        <Link href="/eventi" className="hover:text-white">
          Eventi
        </Link>
        <Link href="/funghi" className="hover:text-white">
          Schede funghi
        </Link>
        <Link href="/annunci" className="hover:text-white">
          Annunci
        </Link>
        <Link
          href={FACEBOOK_PAGE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-sky-300 hover:text-white"
        >
          Facebook
        </Link>
      </div>
      <p className="mx-auto mt-8 max-w-lg text-xs leading-relaxed text-stone-500">
        Le informazioni sulle specie hanno scopo divulgativo. Per la raccolta e
        la commestibilità rivolgersi sempre a esperti qualificati e alla
        normativa vigente.
      </p>
    </footer>
  );
}
