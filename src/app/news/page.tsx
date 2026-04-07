import { listPublishedNews } from "@/lib/db-public";

function formatDate(d: Date | null) {
  if (!d) return "";
  return new Intl.DateTimeFormat("it-IT", {
    dateStyle: "medium",
  }).format(d);
}

export default async function NewsPage() {
  const items = await listPublishedNews();

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-12">
      <h1 className="text-3xl font-semibold text-emerald-950">News dal gruppo</h1>
      <p className="text-sm text-stone-600">
        Articoli e brevi dal gruppo, pubblicati quando disponibili.
      </p>
      {!items && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">
          Le news non sono disponibili al momento. Riprova più tardi.
        </p>
      )}
      {items && items.length === 0 && (
        <p className="text-stone-600">Nessuna news pubblicata.</p>
      )}
      {items && items.length > 0 && (
        <ul className="flex flex-col gap-6">
          {items.map((n) => (
            <li
              key={n.id}
              className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
            >
              {n.title && (
                <h2 className="text-xl font-semibold text-emerald-950">{n.title}</h2>
              )}
              <p className="mt-1 text-xs text-stone-500">
                {formatDate(n.publishedAt)}
              </p>
              <p className="mt-3 whitespace-pre-wrap text-stone-700">{n.body}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
