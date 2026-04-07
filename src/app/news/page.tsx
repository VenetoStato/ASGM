import type { Metadata } from "next";
import {
  ContentCard,
  EmptyState,
  Section,
  SectionHeader,
} from "@/components/ui/section";
import { pageMetadata } from "@/lib/seo-config";
import { listPublishedNews } from "@/lib/db-public";

export const metadata: Metadata = pageMetadata({
  title: "News",
  description:
    "Articoli e brevi dal Gruppo Micologico Culturale Sandonatese: notizie, approfondimenti e materiali pubblicati sul sito.",
  path: "/news",
});

function formatDate(d: Date | null) {
  if (!d) return "";
  return new Intl.DateTimeFormat("it-IT", {
    dateStyle: "medium",
  }).format(d);
}

export default async function NewsPage() {
  const items = await listPublishedNews();

  return (
    <main className="flex flex-1 flex-col">
      <Section band="paper" className="pt-10 sm:pt-14">
        <SectionHeader
          title="News dal gruppo"
          description="Articoli e brevi pubblicati quando disponibili."
        />
        <div className="mt-8">
          {!items && (
            <EmptyState title="Le news non sono disponibili al momento." />
          )}
          {items && items.length === 0 && (
            <EmptyState title="Nessuna news pubblicata." />
          )}
          {items && items.length > 0 && (
            <ul className="flex flex-col gap-6">
              {items.map((n) => (
                <li key={n.id}>
                  <ContentCard hover={false}>
                    {n.title && (
                      <h2 className="text-xl font-semibold text-emerald-950">
                        {n.title}
                      </h2>
                    )}
                    <p className="mt-1 text-xs text-stone-500">
                      {formatDate(n.publishedAt)}
                    </p>
                    <p className="mt-4 whitespace-pre-wrap text-stone-700">
                      {n.body}
                    </p>
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
