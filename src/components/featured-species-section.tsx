import Link from "next/link";
import { FEATURED_SPECIES_FALLBACK } from "@/lib/featured-species";

type SpeciesCard = {
  id: string;
  name: string;
  scientificName: string | null;
  edibility: string | null;
};

type Props = {
  fromDb: SpeciesCard[] | null;
  /** Ultima specie importata dal cron (badge “in evidenza”). */
  weeklyHighlightId?: string | null;
};

export function FeaturedSpeciesSection({
  fromDb,
  weeklyHighlightId,
}: Props) {
  const useDb = fromDb && fromDb.length > 0;
  const items = useDb ? fromDb.slice(0, 4) : null;

  return (
    <section id="schede" className="scroll-mt-28">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-stone-200/90 pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-emerald-950">
            Schede funghi
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            Alcune specie di riferimento — consulta sempre guide aggiornate
          </p>
        </div>
        <Link
          href="/funghi"
          className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-900 ring-1 ring-emerald-800/15 transition hover:bg-emerald-100"
        >
          Tutte le schede
        </Link>
      </div>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {useDb && items
          ? items.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/funghi/${s.id}`}
                  className="relative block h-full rounded-2xl border border-stone-200/90 bg-white p-5 shadow-sm ring-1 ring-stone-900/[0.03] transition hover:border-emerald-200/80 hover:shadow-md"
                >
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
    </section>
  );
}
