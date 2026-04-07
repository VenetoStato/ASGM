import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth-admin";
import { getSiteCopy } from "@/lib/db-public";
import type { SiteCopyResolved } from "@/lib/site-copy";
import {
  createAnnouncementAction,
  createEventAction,
  logoutFormAction,
  saveSiteCopyAction,
} from "./actions";

export const metadata = {
  title: "Organizzatori — Gruppo micologico Sandonatese",
  robots: { index: false, follow: false },
};

function Dashboard({ siteCopy }: { siteCopy: SiteCopyResolved }) {
  return (
    <div className="flex flex-col gap-10">
      <section className="rounded-2xl border border-emerald-200/80 bg-emerald-50/40 p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-emerald-950">
          Testi homepage
        </h2>
        <p className="mt-1 text-sm text-stone-600">
          Modifica titoli, introduzione e i blocchi informativi (visibili in
          home). Campo vuoto = testo predefinito del sito.
        </p>
        <form action={saveSiteCopyAction} className="mt-4 flex flex-col gap-3">
          <label className="text-sm font-medium text-stone-800">
            Titolo principale
            <input
              name="heroTitle"
              defaultValue={siteCopy.heroTitle}
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-base"
            />
          </label>
          <label className="text-sm font-medium text-stone-800">
            Sottotitolo (es. città)
            <input
              name="heroSubtitle"
              defaultValue={siteCopy.heroSubtitle}
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-base"
            />
          </label>
          <label className="text-sm font-medium text-stone-800">
            Introduzione in evidenza
            <textarea
              name="heroLead"
              defaultValue={siteCopy.heroLead}
              rows={3}
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-base"
            />
          </label>
          <label className="text-sm font-medium text-stone-800">
            Chi siamo
            <textarea
              name="chiSiamo"
              defaultValue={siteCopy.chiSiamo}
              rows={6}
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-base"
            />
          </label>
          <label className="text-sm font-medium text-stone-800">
            Pubblicazioni e materiali
            <textarea
              name="pubblicazioni"
              defaultValue={siteCopy.pubblicazioni}
              rows={5}
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-base"
            />
          </label>
          <label className="text-sm font-medium text-stone-800">
            Calendario e attività (testo)
            <textarea
              name="calendarioAttivita"
              defaultValue={siteCopy.calendarioAttivita}
              rows={4}
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-base"
            />
          </label>
          <label className="text-sm font-medium text-stone-800">
            Sostegno (5×1000, contributi)
            <textarea
              name="sostegno"
              defaultValue={siteCopy.sostegno}
              rows={5}
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-base"
            />
          </label>
          <button
            type="submit"
            className="rounded-xl bg-emerald-900 py-3 text-base font-medium text-white active:bg-emerald-950"
          >
            Salva testi homepage
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-emerald-950">
          Nuovo annuncio
        </h2>
        <p className="mt-1 text-sm text-stone-600">
          Testo e link immagini (una URL per riga). Puoi usare link pubblici a
          immagini (es. dopo upload).
        </p>
        <form action={createAnnouncementAction} className="mt-4 flex flex-col gap-3">
          <input
            name="title"
            placeholder="Titolo"
            className="rounded-lg border border-stone-300 px-3 py-3 text-base"
            required
          />
          <textarea
            name="body"
            placeholder="Testo dell&apos;annuncio"
            rows={5}
            className="rounded-lg border border-stone-300 px-3 py-3 text-base"
            required
          />
          <textarea
            name="images"
            placeholder="URL immagini (una per riga, opzionale)"
            rows={3}
            className="rounded-lg border border-stone-300 px-3 py-3 font-mono text-sm"
          />
          <label className="flex items-center gap-2 text-sm">
            <input name="publish" type="checkbox" defaultChecked />
            Pubblica subito
          </label>
          <button
            type="submit"
            className="rounded-xl bg-emerald-800 py-3 text-base font-medium text-white active:bg-emerald-900"
          >
            Salva annuncio
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-emerald-950">
          Nuova attività / data
        </h2>
        <form action={createEventAction} className="mt-4 flex flex-col gap-3">
          <input
            name="title"
            placeholder="Titolo (es. Uscita bosco)"
            className="rounded-lg border border-stone-300 px-3 py-3 text-base"
            required
          />
          <label className="text-sm text-stone-700">
            Data e ora inizio
            <input
              name="startsAt"
              type="datetime-local"
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-3 text-base"
              required
            />
          </label>
          <input
            name="location"
            placeholder="Luogo (opzionale)"
            className="rounded-lg border border-stone-300 px-3 py-3 text-base"
          />
          <textarea
            name="description"
            placeholder="Dettagli (opzionale)"
            rows={3}
            className="rounded-lg border border-stone-300 px-3 py-3 text-base"
          />
          <label className="flex items-center gap-2 text-sm">
            <input name="publish" type="checkbox" defaultChecked />
            Pubblica subito
          </label>
          <button
            type="submit"
            className="rounded-xl bg-emerald-800 py-3 text-base font-medium text-white active:bg-emerald-900"
          >
            Salva attività
          </button>
        </form>
      </section>

      <form action={logoutFormAction}>
        <button type="submit" className="text-sm text-stone-600 underline">
          Esci
        </button>
      </form>
    </div>
  );
}

type Props = {
  searchParams: Promise<{ err?: string; msg?: string }>;
};

export default async function OrganizzatoriPage({ searchParams }: Props) {
  const ok = await isAdminAuthenticated();
  const hasPassword = Boolean(process.env.ADMIN_PASSWORD);
  const sp = await searchParams;
  const err = sp.err;
  const msg = sp.msg;
  const siteCopy = await getSiteCopy();

  if (hasPassword && !ok) {
    redirect("/admin/login?next=/organizzatori");
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:py-12">
      <Link
        href="/"
        className="text-sm font-medium text-emerald-800 hover:underline"
      >
        ← Home
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-emerald-950 sm:text-3xl">
        Area organizzatori
      </h1>
      <p className="mt-2 text-sm text-stone-600">
        Testi della home, annunci con immagini e prossime attività. Serve la
        password concordata con gli organizzatori.
      </p>

      {err && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {err}
        </p>
      )}

      {msg === "annuncio-salvato" && (
        <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          Annuncio salvato.
        </p>
      )}
      {msg === "attivita-salvata" && (
        <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          Attività salvata.
        </p>
      )}
      {msg === "testi-salvati" && (
        <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          Testi homepage salvati.
        </p>
      )}

      {!hasPassword && (
        <p className="mt-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          L&apos;accesso per gli organizzatori non è ancora attivo sul server.
          Contatta chi gestisce il sito.
        </p>
      )}

      {hasPassword && ok && <Dashboard siteCopy={siteCopy} />}
    </main>
  );
}
