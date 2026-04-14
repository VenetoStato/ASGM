import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FacebookIcon } from "@/components/facebook-brand";
import { FacebookSection } from "@/components/facebook-section";
import { FeaturedSpeciesSection } from "@/components/featured-species-section";
import {
  fetchFacebookGraphPosts,
  fetchFacebookPageMeta,
} from "@/lib/facebook-posts";
import {
  getSiteCopy,
  getWeeklyFeaturedSpecies,
  listPublishedAnnouncements,
  listSpecies,
  listUpcomingEvents,
} from "@/lib/db-public";
import { CompactDisclosure } from "@/components/ui/disclosure";
import {
  ContentCard,
  EmptyState,
  Prose,
  Section,
  SectionHeader,
} from "@/components/ui/section";
import { HomeGallerySection } from "@/components/home-gallery-section";
import { HOME_HERO_IMAGE } from "@/lib/home-gallery";

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
    weeklySpecies,
  ] = await Promise.all([
    getSiteCopy(),
    listPublishedAnnouncements(3),
    listUpcomingEvents(8),
    listSpecies(),
    fetchFacebookGraphPosts(),
    fetchFacebookPageMeta(),
    getWeeklyFeaturedSpecies(),
  ]);

  const featuredSpecies =
    species && species.length > 0 ? species : null;
  const weeklyId = weeklySpecies?.id ?? null;

  return (
    <main className="flex flex-1 flex-col">
      <section className="relative overflow-hidden border-b border-amber-900/25 bg-gradient-to-br from-[#0c1f14] via-emerald-950 to-stone-950 px-4 py-6 text-white sm:py-10 md:py-14">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <Image
            src={HOME_HERO_IMAGE.src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1810]/95 via-emerald-950/88 to-[#0c1f14]/75" />
        </div>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23ffffff' fill-opacity='1' d='M40 0L60 20v20L40 60 20 40V20z'/%3E%3C/svg%3E")`,
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200/85">
            Gruppo micologico · Bassa · Veneto
          </p>
          <h1 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight drop-shadow-sm sm:text-4xl md:text-[2.6rem]">
            {copy.heroTitle}
          </h1>
          <p className="mt-3 text-lg font-medium text-amber-100/95 sm:text-xl">
            {copy.heroSubtitle}
          </p>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-stone-200/95 sm:text-lg">
            {copy.heroLead}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-2 sm:mt-8 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-3">
            <Link href="/#date" className={ctaPrimary}>
              Prossime date
            </Link>
            <Link href="/#galleria" className={ctaGhost}>
              Galleria foto
            </Link>
            <Link href="/#chi-siamo" className={ctaGhost}>
              Chi siamo
            </Link>
            <Link href="/#annunci" className={ctaGhost}>
              Annunci
            </Link>
            <Link
              href="/#facebook"
              className={`${ctaGhost} inline-flex items-center justify-center gap-2`}
            >
              <span className="inline-flex rounded bg-white/95 p-0.5 shadow-sm">
                <FacebookIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </span>
              Facebook
            </Link>
          </div>
          <p className="mx-auto mt-5 max-w-lg text-[11px] leading-snug text-stone-300/90">
            Foto hero: porcini in bosco —{" "}
            <a
              href="https://commons.wikimedia.org/wiki/File:Boletus_edulis_(Tottoli)_01.jpg"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-stone-400/60 underline-offset-2"
            >
              Tottoli / CC BY-SA 3.0
            </a>{" "}
            (Wikimedia Commons)
          </p>
        </div>
      </section>

      <Section id="date" band="paper" narrow className="!pt-4 sm:!pt-5">
        <SectionHeader
          compact
          title="Prossime date"
          description="Uscite e attività in programma (si aggiorna in base al calendario)."
        />
        <div className="mb-3 flex justify-end">
          <Link
            href="/eventi"
            className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-950 ring-1 ring-emerald-900/15 hover:bg-emerald-100"
          >
            Calendario completo
          </Link>
        </div>
        <div className="mt-1">
          {!upcoming && (
            <EmptyState title="Calendario non disponibile al momento." />
          )}
          {upcoming && upcoming.length === 0 && (
            <EmptyState title="Nessuna data futura in elenco." />
          )}
          {upcoming && upcoming.length > 0 && (
            <ul className="flex flex-col gap-2">
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
                    {ev.description && (
                      <p className="mt-2 text-sm leading-relaxed text-stone-600">
                        {ev.description}
                      </p>
                    )}
                  </ContentCard>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Section>

      <HomeGallerySection />

      <Section band="default">
        <CompactDisclosure
          id="chi-siamo"
          title="Chi siamo"
          subtitle="Presentazione del gruppo — tocca per aprire"
          defaultOpen={false}
        >
          <Prose className="text-sm text-stone-800 sm:text-[15px]">
            {copy.chiSiamo}
          </Prose>
        </CompactDisclosure>
      </Section>

      <Section id="pubblicazioni" band="muted">
        <CompactDisclosure
          title="Pubblicazioni e calendario"
          subtitle="Materiali del gruppo e attività"
          defaultOpen={false}
        >
          <div className="grid gap-3 md:grid-cols-2">
            <ContentCard>
              <h3 className="text-base font-semibold text-emerald-950 sm:text-lg">
                Pubblicazioni e materiali
              </h3>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-stone-600">
                {copy.pubblicazioni}
              </p>
            </ContentCard>
            <ContentCard>
              <h3 className="text-base font-semibold text-emerald-950 sm:text-lg">
                Calendario e attività
              </h3>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-stone-600">
                {copy.calendarioAttivita}
              </p>
              <Link
                href="/eventi"
                className="mt-3 inline-block text-sm font-semibold text-emerald-800 hover:underline"
              >
                Calendario completo →
              </Link>
            </ContentCard>
          </div>
        </CompactDisclosure>
      </Section>

      <Section id="sostegno" band="accent" narrow>
        <CompactDisclosure
          title="Sostegno al gruppo"
          subtitle="5×1000 e contributi"
          defaultOpen={false}
        >
          <Prose className="text-sm text-stone-800 sm:text-[15px]">
            {copy.sostegno}
          </Prose>
        </CompactDisclosure>
      </Section>

      <Section id="schede" band="default">
        <CompactDisclosure
          title="Schede funghi"
          subtitle="Schede divulgative con riferimento a Wikipedia (IT) e foto Wikimedia"
          defaultOpen
        >
          <FeaturedSpeciesSection
            embedded
            fromDb={featuredSpecies}
            weeklyHighlightId={weeklyId}
          />
        </CompactDisclosure>
      </Section>

      <Section band="muted">
        <CompactDisclosure
          id="facebook"
          title="Facebook del gruppo"
          subtitle="Post, pagina e timeline (caricamento ottimizzato anche su mobile)"
          defaultOpen
        >
          <FacebookSection
            graphPosts={fbPosts}
            pageMeta={pageMeta}
            showHeader={false}
            compact
          />
        </CompactDisclosure>
      </Section>

      <Section id="annunci" band="paper">
        <CompactDisclosure
          id="annunci"
          title="Annunci"
          subtitle="Novità e comunicazioni"
          defaultOpen
        >
          <div className="mb-3 flex justify-end">
            <Link
              href="/annunci"
              className="rounded-full bg-emerald-900 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-950"
            >
              Archivio annunci
            </Link>
          </div>
          <div className="mt-1">
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
            <ul className="flex flex-col gap-3">
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
                      <div className="p-4 sm:p-5">
                        <h3 className="text-base font-semibold text-emerald-950 sm:text-lg">
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
        </CompactDisclosure>
      </Section>

    </main>
  );
}
