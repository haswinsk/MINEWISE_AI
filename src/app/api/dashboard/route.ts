import { NextResponse } from "next/server";
import { AIService } from "@/lib/ai-service";
import {
  getProductionTrend,
  getCapacityUtilization,
  SAMPLE_DOCUMENTS,
} from "@/data/sample-data";

export async function GET() {
  const stats = AIService.getDashboardStats();
  const insights = AIService.getInsights();
  const productionTrend = getProductionTrend();
  const capacityUtil = getCapacityUtilization();
  const recentDocs = SAMPLE_DOCUMENTS.slice(0, 6);

  return NextResponse.json({
    stats,
    insights,
    productionTrend,
    capacityUtilization: capacityUtil,
    recentDocuments: recentDocs,
  });
}