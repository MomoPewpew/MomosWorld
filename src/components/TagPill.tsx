import Link from "next/link";

function hashString(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h;
}

const PALETTE = [
  {
    base: "border-fuchsia-500/25 bg-fuchsia-500/10 text-fuchsia-950 hover:bg-fuchsia-500/14 dark:border-fuchsia-500/20 dark:bg-fuchsia-500/10 dark:text-fuchsia-100 dark:hover:bg-fuchsia-500/14",
    selected:
      "border-fuchsia-600/35 bg-fuchsia-500/20 text-fuchsia-950 dark:border-fuchsia-300/40 dark:bg-fuchsia-300/20 dark:text-zinc-50"
  },
  {
    base: "border-teal-600/25 bg-teal-500/10 text-teal-950 hover:bg-teal-500/14 dark:border-teal-500/20 dark:bg-teal-500/10 dark:text-teal-100 dark:hover:bg-teal-500/14",
    selected:
      "border-teal-700/30 bg-teal-500/18 text-teal-950 dark:border-teal-300/40 dark:bg-teal-300/20 dark:text-zinc-50"
  },
  {
    base: "border-sky-600/25 bg-sky-500/10 text-sky-950 hover:bg-sky-500/14 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-100 dark:hover:bg-sky-500/14",
    selected:
      "border-sky-700/30 bg-sky-500/18 text-sky-950 dark:border-sky-300/40 dark:bg-sky-300/20 dark:text-zinc-50"
  },
  {
    base: "border-rose-600/25 bg-rose-500/10 text-rose-950 hover:bg-rose-500/14 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-100 dark:hover:bg-rose-500/14",
    selected:
      "border-rose-700/30 bg-rose-500/18 text-rose-950 dark:border-rose-300/40 dark:bg-rose-300/20 dark:text-zinc-50"
  },
  {
    base: "border-amber-600/25 bg-amber-500/10 text-amber-950 hover:bg-amber-500/14 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-100 dark:hover:bg-amber-500/14",
    selected:
      "border-amber-700/30 bg-amber-500/18 text-amber-950 dark:border-amber-300/40 dark:bg-amber-300/20 dark:text-zinc-50"
  }
] as const;

export function TagPill({
  tag,
  href,
  selected
}: {
  tag: string;
  href: string;
  selected?: boolean;
}) {
  const palette = PALETTE[hashString(tag) % PALETTE.length];
  return (
    <Link
      href={href}
      className={[
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.02)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
        selected
          ? `${palette.selected} ring-1 ring-white/10 dark:ring-white/10`
          : `${palette.base} hover:border-white/20 dark:hover:border-white/20`
      ].join(" ")}
    >
      <span className="opacity-80">#</span>
      {tag}
    </Link>
  );
}


