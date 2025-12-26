import { Suspense } from "react";

import { getAllArticleMetas, getAllTags } from "@/lib/articles";
import { HomeClient } from "@/components/HomeClient";

export default function Home() {
  const all = getAllArticleMetas();
  const tags = getAllTags();

  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="h-8 w-80 rounded-lg bg-black/5 dark:bg-white/10" />
          <div className="h-4 w-[32rem] rounded bg-black/5 dark:bg-white/10" />
          <div className="h-40 rounded-2xl border border-black/10 bg-white/70 shadow-[0_0_0_1px_rgba(0,0,0,0.03)] dark:border-white/10 dark:bg-zinc-950 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03)]" />
          <div className="space-y-4">
            <div className="h-24 rounded-2xl border border-black/10 bg-white/70 shadow-[0_0_0_1px_rgba(0,0,0,0.03)] dark:border-white/10 dark:bg-zinc-950 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03)]" />
            <div className="h-24 rounded-2xl border border-black/10 bg-white/70 shadow-[0_0_0_1px_rgba(0,0,0,0.03)] dark:border-white/10 dark:bg-zinc-950 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03)]" />
          </div>
        </div>
      }
    >
      <HomeClient all={all} tags={tags} />
    </Suspense>
  );
}


