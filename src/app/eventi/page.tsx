import { listPublishedEvents } from "@/lib/db-public";

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("it-IT", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(d);
}

export default async function EventiPage() {
  const events = await listPublishedEvents();

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-12">
      <h1 className="text-3xl font-semibold text-emerald-950">Eventi</h1>
      {!events && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">
          Il calendario non è disponibile al momento. Riprova più tardi.
        </p>
      )}
      {events && events.length === 0 && (
        <p className="text-stone-600">
          Nessun evento in elenco. Gli organizzatori possono aggiungere date
          dall&apos;area riservata.
        </p>
      )}
      {events && events.length > 0 && (
        <ul className="flex flex-col gap-4">
          {events.map((ev) => (
            <li
              key={ev.id}
              className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-emerald-950">{ev.title}</h2>
              <p className="mt-2 text-sm text-stone-500">
                {formatDate(ev.startsAt)}
                {ev.endsAt ? ` — ${formatDate(ev.endsAt)}` : ""}
              </p>
              {ev.location && (
                <p className="mt-1 text-stone-700">{ev.location}</p>
              )}
              {ev.description && (
                <p className="mt-3 whitespace-pre-wrap text-stone-600">
                  {ev.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
