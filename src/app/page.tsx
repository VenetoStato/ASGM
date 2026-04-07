import type { Metadata } from "next";
import Link from "next/link";
import { FacebookSection } from "@/components/facebook-section";
import { FeaturedSpeciesSection } from "@/components/featured-species-section";
import {
  fetchFacebookGraphPosts,
  fetchFacebookPageMeta,
} from "@/lib/facebook-posts";
import {
  getHomeSpotlight,
  getSiteCopy,
  getWeeklyFeaturedSpecies,
  listPublishedAnnouncements,
  listSpecies,
  listUpcomingEvents,
} from "@/lib/db-public";
import {
  ContentCard,
  EmptyState,
  Prose,
  Section,
  SectionHeader,
} from "@/components/ui/section";

function parseImages(raw: unknown): string[] {
  if (!raw || !Array.isArray(raw)) return [];
  return raw.filter((x): x is string => typeof x === "string");
}

function formatEventWhen(d: Date) {
  return new Intl.DateTimeFormat("it-IT", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

const ctaPrimary =
  "inline-flex w-full items-center justify-center rounded-2xl bg-white px-4 py-3 text-center text-sm font-semibold text-stone-900 shadow-lg shadow-black/15 transition hover:bg-amber-50 sm:w-auto sm:min-w-[10rem] sm:px-5 sm:text-base";
const ctaGhost =
  "inline-flex w-full items-center justify-center rounded-2xl border border-white/30 bg-white/10 px-4 py-3 text-center text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15 sm:w-auto sm:min-w-[10rem] sm:px-5 sm:text-base";

export default async function Home() {
  const [
    copy,
    announcements,
    upcoming,
    species,
    fbPosts,
    pageMeta,
    spotlight,
    weeklySpecies,
  ] = await Promise.all([
    getSiteCopy(),
    listPublishedAnnouncements(3),
    listUpcomingEvents(4),
    listSpecies(),
    fetchFacebookGraphPosts(),
    fetchFacebookPageMeta(),
    getHomeSpotlight(),
    getWeeklyFeaturedSpecies(),
  ]);

  const featuredSpecies =
    species && species.length > 0 ? species : null;
  const weeklyId = weeklySpecies?.id ?? null;

  return (
    <main className="flex flex-1 flex-col">
      <section className="relative overflow-hidden border-b border-amber-900/25 bg-gradient-to-br from-[#0c1f14] via-emerald-950 to-stone-950 px-4 py-10 text-white sm:py-16 md:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23ffffff' fill-opacity='1' d='M40 0L60 20v20L40 60 20 40V20z'/%3E%3C/svg%3E")`,
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200/85">
            Gruppo micologico · Bassa · Veneto
          </p>
          <h1 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-[2.6rem]">
            {copy.heroTitle}
          </h1>
          <p className="mt-3 text-lg font-medium text-amber-100/95 sm:text-xl">
            {copy.heroSubtitle}
          </p>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-stone-200/95 sm:text-lg">
            {copy.heroLead}
          </p>
          <div className="mt-8 grid grid-cols-2 gap-2 sm:mt-10 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-3">
            <Link href="/#in-evidenza" className={ctaPrimary}>
              In evidenza
            </Link>
            <Link href="/#chi-siamo" className={ctaGhost}>
              Chi siamo
            </Link>
            <Link href="/#annunci" className={ctaGhost}>
              Annunci
            </Link>
            <Link href="/#facebook" className={ctaGhost}>
              Facebook
            </Link>
          </div>
        </div>
      </section>

      <Section id="in-evidenza" band="paper" narrow>
        <SectionHeader
          compact
          title="In evidenza"
          description="La prossima attività in programma o l’ultimo annuncio pubblicato."
        />
        <div className="mt-6">
          {!spotlight && (
            <EmptyState title="Nessun contenuto in evidenza al momento.">
              Torna a trovarci presto o consulta il calendario e gli annunci
              qui sotto.
            </EmptyState>
          )}
          {spotlight?.kind === "event" && (
            <ContentCard>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Prossima attività
              </p>
              <p className="mt-2 text-lg font-semibold text-emerald-950">
                {spotlight.item.title}
              </p>
              <p className="mt-1 text-sm text-stone-600">
                {formatEventWhen(spotlight.item.startsAt)}
                {spotlight.item.location
                  ? ` · ${spotlight.item.location}`
                  : ""}
              </p>
              <Link
                href="/eventi"
                className="mt-4 inline-block text-sm font-semibold text-emerald-800 hover:underline"
              >
                Vedi tutti gli eventi →
              </Link>
            </ContentCard>
          )}
          {spotlight?.kind === "announcement" && (
            <ContentCard>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Ultimo annuncio
              </p>
              <p className="mt-2 text-lg font-semibold text-emerald-950">
                {spotlight.item.title}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-stone-700 sm:text-[15px]">
                {spotlight.item.body}
              </p>
              <Link
                href="/annunci"
                className="mt-4 inline-block text-sm font-semibold text-emerald-800 hover:underline"
              >
                Tutti gli annunci →
              </Link>
            </ContentCard>
          )}
        </div>
      </Section>

      <Section id="chi-siamo" band="default">
        <SectionHeader title="Chi siamo" />
        <Prose className="mt-6 sm:mt-8">{copy.chiSiamo}</Prose>
      </Section>

      <Section id="pubblicazioni" band="muted">
        <div className="grid gap-5 md:grid-cols-2">
          <ContentCard>
            <h3 className="text-lg font-semibold text-emerald-950">
              Pubblicazioni e materiali
            </h3>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-stone-600 sm:text-[15px]">
              {copy.pubblicazioni}
            </p>
          </ContentCard>
          <ContentCard>
            <h3 className="text-lg font-semibold text-emerald-950">
              Calendario e attività
            </h3>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-stone-600 sm:text-[15px]">
              {copy.calendarioAttivita}
            </p>
            <Link
              href="/eventi"
              className="mt-4 inline-block text-sm font-semibold text-emerald-800 hover:underline"
            >
              Vai al calendario completo →
            </Link>
          </ContentCard>
        </div>
      </Section>

      <Section id="sostegno" band="accent" narrow>
        <ContentCard hover={false} className="border-amber-200/90 bg-white/90">
          <SectionHeader compact title="Sostegno al gruppo" />
          <Prose className="mt-4 text-stone-800">{copy.sostegno}</Prose>
        </ContentCard>
      </Section>

      <Section id="schede" band="default">
        <FeaturedSpeciesSection
          fromDb={featuredSpecies}
          weeklyHighlightId={weeklyId}
        />
      </Section>

      <Section id="facebook" band="muted">
        <FacebookSection graphPosts={fbPosts} pageMeta={pageMeta} postLimit={2} />
      </Section>

      <Section id="annunci" band="paper">
        <SectionHeader
          title="Annunci"
          description="Novità e comunicazioni del gruppo."
          action={
            <Link
              href="/annunci"
              className="rounded-full bg-emerald-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-950"
            >
              Archivio
            </Link>
          }
        />
        <div className="mt-8">
          {!announcements && (
            <EmptyState title="Annunci temporaneamente non disponibili." />
          )}
          {announcements && announcements.length === 0 && (
            <EmptyState
              title="Nessun annuncio pubblicato."
              action={
                <Link
                  href="/admin/login"
                  className="text-sm font-semibold text-emerald-800 underline"
                >
                  Area organizzatori
                </Link>
              }
            />
          )}
          {announcements && announcements.length > 0 && (
            <ul className="flex flex-col gap-6">
              {announcements.map((a) => {
                const imgs = parseImages(a.images).slice(0, 3);
                return (
                  <li key={a.id}>
                    <ContentCard className="overflow-hidden p-0">
                      {imgs[0] && (
                        <div className="aspect-[21/9] w-full overflow-hidden bg-stone-200/90 sm:aspect-[2.4/1]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imgs[0]}
                            alt={`Anteprima annuncio: ${a.title}`}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="p-5 sm:p-6">
                        <h3 className="text-lg font-semibold text-emerald-950 sm:text-xl">
                          {a.title}
                        </h3>
                        <p className="mt-3 max-h-[min(28rem,70vh)] overflow-y-auto whitespace-pre-wrap text-[15px] leading-relaxed text-stone-700">
                          {a.body}
                        </p>
                      </div>
                    </ContentCard>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Section>

      <Section id="date" band="default">
        <SectionHeader
          title="Prossime date"
          description="Uscite e attività in programma."
          action={
            <Link
              href="/eventi"
              className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-950 ring-1 ring-emerald-900/15 hover:bg-emerald-100"
            >
              Calendario
            </Link>
          }
        />
        <div className="mt-8">
          {!upcoming && (
            <EmptyState title="Calendario non disponibile al momento." />
          )}
          {upcoming && upcoming.length === 0 && (
            <EmptyState title="Nessuna data futura in elenco." />
          )}
          {upcoming && upcoming.length > 0 && (
            <ul className="flex flex-col gap-3">
              {upcoming.map((ev) => (
                <li key={ev.id}>
                  <ContentCard>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                      {formatEventWhen(ev.startsAt)}
                    </p>
                    <p className="mt-1.5 text-base font-semibold text-emerald-950 sm:text-lg">
                      {ev.title}
                    </p>
                    {ev.location && (
                      <p className="mt-1 text-sm text-stone-600">
                        {ev.location}
                      </p>
                    )}
                  </ContentCard>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Section>

      <Section id="nav-extra" band="muted" className="pb-12 sm:pb-16">
        <p className="text-center text-sm text-stone-600">
          <Link
            href="/funghi"
            className="font-semibold text-emerald-800 underline decoration-emerald-800/30 underline-offset-2"
          >
            Schede funghi
          </Link>
          <span className="mx-2 text-stone-400" aria-hidden>
            ·
          </span>
          <Link
            href="/news"
            className="font-semibold text-emerald-800 underline decoration-emerald-800/30 underline-offset-2"
          >
            News
          </Link>
        </p>
      </Section>
    </main>
  );
}
