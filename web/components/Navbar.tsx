"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  FileSpreadsheet,
  LayoutDashboard,
  PackageCheck,
  Sparkles,
} from "lucide-react";
import { useAnalysis } from "@/lib/analysis-context";
import { HealthBadge } from "@/components/HealthBadge";

const NAV_ITEMS = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/import", label: "Import Sales", icon: FileSpreadsheet },
  { href: "/forecast", label: "Demand Forecast", icon: BarChart3 },
  { href: "/recommendations", label: "Recommendations", icon: PackageCheck },
  { href: "/docs", label: "Docs & Provenance", icon: BookOpen },
];

export function Navbar() {
  const pathname = usePathname();
  const { analysis, provenance, sourceFilename } = useAnalysis();

  return (
    <header className="sticky top-0 z-30 border-b border-[#DEE6EB] bg-white/95 backdrop-blur-xs">
      {/* Subtle, restrained trust & provenance utility strip */}
      <div className="border-b border-[#DEE6EB]/80 bg-[#F6F8FA] px-4 py-1.5 text-xs text-[#536579]">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#DEE6EB] bg-white px-2.5 py-0.5 text-[11px] font-medium text-[#102034]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#087F78]" aria-hidden="true" />
              {analysis
                ? provenance === "synthetic_demo"
                  ? "Sample data · Not saved"
                  : `CSV (${sourceFilename ?? "upload"}) · Not saved`
                : "Prototype — no saved data"}
            </span>
            <span className="hidden sm:inline text-[11px] text-[#536579]">
              Stateless in-memory session · Refreshing clears uploaded records
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {analysis && provenance === "synthetic_demo" && (
              <span className="inline-flex items-center gap-1 rounded-full border border-[#F5D08A] bg-[#FFF6E8] px-2.5 py-0.5 text-[11px] font-medium text-[#A65C06]">
                <Sparkles className="h-3 w-3 shrink-0" aria-hidden="true" />
                <span>Illustrative synthetic demo data — not real retailer records</span>
              </span>
            )}
            <span className="hidden md:inline font-mono text-[11px] text-[#536579]">
              Team: The White Hole
            </span>
            <HealthBadge />
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="mx-auto flex max-w-[1280px] flex-col gap-2.5 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="group flex items-center gap-2.5 rounded-lg text-base font-bold tracking-tight text-[#102034]"
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#087F78] text-xs font-bold text-white shadow-2xs transition group-hover:bg-[#0B746E]"
                aria-hidden="true"
              >
                <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-white/90">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </span>
              </span>
              <span>
                ReorderLens <span className="font-semibold text-[#087F78]">AI</span>
              </span>
            </Link>
            <span className="rounded-full border border-[#DEE6EB] bg-[#EFF4F6] px-2.5 py-0.5 text-[11px] font-medium text-[#536579]">
              DemandIQ prototype
            </span>
          </div>
        </div>

        <nav
          aria-label="Main navigation"
          className="flex flex-wrap items-center gap-1"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition ${
                  isActive
                    ? "bg-[#E8F6F4] text-[#087F78] font-semibold shadow-2xs ring-1 ring-[#087F78]/25"
                    : "text-[#536579] hover:bg-[#EFF4F6] hover:text-[#102034]"
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    isActive ? "text-[#087F78]" : "text-[#536579]"
                  }`}
                  aria-hidden="true"
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
