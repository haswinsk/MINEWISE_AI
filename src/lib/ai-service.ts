import {
  MINE_PRODUCTION,
  MINE_CAPACITY,
  ALL_METRICS,
  SAMPLE_CONFLICTS,
  SAMPLE_DOCUMENTS,
  DASHBOARD_INSIGHTS,
  getProductionTrend,
  getCapacityUtilization,
  getGrowthRates,
  type EvidenceData,
  type ConflictData,
} from "@/data/sample-data";

export interface QueryResponse {
  answer: string;
  evidence: EvidenceData[];
  chartData?: Record<string, unknown>[];
  chartType?: string;
  growth?: string;
}

// AI Service abstraction - can be replaced with real LLM
export class AIService {
  static extractEntities(text: string): Record<string, { value: string; confidence: number }> {
    // In production, this would call an NLP/NER service
    const entities: Record<string, { value: string; confidence: number }> = {};
    const mineMatch = text.match(/Mine\s+[A-D]/i);
    if (mineMatch) entities["Mine"] = { value: mineMatch[0], confidence: 0.95 };
    const yearMatch = text.match(/20\d{2}/);
    if (yearMatch) entities["Year"] = { value: yearMatch[0], confidence: 0.98 };
    const prodMatch = text.match(/(\d+\.?\d*)\s*MT/i);
    if (prodMatch) entities["Production"] = { value: `${prodMatch[1]} MT`, confidence: 0.92 };
    return entities;
  }

  static extractMetrics(text: string): { metric: string; value: number; unit: string }[] {
    const metrics: { metric: string; value: number; unit: string }[] = [];
    const mtPattern = /(\d+\.?\d*)\s*MT/g;
    let match;
    while ((match = mtPattern.exec(text)) !== null) {
      metrics.push({ metric: "Production", value: parseFloat(match[1]), unit: "MT" });
    }
    return metrics;
  }

