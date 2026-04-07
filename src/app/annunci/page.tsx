import Link from "next/link";
import {
  ContentCard,
  EmptyState,
  Section,
  SectionHeader,
} from "@/components/ui/section";
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
    <main className="flex flex-1 flex-col">
      <Section band="paper" className="pt-8 sm:pt-12">
        <Link
          href="/"
          className="text-sm font-semibold text-emerald-800 hover:underline"
        >
          ← Home
        </Link>
        <div className="mt-4">
          <SectionHeader title="Annunci" />
        </div>
        <div className="mt-8">
          {!items && (
            <EmptyState title="Gli annunci non sono disponibili al momento." />
          )}
          {items && items.length === 0 && (
            <EmptyState title="Nessun annuncio ancora." />
          )}
          {items && items.length > 0 && (
            <ul className="flex flex-col gap-8">
              {items.map((a) => {
                const imgs = parseImages(a.images);
                return (
                  <li key={a.id}>
                    <ContentCard className="overflow-hidden p-0" hover={false}>
                      <div className="p-6 sm:p-8">
                        <h2 className="text-xl font-semibold text-emerald-950">
                          {a.title}
                        </h2>
                        <p className="mt-1 text-xs text-stone-500">
                          {formatDate(a.publishedAt)}
                        </p>
                        <p className="mt-4 whitespace-pre-wrap text-stone-800">
                          {a.body}
                        </p>
                      </div>
                      {imgs.length > 0 && (
                        <div className="grid grid-cols-1 gap-3 border-t border-stone-100 bg-stone-50/50 p-6 sm:grid-cols-2">
                          {imgs.map((src) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              key={src}
                              src={src}
                              alt=""
                              className="max-h-72 w-full rounded-xl object-cover shadow-sm"
                              loading="lazy"
                            />
                          ))}
                        </div>
                      )}
                    </ContentCard>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Section>
    </main>
  );
}
