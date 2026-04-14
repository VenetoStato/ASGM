import Link from "next/link";
import { FEATURED_SPECIES_FALLBACK } from "@/lib/featured-species";

type SpeciesCard = {
  id: string;
  name: string;
  scientificName: string | null;
  edibility: string | null;
  imageUrl?: string | null;
};

type Props = {
  fromDb: SpeciesCard[] | null;
  /** Ultima specie importata dal cron (badge “in evidenza”). */
  weeklyHighlightId?: string | null;
  /** Se true, niente titolo (es. dentro un disclosure sulla home). */
  embedded?: boolean;
};

export function FeaturedSpeciesSection({
  fromDb,
  weeklyHighlightId,
  embedded = false,
}: Props) {
  const useDb = fromDb && fromDb.length > 0;
  const items = useDb ? fromDb.slice(0, 6) : null;

  return (
    <div>
      {!embedded && (
        <div className="flex flex-col gap-2 border-b border-stone-200/90 pb-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-emerald-950 sm:text-2xl">
              Schede funghi
            </h2>
            <p className="mt-0.5 text-xs text-stone-500 sm:text-sm">
              Alcune specie di riferimento — consulta sempre guide aggiornate
            </p>
          </div>
          <Link
            href="/funghi"
            className="w-full rounded-full bg-emerald-50 px-3 py-2 text-center text-sm font-semibold text-emerald-900 ring-1 ring-emerald-800/15 transition hover:bg-emerald-100 sm:w-auto"
          >
            Tutte le schede
          </Link>
        </div>
      )}
      {embedded && (
        <div className="mb-3 flex justify-end">
          <Link
            href="/funghi"
            className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-900 ring-1 ring-emerald-800/15 transition hover:bg-emerald-100"
          >
            Tutte le schede →
          </Link>
        </div>
      )}
      <ul
        className={`grid gap-2 sm:grid-cols-2 ${embedded ? "mt-0" : "mt-4 sm:mt-5"}`}
      >
        {useDb && items
          ? items.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/funghi/${s.id}`}
                  className="relative block h-full overflow-hidden rounded-xl border border-stone-200/90 bg-white shadow-sm ring-1 ring-stone-900/[0.03] transition hover:border-emerald-200/80 hover:shadow-md"
                >
                  {s.imageUrl && (
                    <div className="relative aspect-[2.2/1] w-full overflow-hidden bg-stone-200/80">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.imageUrl}
                        alt={`${s.name}${s.scientificName ? ` (${s.scientificName})` : ""}`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-3 sm:p-4">
                  {weeklyHighlightId === s.id && (
                    <span className="absolute right-3 top-3 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-950 ring-1 ring-amber-300/80">
                      In evidenza
                    </span>
                  )}
                  <span className="font-bold text-emerald-950">{s.name}</span>
                  {s.scientificName && (
                    <span className="mt-1 block text-sm italic text-stone-500">
                      {s.scientificName}
                    </span>
                  )}
                  {s.edibility && (
                    <p className="mt-2 text-sm text-stone-600">{s.edibility}</p>
                  )}
                  <span className="mt-3 inline-block text-sm font-semibold text-emerald-800">
                    Apri scheda →
                  </span>
                  </div>
                </Link>
              </li>
            ))
          : FEATURED_SPECIES_FALLBACK.map((s) => (
              <li key={s.scientificName}>
                <Link
                  href="/funghi"
                  className="block h-full rounded-2xl border border-stone-200/90 bg-white p-5 shadow-sm ring-1 ring-stone-900/[0.03] transition hover:border-emerald-200/80 hover:shadow-md"
                >
                  <span className="font-bold text-emerald-950">{s.name}</span>
                  <span className="mt-1 block text-sm italic text-stone-500">
                    {s.scientificName}
                  </span>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    {s.note}
                  </p>
                  <span className="mt-3 inline-block text-sm font-semibold text-emerald-800">
                    Vedi schede →
                  </span>
                </Link>
              </li>
            ))}
      </ul>
    </div>
  );
}
