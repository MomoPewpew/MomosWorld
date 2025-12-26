import Link from "next/link";

import type { ArticleMeta } from "@/lib/articles";
import { AssetPlaylist } from "@/components/AssetPlaylist";
import { TagPill } from "@/components/TagPill";

export function ArticleCard({
  meta
}: {
  meta: ArticleMeta;
}) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white/70 p-5 shadow-[0_0_0_1px_rgba(0,0,0,0.04)] transition hover:border-black/15 dark:border-white/10 dark:bg-zinc-950 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.04)] dark:hover:border-white/15">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-fuchsia-500/10 blur-2xl" />
        <div className="absolute -right-24 -bottom-24 h-56 w-56 rounded-full bg-teal-400/10 blur-2xl" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold leading-tight">
            <Link
              href={`/articles/${meta.slug}`}
              className="text-zinc-950 underline decoration-black/0 underline-offset-4 transition hover:decoration-black/30 dark:text-zinc-50 dark:decoration-white/0 dark:hover:decoration-white/35"
            >
              {meta.title}
            </Link>
          </h2>
          <div className="shrink-0 rounded-full border border-black/10 bg-white/50 px-2.5 py-1 text-xs text-zinc-600 dark:border-white/10 dark:bg-zinc-950/40 dark:text-zinc-400">
            {meta.date}
          </div>
        </div>

        {meta.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {meta.tags.map((t) => (
              <TagPill key={t} tag={t} href={`/?tag=${encodeURIComponent(t)}`} />
            ))}
          </div>
        )}

        {meta.summary && (
          <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300/90">
            {meta.summary}
          </p>
        )}
      </div>

      {meta.assets.length > 0 && (
        <div className="mt-4">
          <AssetPlaylist assets={meta.assets} />
        </div>
      )}
    </article>
  );
}


