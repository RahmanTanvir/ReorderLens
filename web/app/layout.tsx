import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { AnalysisProvider } from "@/lib/analysis-context";

export const metadata: Metadata = {
  title: "ReorderLens AI — DemandIQ Inventory & Forecasting Cockpit",
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
      <body className="min-h-screen flex flex-col bg-[#F6F8FA] text-[#102034] antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-[#087F78] focus:px-3.5 focus:py-2 focus:text-xs focus:font-semibold focus:text-white focus:shadow-md"
        >
          Skip to main content
        </a>
        <AnalysisProvider>
          <Navbar />
          <main
            id="main-content"
            className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-6 sm:px-6 lg:py-8"
          >
            {children}
          </main>
          <footer className="border-t border-[#DEE6EB] bg-white px-4 py-4 text-xs text-[#536579] sm:px-6">
            <div className="mx-auto flex max-w-[1280px] flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
              <p>
                <strong className="font-semibold text-[#102034]">ReorderLens AI</strong> — Preliminary single-user prototype for{" "}
                <span className="font-medium text-[#102034]">DemandIQ (CommerceSphere AI)</span> · Team: The White Hole
              </p>
              <p>
                Prototype — no saved data. Point forecasts and reorder quantities are model-based scenarios, not guarantees or automatic supplier orders.
              </p>
            </div>
          </footer>
        </AnalysisProvider>
      </body>
    </html>
  );
}
