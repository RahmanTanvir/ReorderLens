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
} from "lucide-react";
import { useAnalysis } from "@/lib/analysis-context";

const NAV_ITEMS = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/import", label: "Import Sales", icon: FileSpreadsheet },
  { href: "/forecast", label: "Demand Forecast", icon: BarChart3 },
  { href: "/recommendations", label: "Recommendations", icon: PackageCheck },
  { href: "/docs", label: "Docs & Provenance", icon: BookOpen },
];

export function Navbar() {
  const pathname = usePathname();
  const { analysis, provenance } = useAnalysis();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-950">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-block rounded bg-amber-200/90 px-2 py-0.5 font-semibold text-amber-950">
              Prototype / demo mode — data is not saved
            </span>
            <span>
              Stateless preliminary demonstration for DemandIQ. Refreshing the browser resets session memory.
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {analysis && provenance === "synthetic_demo" && (
              <span className="rounded border border-indigo-300 bg-indigo-100 px-2 py-0.5 font-semibold text-indigo-950">
                Illustrative synthetic demo data — not real retailer records
              </span>
            )}
            <span className="font-mono text-[11px] text-amber-900">
              Team: The White Hole
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="flex items-center gap-2 rounded text-lg font-bold tracking-tight text-slate-900 focus:ring-2 focus:ring-slate-500 focus:outline-none"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 text-sm font-bold text-white">
                RL
              </span>
              <span>ReorderLens AI</span>
            </Link>
            <span className="rounded-full border border-slate-300 bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
              DemandIQ MVP
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
                className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs sm:text-sm font-medium transition focus:ring-2 focus:ring-slate-500 focus:outline-none ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
