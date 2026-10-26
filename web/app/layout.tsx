import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { HealthBadge } from "@/components/HealthBadge";
import { AnalysisProvider } from "@/lib/analysis-context";

export const metadata: Metadata = {
  title: "ReorderLens AI — DemandIQ Prototype",
  description:
    "Stateless retail demand forecasting and deterministic inventory reorder recommendations prototype for small retailers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-slate-900 focus:px-3 focus:py-2 focus:text-xs focus:font-semibold focus:text-white"
        >
          Skip to main content
        </a>
        <AnalysisProvider>
          <Navbar />
          <main
            id="main-content"
            className="mx-auto w-full max-w-6xl flex-1 px-4 py-6"
          >
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-2xs">
              <div className="text-xs text-slate-600">
                <strong className="font-semibold text-slate-800">
                  System Connectivity:
                </strong>{" "}
                Same-origin proxy{" "}
                <code className="font-mono text-slate-800">/backend/health</code>{" "}
                → FastAPI service
              </div>
              <HealthBadge />
            </div>
            {children}
          </main>
          <footer className="border-t border-slate-200 bg-white px-4 py-4 text-xs text-slate-600">
            <div className="mx-auto flex max-w-6xl flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <p>
                <strong>ReorderLens AI</strong> — Preliminary single-user prototype for DemandIQ (CommerceSphere AI) by Team The White Hole.
              </p>
              <p>
                Prototype — no saved data. Predictions and reorder quantities are model-based estimates, not guarantees or automatic orders.
              </p>
            </div>
          </footer>
        </AnalysisProvider>
      </body>
    </html>
  );
}
