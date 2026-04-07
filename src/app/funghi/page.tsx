import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo-config";
import { EmptyState, Section, SectionHeader } from "@/components/ui/section";
import { listSpecies } from "@/lib/db-public";

export const metadata: Metadata = pageMetadata({
  title: "Schede funghi",
  description:
    "Elenco delle schede divulgative sulle specie di funghi pubblicate dal Gruppo Micologico Culturale Sandonatese (San Donà di Piave).",
  path: "/funghi",
});

export default async function FunghiPage() {
  const species = await listSpecies();

  return (
    <main className="flex flex-1 flex-col">
      <Section band="paper" className="pt-10 sm:pt-14">
        <SectionHeader
          title="Schede funghi"
          description="Specie pubblicate sul sito. Contenuti divulgativi: verificare sempre con guide aggiornate ed esperti."
        />
        {!species && (
          <div className="mt-8">
            <EmptyState title="Elenco temporaneamente non disponibile." />
          </div>
        )}
        {species && species.length === 0 && (
          <div className="mt-8">
            <EmptyState title="Non ci sono ancora schede pubblicate.">
              Gli organizzatori possono aggiungerle dall&apos;area riservata{" "}
              <Link
                href="/organizzatori"
                className="font-medium text-emerald-800 underline"
              >
                Organizzatori
              </Link>
              . Puoi anche seguire gli aggiornamenti dalla home o dalla pagina
              Facebook del gruppo.
            </EmptyState>
          </div>
        )}
        {species && species.length > 0 && (
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {species.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/funghi/${s.id}`}
                  className="block rounded-2xl border border-stone-200/90 bg-white p-5 shadow-[var(--shadow-card)] ring-1 ring-stone-900/[0.03] transition hover:border-emerald-800/25 hover:shadow-md"
                >
                  <div className="flex gap-4">
                    {s.imageUrl && (
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-stone-200/80">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={s.imageUrl}
                          alt={`${s.name}${s.scientificName ? ` (${s.scientificName})` : ""} — immagine scheda fungo`}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="font-semibold text-emerald-950">
                        {s.name}
                      </span>
                      {s.scientificName && (
                        <span className="mt-1 block text-sm italic text-stone-500">
                          {s.scientificName}
                        </span>
                      )}
                      {s.autoImported && (
                        <span className="mt-2 inline-block rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-stone-600">
                          Da Wikipedia
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </main>
  );
}
