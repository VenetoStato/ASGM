import Link from "next/link";
import {
  getSiteCopy,
  listPublishedAnnouncements,
  listUpcomingEvents,
} from "@/lib/db-public";

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

export default async function Home() {
  const [copy, announcements, upcoming] = await Promise.all([
    getSiteCopy(),
    listPublishedAnnouncements(5),
    listUpcomingEvents(6),
  ]);

  return (
    <main className="flex flex-1 flex-col pb-16">
      <section className="relative overflow-hidden border-b border-amber-900/20 bg-gradient-to-br from-amber-950 via-stone-800 to-stone-950 px-4 py-12 text-white sm:py-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/90">
            Micologia · territorio
          </p>
          <h1 className="mt-3 text-balance text-3xl font-bold leading-[1.15] tracking-tight sm:text-4xl md:text-[2.35rem]">
            {copy.heroTitle}
          </h1>
          <p className="mt-2 text-lg font-medium text-amber-100/95 sm:text-xl">
            {copy.heroSubtitle}
          </p>
          <p className="mx-auto mt-4 max-w-lg text-pretty text-base leading-relaxed text-amber-100/90 sm:text-lg">
            {copy.heroLead}
          </p>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/#chi-siamo"
              className="rounded-2xl border border-white/25 bg-white/10 px-6 py-3.5 text-center text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/15 active:scale-[0.98] sm:min-w-[11rem]"
            >
              Chi siamo
            </Link>
            <Link
              href="/#annunci"
              className="rounded-2xl bg-white px-6 py-3.5 text-center text-base font-semibold text-stone-900 shadow-lg shadow-black/20 transition hover:bg-amber-50 active:scale-[0.98] sm:min-w-[11rem]"
            >
              Annunci
            </Link>
            <Link
              href="/#date"
              className="rounded-2xl border-2 border-white/35 bg-white/10 px-6 py-3.5 text-center text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/15 active:scale-[0.98] sm:min-w-[11rem]"
            >
              Prossime date
            </Link>
            <Link
              href="/admin/login"
              className="rounded-2xl border border-white/20 bg-transparent px-6 py-3.5 text-center text-base font-medium text-amber-100 transition hover:bg-white/10 active:scale-[0.98] sm:min-w-[11rem]"
            >
              Area organizzatori
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-14 px-4 pt-12">
        <section id="chi-siamo" className="scroll-mt-28">
          <h2 className="border-b border-stone-200/90 pb-4 text-2xl font-bold tracking-tight text-emerald-950">
            Chi siamo
          </h2>
          <p className="mt-6 whitespace-pre-wrap text-pretty text-[15px] leading-relaxed text-stone-700 sm:text-base">
            {copy.chiSiamo}
          </p>
        </section>

        <section
          id="pubblicazioni"
          className="grid scroll-mt-28 gap-4 sm:grid-cols-2"
        >
          <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-sm ring-1 ring-stone-900/[0.03] sm:p-6">
            <h2 className="text-lg font-bold text-emerald-950">
              Pubblicazioni e materiali
            </h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-stone-600 sm:text-[15px]">
              {copy.pubblicazioni}
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-sm ring-1 ring-stone-900/[0.03] sm:p-6">
            <h2 className="text-lg font-bold text-emerald-950">
              Calendario e attività
            </h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-stone-600 sm:text-[15px]">
              {copy.calendarioAttivita}
            </p>
            <Link
              href="/eventi"
              className="mt-4 inline-block text-sm font-semibold text-emerald-800 hover:underline"
            >
              Vai al calendario →
            </Link>
          </div>
        </section>

        <section id="sostegno" className="scroll-mt-28 rounded-2xl border border-amber-200/90 bg-amber-50/80 p-5 sm:p-6">
          <h2 className="text-lg font-bold text-emerald-950">Sostegno</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-stone-800 sm:text-[15px]">
            {copy.sostegno}
          </p>
        </section>

        <section id="annunci" className="scroll-mt-28">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-stone-200/90 pb-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-emerald-950">
                Annunci
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                Novità dal gruppo
              </p>
            </div>
            <Link
              href="/annunci"
              className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-900 ring-1 ring-emerald-800/15 transition hover:bg-emerald-100"
            >
              Vedi tutti
            </Link>
          </div>
          {!announcements && (
            <p className="mt-4 rounded-xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              Database non configurato.
            </p>
          )}
          {announcements && announcements.length === 0 && (
            <p className="mt-8 rounded-xl border border-dashed border-stone-300 bg-stone-100/50 px-4 py-8 text-center text-stone-600">
              Nessun annuncio ancora. Gli organizzatori possono aggiungerne dall&apos;{" "}
              <Link
                href="/admin/login"
                className="font-semibold text-emerald-800 underline decoration-emerald-800/30"
              >
                area riservata
              </Link>
              .
            </p>
          )}
          {announcements && announcements.length > 0 && (
            <ul className="mt-8 flex flex-col gap-8">
              {announcements.map((a) => {
                const imgs = parseImages(a.images).slice(0, 3);
                return (
                  <li
                    key={a.id}
                    className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-[0_2px_24px_-4px_rgba(0,0,0,0.08)] ring-1 ring-stone-900/[0.04] transition hover:shadow-[0_8px_32px_-6px_rgba(0,0,0,0.1)]"
                  >
                    {imgs[0] && (
                      <div className="aspect-[21/9] w-full overflow-hidden bg-stone-200/90 sm:aspect-[2.4/1]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imgs[0]}
                          alt=""
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-5 sm:p-6">
                      <h3 className="text-lg font-bold text-emerald-950 sm:text-xl">
                        {a.title}
                      </h3>
                      <p className="mt-3 line-clamp-4 whitespace-pre-wrap text-[15px] leading-relaxed text-stone-700 sm:line-clamp-6">
                        {a.body}
                      </p>
                      {imgs.length > 1 && (
                        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                          {imgs.slice(1).map((src) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              key={src}
                              src={src}
                              alt=""
                              className="h-20 w-28 shrink-0 rounded-lg object-cover ring-1 ring-stone-200"
                              loading="lazy"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section id="date" className="scroll-mt-28">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-stone-200/90 pb-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-emerald-950">
                Prossime date
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                Uscite e attività in programma
              </p>
            </div>
            <Link
              href="/eventi"
              className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-900 ring-1 ring-emerald-800/15 transition hover:bg-emerald-100"
            >
              Calendario
            </Link>
          </div>
          {!upcoming && (
            <p className="mt-4 text-sm text-stone-500">
              Calendario non disponibile.
            </p>
          )}
          {upcoming && upcoming.length === 0 && (
            <p className="mt-8 rounded-xl border border-dashed border-stone-300 bg-stone-100/50 px-4 py-8 text-center text-stone-600">
              Nessuna data futura. Aggiungi attività da{" "}
              <Link
                href="/admin/login"
                className="font-semibold text-emerald-800 underline decoration-emerald-800/30"
              >
                organizzatori
              </Link>
              .
            </p>
          )}
          {upcoming && upcoming.length > 0 && (
            <ul className="mt-8 flex flex-col gap-3">
              {upcoming.map((ev) => (
                <li
                  key={ev.id}
                  className="flex flex-col gap-1 rounded-2xl border border-stone-200/90 bg-white p-4 shadow-sm ring-1 ring-stone-900/[0.03] transition hover:border-emerald-200/80 sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:p-5"
                >
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                      {formatEventWhen(ev.startsAt)}
                    </p>
                    <p className="mt-1.5 text-base font-bold text-emerald-950 sm:text-lg">
                      {ev.title}
                    </p>
                    {ev.location && (
                      <p className="mt-1 text-sm text-stone-600">{ev.location}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/funghi"
            className="group rounded-2xl border border-stone-200/90 bg-white p-6 shadow-sm ring-1 ring-stone-900/[0.03] transition hover:border-emerald-200/80 hover:shadow-md"
          >
            <h2 className="font-bold text-emerald-950">Funghi</h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              Schede specie e note sul territorio.
            </p>
            <span className="mt-4 inline-block text-sm font-semibold text-emerald-800 group-hover:underline">
              Apri →
            </span>
          </Link>
          <Link
            href="/news"
            className="group rounded-2xl border border-stone-200/90 bg-white p-6 shadow-sm ring-1 ring-stone-900/[0.03] transition hover:border-emerald-200/80 hover:shadow-md"
          >
            <h2 className="font-bold text-emerald-950">News</h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              Aggiornamenti dal gruppo.
            </p>
            <span className="mt-4 inline-block text-sm font-semibold text-emerald-800 group-hover:underline">
              Apri →
            </span>
          </Link>
        </section>
      </div>
    </main>
  );
}
