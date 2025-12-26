import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

export type ArticleAsset =
  | {
      type: "audio";
      src: string;
      title?: string;
    }
  | {
      type: "image";
      src: string;
      alt?: string;
      title?: string;
    };

export type ArticleMeta = {
  title: string;
  date: string; // ISO-ish string
  slug: string;
  tags: string[];
  summary?: string;
  assets: ArticleAsset[];
};

export type Article = {
  meta: ArticleMeta;
  html: string;
  contentText: string;
};

function articlesDir() {
  return path.join(process.cwd(), "content", "articles");
}

function listArticleFiles(): string[] {
  const dir = articlesDir();
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((f) => path.join(dir, f));
}

function normalizeSlugFromFilename(filePath: string) {
  const base = path.basename(filePath).replace(/\.(md|mdx)$/i, "");
  // allow `YYYY-MM-DD-slug` but also plain `slug`
  const m = base.match(/^\d{4}-\d{2}-\d{2}-(.+)$/);
  return m?.[1] ?? base;
}

function parseMeta(filePath: string): { meta: ArticleMeta; content: string } {
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);
  const data = parsed.data as Partial<ArticleMeta> & {
    assets?: unknown;
    tags?: unknown;
  };

  const title = typeof data.title === "string" ? data.title : undefined;
  if (!title) throw new Error(`Missing frontmatter "title" in ${filePath}`);

  const date = typeof data.date === "string" ? data.date : undefined;
  if (!date) throw new Error(`Missing frontmatter "date" in ${filePath}`);

  const slug =
    typeof data.slug === "string" && data.slug.length > 0
      ? data.slug
      : normalizeSlugFromFilename(filePath);

  const tags = Array.isArray(data.tags)
    ? data.tags.filter((t): t is string => typeof t === "string")
    : [];

  const assets: ArticleAsset[] = Array.isArray(data.assets)
    ? (data.assets as any[])
        .map((a): ArticleAsset | null => {
          if (!a || typeof a !== "object") return null;
          const type = (a as any).type;
          const src = (a as any).src;
          if (type !== "audio" && type !== "image") return null;
          if (typeof src !== "string") return null;

          const title2 =
            typeof (a as any).title === "string" ? (a as any).title : undefined;

          if (type === "audio") return { type, src, title: title2 };

          const alt =
            typeof (a as any).alt === "string" ? (a as any).alt : undefined;
          return { type, src, alt, title: title2 };
        })
        .filter((x): x is ArticleAsset => x !== null)
    : [];

  const summary = typeof data.summary === "string" ? data.summary : undefined;

  return {
    meta: { title, date, slug, tags, summary, assets },
    content: parsed.content
  };
}

export function getAllArticleMetas(): ArticleMeta[] {
  const metas = listArticleFiles().map((filePath) => parseMeta(filePath).meta);
  return metas.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  for (const m of getAllArticleMetas()) {
    for (const t of m.tags) tagSet.add(t);
  }
  return [...tagSet].sort((a, b) => a.localeCompare(b));
}

export async function getArticleBySlug(slug: string): Promise<Article> {
  const files = listArticleFiles();
  for (const filePath of files) {
    const { meta, content } = parseMeta(filePath);
    if (meta.slug !== slug && normalizeSlugFromFilename(filePath) !== slug) continue;

    const html = String(await remark().use(remarkHtml).process(content));
    const contentText = content.replace(/\s+/g, " ").trim();
    return { meta, html, contentText };
  }

  throw new Error(`Article not found: ${slug}`);
}


