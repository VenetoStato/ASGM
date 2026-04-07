import Link from "next/link";
import { loginFormAction } from "@/app/organizzatori/actions";

export const metadata = {
  title: "Accesso organizzatori",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const sp = await searchParams;
  const err = sp.error;
  const nextRaw = sp.next ?? "/organizzatori";
  const next =
    nextRaw.startsWith("/") && !nextRaw.startsWith("//")
      ? nextRaw
      : "/organizzatori";

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md flex-1 flex-col justify-center px-4 py-10">
      <Link
        href="/"
        className="text-sm font-medium text-emerald-800 hover:underline"
      >
        ← Home
      </Link>
      <div className="mt-6 rounded-2xl border border-stone-200/90 bg-white p-6 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] ring-1 ring-stone-900/[0.04] sm:p-8">
        <h1 className="text-xl font-bold text-emerald-950 sm:text-2xl">
          Accesso organizzatori
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Inserisci la password fornita agli organizzatori del gruppo.
        </p>

        {err && (
          <p className="mt-4 rounded-xl border border-red-200/80 bg-red-50 px-4 py-3 text-sm text-red-900">
            {err}
          </p>
        )}

        <form action={loginFormAction} className="mt-6 flex flex-col gap-4">
          <input type="hidden" name="next" value={next} />
          <label className="text-sm font-semibold text-stone-800">
            Password
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              className="mt-2 w-full rounded-xl border border-stone-300 bg-stone-50/50 px-4 py-3 text-base outline-none ring-emerald-800/20 transition focus:border-emerald-500 focus:bg-white focus:ring-2"
              required
              autoFocus
            />
          </label>
          <button
            type="submit"
            className="rounded-xl bg-emerald-800 px-4 py-3.5 text-base font-semibold text-white shadow-md shadow-emerald-950/20 transition hover:bg-emerald-900 active:scale-[0.99]"
          >
            Entra
          </button>
        </form>
      </div>
    </main>
  );
}
