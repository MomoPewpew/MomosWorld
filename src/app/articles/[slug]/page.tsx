import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AssetPlaylist } from "@/components/AssetPlaylist";
import { TagPill } from "@/components/TagPill";
import { getAllArticleMetas, getArticleBySlug } from "@/lib/articles";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllArticleMetas().map((m) => ({ slug: m.slug }));
}

function firstOgImage(meta: Awaited<ReturnType<typeof getArticleBySlug>>["meta"]) {
  const img = meta.assets.find((a) => a.type === "image");
  if (!img) return undefined;
  const url = img.src;
  const ext = (url.split(".").pop() ?? "").toLowerCase();
  const type =
    ext === "png"
      ? "image/png"
      : ext === "jpg" || ext === "jpeg"
        ? "image/jpeg"
        : ext === "webp"
          ? "image/webp"
          : ext === "gif"
            ? "image/gif"
            : ext === "svg"
              ? "image/svg+xml"
              : undefined;

  return {
    url,
    alt: img.alt ?? meta.title,
    type
  };
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const article = await getArticleBySlug(slug);
    const image = firstOgImage(article.meta);

    return {
      title: `${article.meta.title} • Momo’s World`,
      description: article.meta.summary,
      openGraph: {
        title: article.meta.title,
        description: article.meta.summary,
        type: "article",
        url: `/articles/${article.meta.slug}/`,
        images: image ? [image] : undefined
      },
      twitter: {
        card: image ? "summary_large_image" : "summary",
        title: article.meta.title,
        description: article.meta.summary,
        images: image ? [image.url] : undefined
      }
    };
  } catch {
    return {
      title: "Not found • Momo’s World"
    };
  }
}

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
              <TagPill key={t} tag={t} href={`/?tag=${encodeURIComponent(t)}`} />
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


