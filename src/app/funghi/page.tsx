import Link from "next/link";
import { listSpecies } from "@/lib/db-public";

export default async function FunghiPage() {
  const species = await listSpecies();

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-12">
      <h1 className="text-3xl font-semibold text-emerald-950">Funghi</h1>
      {!species && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">
          Database non configurato o non raggiungibile. Imposta{" "}
          <code className="rounded bg-amber-100 px-1">DATABASE_URL</code> su Vercel.
        </p>
      )}
      {species && species.length === 0 && (
        <p className="text-stone-600">
          Nessuna scheda. Aggiungi specie tramite{" "}
          <code className="rounded bg-stone-200 px-1 text-sm">/api/ingest</code>.
        </p>
      )}
      {species && species.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2">
          {species.map((s) => (
            <li key={s.id}>
              <Link
                href={`/funghi/${s.id}`}
                className="block rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition hover:border-emerald-700/30"
              >
                <span className="font-medium text-emerald-900">{s.name}</span>
                {s.scientificName && (
                  <span className="mt-1 block text-sm italic text-stone-500">
                    {s.scientificName}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
