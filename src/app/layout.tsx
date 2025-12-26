import type { Metadata } from "next";

import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Momo’s World",
  description: "A journal of creative projects over the years."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <div className="min-h-dvh">
            <header className="sticky top-0 z-20 border-b border-black/10 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-zinc-950/65">
              <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl border border-black/10 bg-gradient-to-br from-fuchsia-500/35 via-white to-teal-400/25 shadow-[0_0_0_1px_rgba(0,0,0,0.05)] dark:border-white/10 dark:from-fuchsia-500/40 dark:via-zinc-900 dark:to-teal-400/30 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06)]" />
                  <div className="leading-tight">
                    <div className="text-sm font-semibold tracking-wide text-zinc-950 dark:text-zinc-50">
                      Momo’s World
                    </div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">
                      playful, quiet, crafted
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden text-xs text-zinc-600 dark:text-zinc-500 sm:block">
                    journal of creative projects
                  </div>
                  <ThemeToggle />
                </div>
              </div>
            </header>
            <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
            <footer className="mx-auto max-w-5xl px-6 pb-12 pt-6 text-xs text-zinc-600 dark:text-zinc-500">
              Built with Next.js • Content lives in <code>content/articles</code>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}