  static answerQuestion(question: string): QueryResponse {
    const q = question.toLowerCase();

    // Mine A production over years
    if (q.includes("mine a") && q.includes("production") && (q.includes("2022") || q.includes("to 2025") || q.includes("from"))) {
      const production = MINE_PRODUCTION["Mine A"];
      const trend = getProductionTrend();
      const growth = (((production["2025"] - production["2022"]) / production["2022"]) * 100).toFixed(1);
      return {
        answer: `Mine A production increased from ${production["2022"]} MT in 2022 to ${production["2025"]} MT in 2025, representing a total growth of ${growth}% over the four-year period.\n\nYearly breakdown:\n• 2022: ${production["2022"]} MT\n• 2023: ${production["2023"]} MT\n• 2024: ${production["2024"]} MT\n• 2025: ${production["2025"]} MT`,
        evidence: [
          { value: `${production["2022"]} MT`, sourceDocument: "Mine_A_Report_2022.pdf", page: 14, section: "Production Summary", confidence: 0.94 },
          { value: `${production["2023"]} MT`, sourceDocument: "Mine_A_Report_2023.pdf", page: 16, section: "Production Summary", confidence: 0.95 },
          { value: `${production["2024"]} MT`, sourceDocument: "Mine_A_Report_2024.pdf", page: 18, section: "Production Summary", confidence: 0.94 },
          { value: `${production["2025"]} MT`, sourceDocument: "Mine_A_Report_2025.pdf", page: 18, section: "Production Summary", confidence: 0.94 },
        ],
        chartData: trend.map(t => ({ year: t.year, "Mine A": t["Mine A"] })),
        chartType: "line",
        growth: `${growth}%`,
      };
    }

    // Highest production growth
    if (q.includes("highest") && q.includes("growth")) {
      const rates = getGrowthRates();
      const highest = rates.reduce((max, r) => r.growth > max.growth ? r : max, rates[0]);
      return {
        answer: `${highest.mine} had the highest production growth at ${highest.growth}% from 2022 to 2025.\n\nGrowth comparison:\n${rates.map(r => `• ${r.mine}: ${r.growth}% (${r.production2022} MT → ${r.production2025} MT)`).join("\n")}`,
        evidence: rates.flatMap(r => [
          { value: `${r.production2022} MT`, sourceDocument: `${r.mine.replace(" ", "_")}_Report_2022.pdf`, page: r.mine === "Mine A" ? 14 : 12, section: "Production Summary", confidence: 0.91 },
          { value: `${r.production2025} MT`, sourceDocument: `${r.mine.replace(" ", "_")}_Report_2025.pdf`, page: r.mine === "Mine A" ? 18 : 15, section: "Production Summary", confidence: 0.92 },
        ]),
        chartData: rates.map(r => ({ mine: r.mine, growth: r.growth })),
        chartType: "bar",
      };
    }

    // Compare mines
    if (q.includes("compare") || q.includes("comparison")) {
      const year = q.includes("2025") ? "2025" : q.includes("2024") ? "2024" : "2025";
      const trend = getProductionTrend();
      return {
        answer: `Comparison of all mines production in ${year}:\n\n${Object.entries(MINE_PRODUCTION).map(([mine, data]) => `• ${mine}: ${data[year]} MT`).join("\n")}\n\nMine A leads with the highest production, while Mine D shows the strongest growth trajectory.`,
        evidence: Object.entries(MINE_PRODUCTION).map(([mine, data]) => ({
          value: `${data[year]} MT`,
          sourceDocument: `${mine.replace(" ", "_")}_Report_${year}.pdf`,
          page: mine === "Mine A" ? 18 : 15,
          section: "Production Summary",
          confidence: 0.92,
        })),
        chartData: trend,
        chartType: "bar",
      };
    }

    // Conflicts
    if (q.includes("conflict")) {
      const pending = SAMPLE_CONFLICTS.filter(c => c.status === "pending");
      return {
        answer: `${SAMPLE_CONFLICTS.length} conflicts detected across indexed documents, ${pending.length} pending resolution.\n\nNotable conflicts:\n${SAMPLE_CONFLICTS.slice(0, 3).map(c => `• ${c.metric}: ${c.source1.value} vs ${c.source2.value}`).join("\n")}\n\nHuman verification is required for all pending conflicts.`,
        evidence: SAMPLE_CONFLICTS.slice(0, 3).flatMap(c => [
          { value: c.source1.value, sourceDocument: c.source1.document, page: c.source1.page, section: "Production Summary", confidence: c.source1.confidence },
          { value: c.source2.value, sourceDocument: c.source2.document, page: c.source2.page, section: "Summary Table", confidence: c.source2.confidence },
        ]),
        chartData: undefined,
      };
    }

    // Executive summary
    if (q.includes("executive") || q.includes("summary")) {
      const totalProd2025 = Object.values(MINE_PRODUCTION).reduce((sum, mine) => sum + mine["2025"], 0);
      const rates = getGrowthRates();
      return {
        answer: `Executive Summary - Mining Operations 2022-2025\n\nTotal Production (2025): ${totalProd2025} MT across 4 mines\n\nKey Highlights:\n• Mine A: Leading producer at ${MINE_PRODUCTION["Mine A"]["2025"]} MT with ${rates.find(r => r.mine === "Mine A")?.growth}% growth\n• Mine D: Highest growth rate at ${rates.find(r => r.mine === "Mine D")?.growth}%\n• Overall capacity utilization: ${Math.round((totalProd2025 / Object.values(MINE_CAPACITY).reduce((s, m) => s + m["2025"], 0)) * 100)}%\n• ${SAMPLE_CONFLICTS.length} data conflicts detected requiring review`,
        evidence: [
          { value: `${totalProd2025} MT`, sourceDocument: "Production_Summary_2025.xlsx", page: 1, section: "Summary Table", confidence: 0.95 },
        ],
        chartData: getCapacityUtilization(),
        chartType: "bar",
      };
    }

    // Default fallback for production-related queries
    if (q.includes("production")) {
      const totalProd2025 = Object.values(MINE_PRODUCTION).reduce((sum, mine) => sum + mine["2025"], 0);
      return {
        answer: `Current production data (2025):\n\n${Object.entries(MINE_PRODUCTION).map(([mine, data]) => `• ${mine}: ${data["2025"]} MT`).join("\n")}\n\nTotal: ${totalProd2025} MT\n\nFor detailed analysis, please specify a mine name, year range, or metric type.`,
        evidence: Object.entries(MINE_PRODUCTION).map(([mine, data]) => ({
          value: `${data["2025"]} MT`,
          sourceDocument: `${mine.replace(" ", "_")}_Report_2025.pdf`,
          page: mine === "Mine A" ? 18 : 15,
          section: "Production Summary",
          confidence: 0.92,
        })),
        chartData: getProductionTrend(),
        chartType: "line",
      };
    }

    return {
      answer: "Insufficient evidence found in the indexed documents for this query. Please try asking about:\n\n• Production data for specific mines\n• Growth comparisons between mines\n• Capacity utilization\n• Data conflicts\n• Executive summaries\n\nExample: \"What was Mine A production from 2022 to 2025?\"",
      evidence: [],
    };
  }

  static detectConflicts(): ConflictData[] {
    return SAMPLE_CONFLICTS;
  }

