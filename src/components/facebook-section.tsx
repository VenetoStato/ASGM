import Link from "next/link";
import type { FacebookPost } from "@/lib/facebook-posts";
import { FACEBOOK_PAGE_URL } from "@/lib/public-site";
import { FacebookPageEmbed } from "./facebook-page-embed";

function formatFbDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("it-IT", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

function excerpt(text: string | null, max = 220) {
  if (!text?.trim()) return null;
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
}

type Props = {
  graphPosts: FacebookPost[] | null;
};

export function FacebookSection({ graphPosts }: Props) {
  return (
    <section id="facebook" className="scroll-mt-28">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-stone-200/90 pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-emerald-950">
            Dal gruppo su Facebook
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            Aggiornamenti dalla pagina del Gruppo Micologico Culturale
            Sandonatese
          </p>
        </div>
        <Link
          href={FACEBOOK_PAGE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-[#1877F2] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#166fe5]"
        >
          Apri su Facebook
        </Link>
      </div>

      {graphPosts && graphPosts.length > 0 && (
        <ul className="mt-8 flex flex-col gap-4">
          {graphPosts.map((p) => (
            <li
              key={p.id}
              className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-sm ring-1 ring-stone-900/[0.04]"
            >
              {p.full_picture && (
                <a
                  href={p.permalink_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block aspect-[1.91/1] max-h-56 w-full overflow-hidden bg-stone-200/80 sm:max-h-64"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.full_picture}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </a>
              )}
              <div className="p-4 sm:p-5">
                <p className="text-xs text-stone-500">
                  {formatFbDate(p.created_time)}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed text-stone-800">
                  {excerpt(p.message) ??
                    "Post sulla pagina Facebook del gruppo."}
                </p>
                <a
                  href={p.permalink_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm font-semibold text-[#1877F2] hover:underline"
                >
                  Leggi su Facebook →
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 rounded-2xl border border-stone-200/90 bg-stone-50/80 p-4 sm:p-5">
        <p className="mb-4 text-center text-sm text-stone-600">
          Qui sotto la timeline della pagina (si aggiorna automaticamente).
        </p>
        <FacebookPageEmbed pageUrl={FACEBOOK_PAGE_URL} />
      </div>
    </section>
  );
}
