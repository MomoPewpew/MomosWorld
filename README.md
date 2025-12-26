# Momo's World

A personal journal of creative projects: an infinite-ish feed of "article blocks" with tag + keyword filtering, and a standalone page per article.

## Tech

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Markdown articles with YAML frontmatter (stored in `content/articles/`)
- Local static media served from `public/` (audio/images)

## Local development (Docker)

You only need Docker + Docker Compose.

```bash
docker compose up --build
```

Then open `http://localhost:3000`.

## Deploy (GitHub Actions → SFTP)

This repo is configured to **build a static export** and **SFTP (SSH) deploy** it on pushes to `main`.

- **Output**: Next.js generates a static site in `out/` (via `output: "export"` in `next.config.mjs`)
- **Deploy**: GitHub Actions uploads `out/` to your server directory (default `/var/www/html/`)

### Required GitHub Secrets

Add these secrets in your GitHub repo settings:

- **SSH_HOST**: SSH/SFTP hostname (e.g. `example.com`)
- **SSH_USERNAME**: SSH username
- **SSH_PASSWORD**: SSH/SFTP password
- **SSH_PORT**: typically `22`

Optional (common for SFTP-chrooted accounts):

- **SSH_TARGET_DIR**: remote directory to upload into. Defaults to `.` (your SFTP landing directory).
  - If your host exposes `/var/www/html` inside the SFTP filesystem, set this to `/var/www/html`.

The workflow file is `/.github/workflows/deploy.yml`.

## Local development (without Docker)

```bash
npm install
npm run dev
```

## Adding an article

1. Create a new file in `content/articles/` named like `YYYY-MM-DD-your-slug.md`
2. Add frontmatter + body:

```md
---
title: "Tape Loops Study #3"
date: "2024-11-02"
slug: "tape-loops-study-3"
tags: ["audio", "tape", "ambient"]
summary: "Experimenting with spliced tape loops + re-amping."
assets:
  - type: "audio"
    src: "/media/tape-loops-3/loop-1.mp3"
    title: "Loop 1"
  - type: "image"
    src: "/media/tape-loops-3/rack.jpg"
    alt: "Rack setup"
---

Writeup goes here.
```

3. Put referenced media files under `public/` (e.g. `public/media/tape-loops-3/loop-1.mp3`).

## Routes

- `/` — landing page with article feed + filters
- `/articles/[slug]` — standalone article page


