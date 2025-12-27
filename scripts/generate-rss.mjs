import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

function articlesDir() {
  return path.join(process.cwd(), "content", "articles");
}

function outDir() {
  return path.join(process.cwd(), "out");
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc2822Date(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return new Date().toUTCString();
  return d.toUTCString();
}

function normalizeSlugFromFilename(filePath) {
  const base = path.basename(filePath).replace(/\.(md|mdx)$/i, "");
  const m = base.match(/^\d{4}-\d{2}-\d{2}-(.+)$/);
  return m?.[1] ?? base;
}

function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "";
  const trimmed = raw.trim().replace(/\/+$/, "");
  return trimmed || "http://localhost:3000";
}

function slugifyTag(tag) {
  return tag
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}

function readAllArticles() {
  const dir = articlesDir();
  if (!fs.existsSync(dir)) return [];

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((f) => path.join(dir, f));

  const articles = files.map((filePath) => {
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = matter(raw);
    const data = parsed.data ?? {};

    const title = typeof data.title === "string" ? data.title : "";
    const date = typeof data.date === "string" ? data.date : "";
    const slug =
      typeof data.slug === "string" && data.slug.length > 0
        ? data.slug
        : normalizeSlugFromFilename(filePath);
    const summary = typeof data.summary === "string" ? data.summary : "";
    const tags = Array.isArray(data.tags)
      ? data.tags.filter((t) => typeof t === "string")
      : [];

    return {
      title,
      date,
      slug,
      summary,
      tags
    };
  });

  // newest first (ISO YYYY-MM-DD sorts lexicographically)
  articles.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return articles;
}

function buildRss({
  siteUrl,
  feedPath,
  title,
  description,
  items
}) {
  const now = new Date().toUTCString();
  const feedUrl = `${siteUrl}${feedPath}`;

  const itemXml = items
    .map((it) => {
      const url = `${siteUrl}/articles/${it.slug}/`;
      return [
        "<item>",
        `  <title>${escapeXml(it.title)}</title>`,
        `  <link>${escapeXml(url)}</link>`,
        `  <guid isPermaLink="true">${escapeXml(url)}</guid>`,
        it.summary ? `  <description>${escapeXml(it.summary)}</description>` : "",
        it.date ? `  <pubDate>${escapeXml(toRfc2822Date(it.date))}</pubDate>` : "",
        it.tags?.length
          ? it.tags.map((t) => `  <category>${escapeXml(t)}</category>`).join("\n")
          : "",
        "</item>"
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${escapeXml(title)}</title>
  <link>${escapeXml(siteUrl)}</link>
  <description>${escapeXml(description)}</description>
  <language>en</language>
  <lastBuildDate>${escapeXml(now)}</lastBuildDate>
  <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
${itemXml ? "  " + itemXml.replace(/\n/g, "\n  ") : ""}
</channel>
</rss>
`;
}

function writeFile(relPath, contents) {
  const p = path.join(outDir(), relPath);
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, contents);
}

function main() {
  const siteUrl = getSiteUrl();
  const articles = readAllArticles();

  if (!fs.existsSync(outDir())) {
    console.error(
      "Expected ./out to exist (run `next build` with output: 'export' first)."
    );
    process.exit(1);
  }

  // Main feed
  writeFile(
    "rss.xml",
    buildRss({
      siteUrl,
      feedPath: "/rss.xml",
      title: "Momo’s World",
      description: "Creative projects, documented.",
      items: articles
    })
  );

  // Per-tag feeds (OR is irrelevant; feed per single tag)
  const tagSet = new Set();
  for (const a of articles) for (const t of a.tags) tagSet.add(t);

  const tags = [...tagSet].sort((a, b) => a.localeCompare(b));
  for (const tag of tags) {
    const tagSlug = slugifyTag(tag);
    if (!tagSlug) continue;
    const tagItems = articles.filter((a) => a.tags.includes(tag));

    writeFile(
      `rss/tags/${tagSlug}.xml`,
      buildRss({
        siteUrl,
        feedPath: `/rss/tags/${tagSlug}.xml`,
        title: `Momo’s World — #${tag}`,
        description: `Articles tagged “${tag}”.`,
        items: tagItems
      })
    );
  }

  console.log(
    `RSS generated: out/rss.xml and ${tags.length} tag feed(s) in out/rss/tags/`
  );
}

main();


