import type { Species } from "@/generated/prisma/client";

function val(s: string | null | undefined) {
  return s ?? "";
}

export function SpeciesForm({
  action,
  species,
}: {
  action: (formData: FormData) => Promise<void>;
  species?: Species | null;
}) {
  const d = species;

  return (
    <form action={action} className="flex flex-col gap-3">
      {d?.id ? <input type="hidden" name="id" value={d.id} /> : null}
      <label className="text-sm font-medium text-stone-800">
        Nome comune (obbligatorio)
        <input
          name="name"
          required
          defaultValue={val(d?.name)}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-base"
        />
      </label>
      <label className="text-sm font-medium text-stone-800">
        Nome scientifico
        <input
          name="scientificName"
          defaultValue={val(d?.scientificName)}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-base"
          placeholder="es. Boletus edulis"
        />
      </label>
      <label className="text-sm font-medium text-stone-800">
        Sinonimi / note tassonomiche
        <input
          name="synonyms"
          defaultValue={val(d?.synonyms)}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-base"
        />
      </label>
      <label className="text-sm font-medium text-stone-800">
        Habitat
        <textarea
          name="habitat"
          rows={3}
          defaultValue={val(d?.habitat)}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-base"
        />
      </label>
      <label className="text-sm font-medium text-stone-800">
        Commestibilità
        <textarea
          name="edibility"
          rows={2}
          defaultValue={val(d?.edibility)}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-base"
        />
      </label>
      <label className="text-sm font-medium text-stone-800">
        Descrizione e note (testo libero)
        <textarea
          name="notes"
          rows={8}
          defaultValue={val(d?.notes)}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-base"
        />
      </label>
      <label className="text-sm font-medium text-stone-800">
        URL immagine (https…)
        <input
          name="imageUrl"
          type="url"
          defaultValue={val(d?.imageUrl)}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 font-mono text-sm"
          placeholder="https://…"
        />
      </label>
      <label className="text-sm font-medium text-stone-800">
        Attribuzione immagine (autore / licenza)
        <textarea
          name="imageAttribution"
          rows={2}
          defaultValue={val(d?.imageAttribution)}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
      </label>
      <label className="text-sm font-medium text-stone-800">
        Fonte (etichetta breve)
        <input
          name="sourceName"
          defaultValue={val(d?.sourceName)}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-base"
          placeholder="es. Gruppo micologico"
        />
      </label>
      <label className="text-sm font-medium text-stone-800">
        Link fonte
        <input
          name="sourceUrl"
          type="url"
          defaultValue={val(d?.sourceUrl)}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 font-mono text-sm"
        />
      </label>
      <label className="text-sm font-medium text-stone-800">
        Riferimento interno (opzionale)
        <input
          name="source"
          defaultValue={val(d?.source)}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 font-mono text-sm"
        />
      </label>
      <button
        type="submit"
        className="mt-2 rounded-xl bg-emerald-900 py-3 text-base font-medium text-white active:bg-emerald-950"
      >
        {d?.id ? "Salva modifiche" : "Crea scheda"}
      </button>
    </form>
  );
}
