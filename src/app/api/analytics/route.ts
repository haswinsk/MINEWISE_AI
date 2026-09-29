import { NextResponse } from "next/server";
import {
  getProductionTrend,
  getCapacityUtilization,
  getGrowthRates,
  SAMPLE_DOCUMENTS,
  ALL_METRICS,
} from "@/data/sample-data";

export async function GET() {
  const productionTrend = getProductionTrend();
  const capacityUtilization = getCapacityUtilization();
  const growthRates = getGrowthRates();

  const docStatus = {
    completed: SAMPLE_DOCUMENTS.filter((d) => d.status === "completed").length,
    processing: SAMPLE_DOCUMENTS.filter((d) => d.status === "processing").length,
    pending: SAMPLE_DOCUMENTS.filter((d) => d.status === "pending").length,
    failed: 0,
  };

  const metricsByType = {
    production: ALL_METRICS.filter((m) => m.metricType === "Production").length,
    capacity: ALL_METRICS.filter((m) => m.metricType === "Capacity").length,
  };

  return NextResponse.json({
    productionTrend,
    capacityUtilization,
    growthRates,
    documentStatus: docStatus,
    metricsByType,
    totalMetrics: ALL_METRICS.length,
  });
}