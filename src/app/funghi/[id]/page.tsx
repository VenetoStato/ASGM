import Link from "next/link";
import { notFound } from "next/navigation";
import { getSpeciesById } from "@/lib/db-public";

type Props = { params: Promise<{ id: string }> };

export default async function SpeciesDetailPage({ params }: Props) {
  const { id } = await params;
  const result = await getSpeciesById(id);
  if (!result.ok) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12">
        <p className="text-stone-600">Impossibile caricare il database.</p>
        <Link href="/funghi" className="mt-4 inline-block text-emerald-800 underline">
          Torna all&apos;elenco
        </Link>
      </main>
    );
  }
  const s = result.species;
  if (!s) notFound();

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-12">
      <Link
        href="/funghi"
        className="text-sm font-medium text-emerald-800 hover:underline"
      >
        ← Funghi
      </Link>
      <article className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-emerald-950">{s.name}</h1>
        {s.scientificName && (
          <p className="mt-2 text-lg italic text-stone-600">{s.scientificName}</p>
        )}
        <dl className="mt-6 grid gap-4 text-sm">
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
              <dt className="font-medium text-stone-500">Commestibilità</dt>
              <dd className="mt-1 text-stone-800">{s.edibility}</dd>
            </div>
          )}
          {s.notes && (
            <div>
              <dt className="font-medium text-stone-500">Note</dt>
              <dd className="mt-1 whitespace-pre-wrap text-stone-800">{s.notes}</dd>
            </div>
          )}
          {s.source && (
            <div>
              <dt className="font-medium text-stone-500">Fonte</dt>
              <dd className="mt-1 text-stone-800">{s.source}</dd>
            </div>
          )}
        </dl>
      </article>
    </main>
  );
}
