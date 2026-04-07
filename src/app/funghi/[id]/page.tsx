import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentCard, Section, SectionHeader } from "@/components/ui/section";
import { getSpeciesById } from "@/lib/db-public";

type Props = { params: Promise<{ id: string }> };

export default async function SpeciesDetailPage({ params }: Props) {
  const { id } = await params;
  const result = await getSpeciesById(id);
  if (!result.ok) {
    return (
      <main className="mx-auto max-w-3xl flex-1 px-4 py-16">
        <p className="text-stone-600">
          Non è stato possibile caricare la scheda. Riprova più tardi.
        </p>
        <Link
          href="/funghi"
          className="mt-4 inline-block font-semibold text-emerald-800 underline"
        >
          Torna all&apos;elenco
        </Link>
      </main>
    );
  }
  const s = result.species;
  if (!s) notFound();

  return (
    <main className="flex flex-1 flex-col">
      <Section band="paper" narrow className="pt-10 sm:pt-14">
        <Link
          href="/funghi"
          className="text-sm font-semibold text-emerald-800 hover:underline"
        >
          ← Tutte le schede
        </Link>
        <article className="mt-6">
          <ContentCard hover={false} className="overflow-hidden p-0">
            {s.imageUrl && (
              <div className="aspect-[2/1] max-h-80 w-full overflow-hidden bg-stone-200/80">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="p-6 sm:p-8">
              <h1 className="text-3xl font-semibold tracking-tight text-[var(--heading)]">
                {s.name}
              </h1>
              {s.scientificName && (
                <p className="mt-2 text-lg italic text-stone-600">
                  {s.scientificName}
                </p>
              )}
              <dl className="mt-8 grid gap-5 text-sm">
                {s.synonyms && (
                  <div>
                    <dt className="font-medium text-stone-500">Sinonimi</dt>
                    <dd className="mt-1 text-stone-800">{s.synonyms}</dd>
                  </div>
                )}
                {s.habitat && (
                  <div>
                    <dt className="font-medium text-stone-500">Habitat</dt>
                    <dd className="mt-1 text-stone-800">{s.habitat}</dd>
                  </div>
                )}
                {s.edibility && (
                  <div>
                    <dt className="font-medium text-stone-500">
                      Commestibilità
                    </dt>
                    <dd className="mt-1 text-stone-800">{s.edibility}</dd>
                  </div>
                )}
                {s.notes && (
                  <div>
                    <dt className="font-medium text-stone-500">Note</dt>
                    <dd className="mt-1 whitespace-pre-wrap text-stone-800">
                      {s.notes}
                    </dd>
                  </div>
                )}
                {s.source && !s.sourceUrl && (
                  <div>
                    <dt className="font-medium text-stone-500">Fonte</dt>
                    <dd className="mt-1 text-stone-800">{s.source}</dd>
                  </div>
                )}
              </dl>
            </div>
          </ContentCard>

          {(s.sourceUrl || s.autoImported || s.wikidataId) && (
            <ContentCard className="mt-6" hover={false}>
              <SectionHeader
                compact
                title="Fonti e aggiornamento"
                description="Trasparenza sulle informazioni pubblicate."
              />
              <ul className="mt-4 space-y-2 text-sm text-stone-700">
                {s.sourceName && (
                  <li>
                    <span className="font-medium text-stone-600">Origine: </span>
                    {s.sourceName}
                  </li>
                )}
                {s.sourceUrl && (
                  <li>
                    <a
                      href={s.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-emerald-800 underline decoration-emerald-800/30"
                    >
                      Apri la fonte (Wikipedia / esterno) →
                    </a>
                  </li>
                )}
                {s.wikidataId && (
                  <li>
                    <a
                      href={`https://www.wikidata.org/wiki/${encodeURIComponent(s.wikidataId)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-800 underline"
                    >
                      Wikidata ({s.wikidataId})
                    </a>
                  </li>
                )}
                {s.lastSyncedAt && (
                  <li className="text-stone-600">
                    Ultimo aggiornamento dati:{" "}
                    {new Intl.DateTimeFormat("it-IT", {
                      dateStyle: "long",
                      timeStyle: "short",
                    }).format(s.lastSyncedAt)}
                  </li>
                )}
                {s.imageAttribution && (
                  <li className="text-xs text-stone-500">
                    {s.imageAttribution}
                  </li>
                )}
              </ul>
            </ContentCard>
          )}
        </article>
      </Section>
    </main>
  );
}
