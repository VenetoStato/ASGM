import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth-admin";
import { createSpeciesAction } from "../../actions";
import { SpeciesForm } from "../species-form";

export const metadata = {
  title: "Nuova scheda fungo — Organizzatori",
  robots: { index: false, follow: false } as const,
};

type Props = {
  searchParams: Promise<{ err?: string }>;
};

export default async function NuovaSchedaPage({ searchParams }: Props) {
  const hasPassword = Boolean(process.env.ADMIN_PASSWORD);
  if (hasPassword && !(await isAdminAuthenticated())) {
    redirect("/admin/login?next=/organizzatori/schede/nuova");
  }

  const sp = await searchParams;
  const err = sp.err;

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:py-12">
      <Link
        href="/organizzatori"
        className="text-sm font-medium text-emerald-800 hover:underline"
      >
        ← Area organizzatori
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-emerald-950 sm:text-3xl">
        Nuova scheda fungo
      </h1>
      <p className="mt-2 text-sm text-stone-600">
        Testi e immagini che inserisci qui compaiono nella pagina pubblica{" "}
        <Link href="/funghi" className="text-emerald-800 underline">
          Schede funghi
        </Link>
        .
      </p>

      {err && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {err}
        </p>
      )}

      <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
        <SpeciesForm action={createSpeciesAction} />
      </div>
    </main>
  );
}
