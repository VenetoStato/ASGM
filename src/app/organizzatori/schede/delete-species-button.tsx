"use client";

import { deleteSpeciesAction } from "../actions";

export function DeleteSpeciesButton({ id }: { id: string }) {
  return (
    <form
      action={deleteSpeciesAction}
      onSubmit={(e) => {
        if (
          !confirm(
            "Eliminare definitivamente questa scheda? L’azione non è annullabile.",
          )
        ) {
          e.preventDefault();
        }
      }}
      className="mt-8 border-t border-stone-200 pt-6"
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-100"
      >
        Elimina scheda
      </button>
    </form>
  );
}
