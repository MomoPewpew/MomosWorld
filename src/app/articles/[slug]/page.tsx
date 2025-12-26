import { notFound } from "next/navigation";

import { AssetPlaylist } from "@/components/AssetPlaylist";
import { TagPill } from "@/components/TagPill";
import { getArticleBySlug } from "@/lib/articles";

export default async function ArticlePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let article;
  try {
    article = await getArticleBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <article className="space-y-6">
      <header className="space-y-3">
        <div className="text-xs text-zinc-600 dark:text-zinc-500">
          {article.meta.date}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          {article.meta.title}
        </h1>

        {article.meta.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.meta.tags.map((t) => (
              <TagPill key={t} tag={t} />
            ))}
          </div>
        )}

        {article.meta.summary && (
          <p className="max-w-2xl text-sm text-zinc-700 dark:text-zinc-300">
            {article.meta.summary}
          </p>
        )}
      </header>

      {article.meta.assets.length > 0 && (
        <section className="rounded-2xl border border-black/10 bg-white/70 p-5 shadow-[0_0_0_1px_rgba(0,0,0,0.03)] dark:border-white/10 dark:bg-zinc-950 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
          <AssetPlaylist assets={article.meta.assets} />
        </section>
      )}

      <section
        className="prose max-w-none prose-a:underline-offset-4 prose-pre:border prose-pre:bg-white/70 dark:prose-invert dark:prose-a:text-zinc-200 dark:prose-a:hover:text-white dark:prose-pre:border-zinc-800 dark:prose-pre:bg-zinc-900"
        dangerouslySetInnerHTML={{ __html: article.html }}
      />
    </article>
  );
}