  static generateReport(mine: string, yearFrom: number, yearTo: number, reportType: string): Record<string, unknown> {
    const mines = mine === "All" ? ["Mine A", "Mine B", "Mine C", "Mine D"] : [mine];
    const years: string[] = [];
    for (let y = yearFrom; y <= yearTo; y++) years.push(String(y));

    const prodData = mines.map(m => ({
      mine: m,
      data: years.map(y => ({ year: y, production: MINE_PRODUCTION[m]?.[y] || 0, capacity: MINE_CAPACITY[m]?.[y] || 0 })),
    }));

    const totalProd = mines.reduce((sum, m) => sum + (MINE_PRODUCTION[m]?.[String(yearTo)] || 0), 0);
    const totalCap = mines.reduce((sum, m) => sum + (MINE_CAPACITY[m]?.[String(yearTo)] || 0), 0);

    const sections = [
      {
        title: "Executive Summary",
        content: `This ${reportType.toLowerCase()} covers ${mines.join(", ")} operations from ${yearFrom} to ${yearTo}. Total production in ${yearTo} reached ${totalProd.toFixed(1)} MT with an overall capacity utilization of ${((totalProd / totalCap) * 100).toFixed(1)}%. The report identifies key performance trends, production metrics, and areas requiring attention.`,
        reviewStatus: "verified" as const,
        evidence: [{ value: `${totalProd.toFixed(1)} MT`, sourceDocument: "Production_Summary_2025.xlsx", page: 1, section: "Summary Table", confidence: 0.95 }],
      },
      {
        title: "Production Overview",
        content: mines.map(m => {
          const first = MINE_PRODUCTION[m]?.[String(yearFrom)] || 0;
          const last = MINE_PRODUCTION[m]?.[String(yearTo)] || 0;
          const growth = (((last - first) / first) * 100).toFixed(1);
          return `${m}: ${first} MT (${yearFrom}) → ${last} MT (${yearTo}), Growth: ${growth}%`;
        }).join("\n\n"),
        reviewStatus: "verified" as const,
        evidence: mines.map(m => ({
          value: `${MINE_PRODUCTION[m]?.[String(yearTo)]} MT`,
          sourceDocument: `${m.replace(" ", "_")}_Report_${yearTo}.pdf`,
          page: m === "Mine A" ? 18 : 15,
          section: "Production Summary",
          confidence: 0.93,
        })),
      },
      {
        title: "Key Metrics",
        content: `Production (${yearTo}): ${totalProd.toFixed(1)} MT\nCapacity (${yearTo}): ${totalCap.toFixed(1)} MT\nUtilization: ${((totalProd / totalCap) * 100).toFixed(1)}%\nActive Mines: ${mines.length}\nConflict Alerts: ${SAMPLE_CONFLICTS.filter(c => c.year === yearTo).length}`,
        reviewStatus: "verified" as const,
        evidence: [],
      },
      {
        title: "Trends Analysis",
        content: `Over the ${yearFrom}-${yearTo} period, ${mines.length > 1 ? "all mines showed" : mines[0] + " showed"} positive growth trends. ${mines.length > 1 ? "Mine D exhibited the highest growth rate while Mine A maintained the highest absolute production levels." : ""} Capacity utilization has generally improved, indicating better operational efficiency.`,
        reviewStatus: "needs_review" as const,
        evidence: [],
      },
      {
        title: "Detected Conflicts",
        content: `${SAMPLE_CONFLICTS.filter(c => mines.includes(c.mine) && c.year >= yearFrom && c.year <= yearTo).length} data conflicts were detected in the reviewed documents. These include discrepancies between annual reports and production spreadsheets. Human verification is recommended before using these values in official reporting.`,
        reviewStatus: "needs_review" as const,
        evidence: SAMPLE_CONFLICTS.filter(c => c.year === yearTo).flatMap(c => [
          { value: c.source1.value, sourceDocument: c.source1.document, page: c.source1.page, section: "Production Summary", confidence: c.source1.confidence },
          { value: c.source2.value, sourceDocument: c.source2.document, page: c.source2.page, section: "Summary Table", confidence: c.source2.confidence },
        ]),
      },
      {
        title: "Recommendations",
        content: `1. Resolve ${SAMPLE_CONFLICTS.filter(c => c.status === "pending").length} pending data conflicts through human review.\n2. Standardize data collection formats across all mine reporting systems.\n3. Implement automated cross-validation for production figures.\n4. Increase reporting frequency for real-time monitoring.\n5. Conduct detailed geological surveys for capacity expansion planning.`,
        reviewStatus: "needs_review" as const,
        evidence: [],
      },
    ];

    return { sections, productionData: prodData };
  }

  static getDashboardStats() {
    return {
      totalDocuments: 128,
      processedDocuments: 121,
      extractedMetrics: 2846,
      detectedConflicts: 17,
    };
  }

  static getInsights() {
    return DASHBOARD_INSIGHTS;
  }
}