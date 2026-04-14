import type { FacebookPageMeta, FacebookPost } from "@/lib/facebook-posts";
import { FACEBOOK_PAGE_URL } from "@/lib/public-site";
import { FacebookPageLink } from "./facebook-brand";
import { FacebookEmbedWithFallback } from "./facebook-embed-fallback";
import { ContentCard, SectionHeader } from "./ui/section";

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
  pageMeta: FacebookPageMeta | null;
  /** Anteprima post in home: limita per non allungare troppo la pagina. */
  postLimit?: number;
  /** Se false, nasconde il titolo grande (es. dentro un disclosure). */
  showHeader?: boolean;
  /** true = solo timeline + un CTA (niente card Graph duplicate). */
  compact?: boolean;
};

export function FacebookSection({
  graphPosts,
  pageMeta,
  postLimit = 6,
  showHeader = true,
  compact = false,
}: Props) {
  const cards =
    !compact && graphPosts && postLimit > 0
      ? graphPosts.slice(0, postLimit)
      : !compact
        ? graphPosts
        : null;
  const hasCards = Boolean(cards && cards.length > 0);

  return (
    <div>
      {showHeader ? (
        <SectionHeader
          title="Dal gruppo su Facebook"
          description={
            pageMeta?.name
              ? `Aggiornamenti dalla pagina «${pageMeta.name}». I post qui sotto rimandano sempre alla pagina ufficiale.`
              : "Aggiornamenti dalla pagina Facebook del gruppo. I contenuti si aggiornano automaticamente."
          }
          action={
            <FacebookPageLink href={FACEBOOK_PAGE_URL} variant="solid">
              Apri su Facebook
            </FacebookPageLink>
          }
        />
      ) : (
        !compact && (
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-stone-600 sm:text-sm">
              {pageMeta?.name
                ? `Pagina «${pageMeta.name}»`
                : "Pagina Facebook del gruppo"}
            </p>
            <FacebookPageLink
              href={FACEBOOK_PAGE_URL}
              variant="solid"
              className="py-2 text-xs sm:text-sm"
            >
              Apri su Facebook
            </FacebookPageLink>
          </div>
        )
      )}

      {!compact && (pageMeta?.pictureUrl || pageMeta?.name) && (
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-stone-200/90 bg-white px-3 py-2 shadow-sm sm:mt-4 sm:px-4 sm:py-3">
          {pageMeta.pictureUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={pageMeta.pictureUrl}
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-stone-200"
            />
          )}
          <div>
            <p className="text-sm font-semibold text-emerald-950">
              {pageMeta.name ?? "Pagina Facebook"}
            </p>
            <p className="text-xs text-stone-500">Profilo collegato via API</p>
          </div>
        </div>
      )}

      {hasCards && cards && (
        <ul className="mt-4 flex flex-col gap-3 sm:mt-5">
          {cards.map((p) => (
            <li key={p.id}>
              <ContentCard hover className="overflow-hidden p-0">
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
                      "Post con foto sulla pagina Facebook del gruppo."}
                  </p>
                  <a
                    href={p.permalink_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-sm font-semibold text-[#1877F2] hover:underline"
                  >
                    Apri il post su Facebook →
                  </a>
                </div>
              </ContentCard>
            </li>
          ))}
        </ul>
      )}

      {!compact && !hasCards && (
        <p className="mt-4 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-600">
          Per le anteprime dei singoli post serve{" "}
          <code className="rounded bg-stone-200/80 px-1 text-xs">
            FACEBOOK_PAGE_ACCESS_TOKEN
          </code>{" "}
          su Vercel. La timeline qui sotto funziona comunque.
        </p>
      )}

      <div
        className={
          compact
            ? "mt-0 rounded-xl border border-stone-200/90 bg-[var(--surface-muted)] p-2 sm:p-4"
            : "mt-4 rounded-xl border border-stone-200/90 bg-[var(--surface-muted)] p-2 sm:p-4 sm:mt-5"
        }
      >
        {!compact && (
          <p className="mb-2 text-center text-xs text-stone-600 sm:text-sm">
            Timeline della pagina: scorri nel riquadro. Se non si carica, apri con
            il pulsante sotto.
          </p>
        )}
        <FacebookEmbedWithFallback pageUrl={FACEBOOK_PAGE_URL} />
        <div className="mt-4 flex justify-center">
          <FacebookPageLink href={FACEBOOK_PAGE_URL} variant="outline">
            Apri la pagina su Facebook
          </FacebookPageLink>
        </div>
      </div>
    </div>
  );
}
