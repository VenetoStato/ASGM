import Link from "next/link";
import { listPublishedAnnouncements } from "@/lib/db-public";

function parseImages(raw: unknown): string[] {
  if (!raw || !Array.isArray(raw)) return [];
  return raw.filter((x): x is string => typeof x === "string");
}

function formatDate(d: Date | null) {
  if (!d) return "";
  return new Intl.DateTimeFormat("it-IT", {
    dateStyle: "long",
  }).format(d);
}

export default async function AnnunciPage() {
  const items = await listPublishedAnnouncements(50);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:py-12">
      <Link
        href="/"
        className="text-sm font-medium text-emerald-800 hover:underline"
      >
        ← Home
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-emerald-950 sm:text-3xl">
        Annunci
      </h1>
      {!items && (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900">
          Gli annunci non sono disponibili al momento.
        </p>
      )}
      {items && items.length === 0 && (
        <p className="mt-6 text-stone-600">Nessun annuncio ancora.</p>
      )}
      {items && items.length > 0 && (
        <ul className="mt-8 flex flex-col gap-10">
          {items.map((a) => {
            const imgs = parseImages(a.images);
            return (
              <li
                key={a.id}
                className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6"
              >
                <h2 className="text-xl font-semibold text-emerald-950">
                  {a.title}
                </h2>
                <p className="mt-1 text-xs text-stone-500">
                  {formatDate(a.publishedAt)}
                </p>
                <p className="mt-4 whitespace-pre-wrap text-stone-800">
                  {a.body}
                </p>
                {imgs.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {imgs.map((src) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={src}
                        src={src}
                        alt=""
                        className="max-h-64 w-full rounded-lg object-cover"
                        loading="lazy"
                      />
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
