import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth-admin";
import { getPrisma } from "@/lib/prisma";
import { updateSpeciesAction } from "../../actions";
import { DeleteSpeciesButton } from "../delete-species-button";
import { SpeciesForm } from "../species-form";

export const metadata = {
  title: "Modifica scheda fungo — Organizzatori",
  robots: { index: false, follow: false } as const,
};

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ err?: string; msg?: string }>;
};

export default async function ModificaSchedaPage({ params, searchParams }: Props) {
  const { id } = await params;
  const hasPassword = Boolean(process.env.ADMIN_PASSWORD);
  if (hasPassword && !(await isAdminAuthenticated())) {
    redirect(
      `/admin/login?next=${encodeURIComponent(`/organizzatori/schede/${id}`)}`,
    );
  }

  const prisma = getPrisma();
  const species = await prisma.species.findUnique({ where: { id } });
  if (!species) notFound();

  const sp = await searchParams;
  const err = sp.err;
  const msg = sp.msg;

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:py-12">
      <Link
        href="/organizzatori"
        className="text-sm font-medium text-emerald-800 hover:underline"
      >
        ← Area organizzatori
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-emerald-950 sm:text-3xl">
        Modifica scheda
      </h1>
      <p className="mt-1 text-sm text-stone-600">
        <Link
          href={`/funghi/${id}`}
          className="text-emerald-800 underline"
          target="_blank"
          rel="noreferrer"
        >
          Anteprima pubblica
        </Link>
      </p>

      {err && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {err}
        </p>
      )}
      {msg === "salvata" && (
        <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          Scheda salvata.
        </p>
      )}

      <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
        <SpeciesForm action={updateSpeciesAction} species={species} />
        <DeleteSpeciesButton id={species.id} />
      </div>
    </main>
  );
}
