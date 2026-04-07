import {
  ContentCard,
  EmptyState,
  Section,
  SectionHeader,
} from "@/components/ui/section";
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
    <main className="flex flex-1 flex-col">
      <Section band="paper" className="pt-10 sm:pt-14">
        <SectionHeader
          title="Calendario eventi"
          description="Uscite, incontri e attività pubblicate dal gruppo."
        />
        <div className="mt-8">
          {!events && (
            <EmptyState title="Calendario non disponibile al momento." />
          )}
          {events && events.length === 0 && (
            <EmptyState title="Nessun evento in elenco.">
              Gli organizzatori possono aggiungere date dall&apos;area riservata.
            </EmptyState>
          )}
          {events && events.length > 0 && (
            <ul className="flex flex-col gap-4">
              {events.map((ev) => (
                <li key={ev.id}>
                  <ContentCard hover={false}>
                    <h2 className="text-xl font-semibold text-emerald-950">
                      {ev.title}
                    </h2>
                    <p className="mt-2 text-sm text-stone-500">
                      {formatDate(ev.startsAt)}
                      {ev.endsAt ? ` — ${formatDate(ev.endsAt)}` : ""}
                    </p>
                    {ev.location && (
                      <p className="mt-2 text-stone-700">{ev.location}</p>
                    )}
                    {ev.description && (
                      <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-stone-600">
                        {ev.description}
                      </p>
                    )}
                  </ContentCard>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Section>
    </main>
  );
}
