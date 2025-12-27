"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import type { ArticleMeta } from "@/lib/articles";
import { ArticleCard } from "@/components/ArticleCard";
import { TagPill } from "@/components/TagPill";

function buildHref({
  tags,
  q
}: {
  tags?: string[];
  q?: string;
}) {
  const sp = new URLSearchParams();
  for (const t of tags ?? []) sp.append("tag", t);
  if (q) sp.set("q", q);
  const qs = sp.toString();
  return qs ? `/?${qs}` : "/";
}

export function HomeClient({
  all,
  tags
}: {
  all: ArticleMeta[];
  tags: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedTags = useMemo(() => {
    const raw = searchParams
      .getAll("tag")
      .map((t) => t.trim())
      .filter(Boolean);
    return Array.from(new Set(raw)).sort((a, b) => a.localeCompare(b));
  }, [searchParams]);
  const q = (searchParams.get("q") ?? "").trim();

  const [draftQ, setDraftQ] = useState(q);

  const filtered = useMemo(() => {
    const qLower = q.toLowerCase();
    return all.filter((a) => {
      if (selectedTags.length > 0) {
        const hasAny = selectedTags.some((t) => a.tags.includes(t));
        if (!hasAny) return false;
      }
      if (!qLower) return true;
      const haystack = [a.title, a.summary ?? "", a.tags.join(" ")]
        .join(" ")
        .toLowerCase();
      return haystack.includes(qLower);
    });
  }, [all, q, selectedTags]);

  const toggleTag = (t: string) => {
    const set = new Set(selectedTags);
    if (set.has(t)) set.delete(t);
    else set.add(t);
    return [...set].sort((a, b) => a.localeCompare(b));
  };

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Creative projects, documented
        </h1>
        <p className="max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
          This is a feed of article blocks. Filter by tags and keyword search.
          Click an article title to open the standalone page.
        </p>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white/70 p-5 shadow-[0_0_0_1px_rgba(0,0,0,0.03)] dark:border-white/10 dark:bg-zinc-950 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
        <form
          className="flex flex-col gap-4 sm:flex-row sm:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            router.push(
              buildHref({
                tags: selectedTags.length ? selectedTags : undefined,
                q: draftQ || undefined
              })
            );
          }}
        >
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Keyword
            </label>
            <input
              value={draftQ}
              onChange={(e) => setDraftQ(e.target.value)}
              placeholder="Search titles, tags, summaries…"
              className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-black/20 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-white/20"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 hover:bg-black dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-white"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={() => {
                setDraftQ("");
                router.push("/");
              }}
              className="rounded-lg border border-black/10 bg-white/60 px-4 py-2 text-sm text-zinc-800 hover:border-black/20 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-white/20"
            >
              Clear
            </button>
          </div>
        </form>

        {tags.length > 0 && (
          <div className="mt-4">
            <div className="mb-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Tags
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <TagPill
                  key={t}
                  tag={t}
                  href={buildHref({
                    tags: toggleTag(t),
                    q: q || undefined
                  })}
                  selected={selectedTags.includes(t)}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Showing{" "}
            <span className="font-medium text-zinc-900 dark:text-zinc-200">
              {filtered.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-zinc-900 dark:text-zinc-200">
              {all.length}
            </span>
          </div>
          {(selectedTags.length > 0 || q) && (
            <div className="text-xs text-zinc-500 dark:text-zinc-500">
              Filters:{" "}
              {selectedTags.length > 0 && (
                <span className="text-zinc-700 dark:text-zinc-300">
                  tags=
                  <span className="font-medium">
                    {selectedTags.join(", ")}
                  </span>{" "}
                </span>
              )}
              {q && (
                <span className="text-zinc-700 dark:text-zinc-300">
                  q=<span className="font-medium">{q}</span>
                </span>
              )}
            </div>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-black/10 bg-white/70 p-6 text-sm text-zinc-600 shadow-[0_0_0_1px_rgba(0,0,0,0.03)] dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-400 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
            No articles match your filters yet.
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((m) => (
              <ArticleCard
                key={m.slug}
                meta={m}
                selectedTags={selectedTags}
                q={q}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}


