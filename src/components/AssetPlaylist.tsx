import type { ArticleAsset } from "@/lib/articles";

export function AssetPlaylist({ assets }: { assets: ArticleAsset[] }) {
  if (!assets.length) return null;

  const audio = assets.filter((a) => a.type === "audio");
  const images = assets.filter((a) => a.type === "image");

  return (
    <div className="space-y-4">
      {audio.length > 0 && (
        <div className="space-y-3">
          <div className="text-xs font-medium tracking-wide text-zinc-600 dark:text-zinc-400">
            Audio
          </div>
          <ul className="space-y-3">
            {audio.map((a) => (
              <li
                key={a.src}
                className="rounded-xl border border-black/10 bg-white/60 p-3 shadow-[0_0_0_1px_rgba(0,0,0,0.03)] dark:border-white/10 dark:bg-zinc-950/30 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03)]"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-zinc-950 dark:text-zinc-100">
                    {a.title ?? a.src.split("/").pop()}
                  </div>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-500">
                    {(a.src.split(".").pop() ?? "").toLowerCase()}
                  </div>
                </div>
                <div className="rounded-lg border border-black/10 bg-white/60 p-2 dark:border-white/10 dark:bg-zinc-950/40">
                  <audio controls preload="none" className="w-full">
                    <source src={a.src} />
                  </audio>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {images.length > 0 && (
        <div className="space-y-3">
          <div className="text-xs font-medium tracking-wide text-zinc-600 dark:text-zinc-400">
            Images
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {images.map((img) => (
              <figure
                key={img.src}
                className="overflow-hidden rounded-xl border border-black/10 bg-white/60 shadow-[0_0_0_1px_rgba(0,0,0,0.03)] dark:border-white/10 dark:bg-zinc-950/30 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03)]"
                suppressHydrationWarning
              >
                <div className="relative aspect-[4/3]">
                  <img
                    src={img.src}
                    alt={img.alt ?? ""}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                    suppressHydrationWarning
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0 dark:from-black/40" />
                </div>
                {(img.title ?? img.alt) && (
                  <figcaption className="px-3 py-2 text-xs text-zinc-600 dark:text-zinc-400">
                    {img.title ?? img.alt}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


