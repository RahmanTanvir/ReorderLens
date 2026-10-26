"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import {
  AnalyzeResponse,
  ApiClientError,
  RecommendationResponseItem,
  analyzeCsvFile,
  loadAndAnalyzeDemoCsv,
} from "@/lib/api";

export type ProvenanceKind = "synthetic_demo" | "user_upload" | null;

export interface AnalysisErrorState {
  code?: string;
  message: string;
  details: string[];
}

export interface SkuInventorySettings {
  stock_on_hand: number;
  lead_time_days: number;
  safety_stock_units: number;
}

interface AnalysisContextValue {
  analysis: AnalyzeResponse | null;
  provenance: ProvenanceKind;
  sourceFilename: string | null;
  selectedProductId: string | null;
  isAnalyzing: boolean;
  error: AnalysisErrorState | null;
  recommendationsBySku: Record<string, RecommendationResponseItem>;
  settingsBySku: Record<string, SkuInventorySettings>;
  uploadCustomCsv: (file: File) => Promise<boolean>;
  loadSyntheticDemo: () => Promise<boolean>;
  clearAnalysis: () => void;
  setSelectedProductId: (productId: string) => void;
  recordRecommendationResult: (
    productId: string,
    settings: SkuInventorySettings,
    result: RecommendationResponseItem
  ) => void;
}

const AnalysisContext = createContext<AnalysisContextValue | undefined>(
  undefined
);

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const [provenance, setProvenance] = useState<ProvenanceKind>(null);
  const [sourceFilename, setSourceFilename] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<AnalysisErrorState | null>(null);
  const [recommendationsBySku, setRecommendationsBySku] = useState<
    Record<string, RecommendationResponseItem>
  >({});
  const [settingsBySku, setSettingsBySku] = useState<
    Record<string, SkuInventorySettings>
  >({});

  const applyResult = useCallback(
    (
      result: AnalyzeResponse,
      nextProvenance: ProvenanceKind,
      filename: string
    ) => {
      setAnalysis(result);
      setProvenance(nextProvenance);
      setSourceFilename(filename);
      setRecommendationsBySku({});
      setSettingsBySku({});
      const firstForecastable =
        result.products.find((p) => p.forecast.length > 0) ??
        result.products[0] ??
        null;
      setSelectedProductId(firstForecastable ? firstForecastable.product_id : null);
    },
    []
  );

  const handleException = useCallback((err: unknown) => {
    if (err instanceof ApiClientError) {
      setError({
        code: err.code,
        message: err.message,
        details: err.details,
      });
    } else {
      setError({
        code: "UNEXPECTED_ERROR",
        message:
          err instanceof Error
            ? err.message
            : "An unexpected error occurred during CSV analysis.",
        details: [],
      });
    }
  }, []);

  const uploadCustomCsv = useCallback(
    async (file: File): Promise<boolean> => {
      setIsAnalyzing(true);
      setError(null);
      try {
        const result = await analyzeCsvFile(file, file.name);
        // Custom file uploads are ALWAYS marked user_upload regardless of filename
        applyResult(result, "user_upload", file.name);
        return true;
      } catch (err) {
        handleException(err);
        return false;
      } finally {
        setIsAnalyzing(false);
      }
    },
    [applyResult, handleException]
  );

  const loadSyntheticDemo = useCallback(async (): Promise<boolean> => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await loadAndAnalyzeDemoCsv();
      applyResult(result, "synthetic_demo", "demo-sales.csv");
      return true;
    } catch (err) {
      handleException(err);
      return false;
    } finally {
      setIsAnalyzing(false);
    }
  }, [applyResult, handleException]);

  const clearAnalysis = useCallback(() => {
    setAnalysis(null);
    setProvenance(null);
    setSourceFilename(null);
    setSelectedProductId(null);
    setError(null);
    setRecommendationsBySku({});
    setSettingsBySku({});
  }, []);

  const recordRecommendationResult = useCallback(
    (
      productId: string,
      settings: SkuInventorySettings,
      result: RecommendationResponseItem
    ) => {
      setSettingsBySku((prev) => ({ ...prev, [productId]: settings }));
      setRecommendationsBySku((prev) => ({ ...prev, [productId]: result }));
    },
    []
  );

  return (
    <AnalysisContext.Provider
      value={{
        analysis,
        provenance,
        sourceFilename,
        selectedProductId,
        isAnalyzing,
        error,
        recommendationsBySku,
        settingsBySku,
        uploadCustomCsv,
        loadSyntheticDemo,
        clearAnalysis,
        setSelectedProductId,
        recordRecommendationResult,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis(): AnalysisContextValue {
  const ctx = useContext(AnalysisContext);
  if (!ctx) {
    throw new Error("useAnalysis must be used within an AnalysisProvider");
  }
  return ctx;
}
