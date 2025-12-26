import Link from "next/link";

export default function NotFound() {
  return (
    <div className="rounded-2xl border border-black/10 bg-white/70 p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.03)] dark:border-white/10 dark:bg-zinc-950 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
      <h1 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
        Not found
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        That page doesn’t exist (or the article slug is missing).
      </p>
      <Link
        href="/"
        className="mt-4 inline-flex rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 hover:bg-black dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-white"
      >
        Back home
      </Link>
    </div>
  );
}


