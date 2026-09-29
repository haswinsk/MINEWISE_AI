export interface EvidenceData {
  value: string;
  sourceDocument: string;
  page: number;
  section: string;
  table?: string;
  confidence: number;
  context?: string;
}

export interface MetricData {
  id: number;
  documentId?: number;
  mine: string;
  metricType: string;
  value: number;
  unit: string;
  year: number;
  confidence: number;
  sourceDocument: string;
  sourcePage: number;
  sourceSection: string;
}

export interface DocumentData {
  id: number;
  name: string;
  mine: string;
  documentType: string;
  year: number;
  status: string;
  confidence: number;
  uploadDate: string;
  fileSize: string;
  pageCount: number;
  extractedEntities?: Record<string, { value: string; confidence: number; page: number; section: string }>;
}

export interface ConflictData {
  id: number;
  metric: string;
  mine: string;
  year: number;
  source1: { document: string; value: string; page: number; confidence: number };
  source2: { document: string; value: string; page: number; confidence: number };
  status: string;
}

export interface TopicData {
  id: number;
  name: string;
  frequency: number;
  category: string;
  relatedDocuments: string[];
}

export interface ReportData {
  id: number;
  title: string;
  mine: string;
  yearFrom: number;
  yearTo: number;
  reportType: string;
  status: string;
  createdAt: string;
  sections?: ReportSection[];
}

export interface ReportSection {
  title: string;
  content: string;
  reviewStatus: "verified" | "needs_review" | "edit";
  evidence?: EvidenceData[];
}

export const DEMO_USERS = [
  { id: 1, username: "admin", password: "admin123", role: "admin" },
  { id: 2, username: "analyst", password: "analyst123", role: "analyst" },
  { id: 3, username: "reviewer", password: "reviewer123", role: "reviewer" },
];

export const MINE_PRODUCTION: Record<string, Record<string, number>> = {
  "Mine A": { "2022": 4.1, "2023": 4.5, "2024": 4.8, "2025": 5.2 },
  "Mine B": { "2022": 3.2, "2023": 3.5, "2024": 3.8, "2025": 4.1 },
  "Mine C": { "2022": 2.8, "2023": 3.0, "2024": 3.1, "2025": 3.4 },
  "Mine D": { "2022": 2.1, "2023": 2.3, "2024": 2.7, "2025": 3.0 },
};

export const MINE_CAPACITY: Record<string, Record<string, number>> = {
  "Mine A": { "2022": 5.0, "2023": 5.5, "2024": 5.8, "2025": 6.0 },
  "Mine B": { "2022": 4.0, "2023": 4.2, "2024": 4.5, "2025": 4.8 },
  "Mine C": { "2022": 3.5, "2023": 3.5, "2024": 3.8, "2025": 4.0 },
  "Mine D": { "2022": 3.0, "2023": 3.0, "2024": 3.2, "2025": 3.5 },
};

export const SAMPLE_DOCUMENTS: DocumentData[] = [
  {
    id: 1, name: "Mine_A_Report_2022.pdf", mine: "Mine A", documentType: "Annual Report",
    year: 2022, status: "completed", confidence: 0.92, uploadDate: "2023-03-15",
    fileSize: "4.2 MB", pageCount: 42,
    extractedEntities: {
      "Mine": { value: "Mine A", confidence: 0.98, page: 1, section: "Cover" },
      "Location": { value: "Jharia Coalfield, Jharkhand", confidence: 0.96, page: 2, section: "Introduction" },
      "Year": { value: "2022", confidence: 0.99, page: 1, section: "Cover" },
      "Production": { value: "4.1 MT", confidence: 0.94, page: 14, section: "Production Summary" },
      "Capacity": { value: "5.0 MT", confidence: 0.93, page: 14, section: "Production Summary" },
      "Growth": { value: "8.2%", confidence: 0.91, page: 15, section: "Year-over-Year Analysis" },
    },
  },
  {
    id: 2, name: "Mine_A_Report_2023.pdf", mine: "Mine A", documentType: "Annual Report",
    year: 2023, status: "completed", confidence: 0.94, uploadDate: "2024-02-28",
    fileSize: "4.8 MB", pageCount: 48,
    extractedEntities: {
      "Mine": { value: "Mine A", confidence: 0.99, page: 1, section: "Cover" },
      "Location": { value: "Jharia Coalfield, Jharkhand", confidence: 0.97, page: 2, section: "Introduction" },
      "Year": { value: "2023", confidence: 0.99, page: 1, section: "Cover" },
      "Production": { value: "4.5 MT", confidence: 0.95, page: 16, section: "Production Summary" },
      "Capacity": { value: "5.5 MT", confidence: 0.94, page: 16, section: "Production Summary" },
      "Growth": { value: "9.8%", confidence: 0.92, page: 17, section: "Year-over-Year Analysis" },
    },
  },
  {
    id: 3, name: "Mine_A_Report_2024.pdf", mine: "Mine A", documentType: "Annual Report",
    year: 2024, status: "completed", confidence: 0.93, uploadDate: "2025-03-10",
    fileSize: "5.1 MB", pageCount: 52,
    extractedEntities: {
      "Mine": { value: "Mine A", confidence: 0.98, page: 1, section: "Cover" },
      "Location": { value: "Jharia Coalfield, Jharkhand", confidence: 0.96, page: 2, section: "Introduction" },
      "Year": { value: "2024", confidence: 0.99, page: 1, section: "Cover" },
      "Production": { value: "4.8 MT", confidence: 0.94, page: 18, section: "Production Summary" },
      "Capacity": { value: "5.8 MT", confidence: 0.93, page: 18, section: "Production Summary" },
      "Growth": { value: "6.7%", confidence: 0.90, page: 19, section: "Year-over-Year Analysis" },
    },
  },
  {
    id: 4, name: "Mine_A_Report_2025.pdf", mine: "Mine A", documentType: "Annual Report",
    year: 2025, status: "completed", confidence: 0.94, uploadDate: "2026-02-15",
    fileSize: "5.4 MB", pageCount: 55,
    extractedEntities: {
      "Mine": { value: "Mine A", confidence: 0.99, page: 1, section: "Cover" },
      "Location": { value: "Jharia Coalfield, Jharkhand", confidence: 0.97, page: 2, section: "Introduction" },
      "Year": { value: "2025", confidence: 0.99, page: 1, section: "Cover" },
      "Production": { value: "5.2 MT", confidence: 0.94, page: 18, section: "Production Summary" },
      "Capacity": { value: "6.0 MT", confidence: 0.93, page: 18, section: "Production Summary" },
      "Growth": { value: "8.3%", confidence: 0.91, page: 19, section: "Year-over-Year Analysis" },
    },
  },
  {
    id: 5, name: "Mine_B_Report_2025.pdf", mine: "Mine B", documentType: "Annual Report",
    year: 2025, status: "completed", confidence: 0.91, uploadDate: "2026-02-20",
    fileSize: "4.6 MB", pageCount: 44,
    extractedEntities: {
      "Mine": { value: "Mine B", confidence: 0.98, page: 1, section: "Cover" },
      "Location": { value: "Raniganj Coalfield, West Bengal", confidence: 0.95, page: 2, section: "Introduction" },
      "Year": { value: "2025", confidence: 0.99, page: 1, section: "Cover" },
      "Production": { value: "4.1 MT", confidence: 0.92, page: 15, section: "Production Summary" },
      "Capacity": { value: "4.8 MT", confidence: 0.90, page: 15, section: "Production Summary" },
      "Growth": { value: "7.9%", confidence: 0.88, page: 16, section: "Year-over-Year Analysis" },
    },
  },
  {
    id: 6, name: "Mine_C_Report_2025.pdf", mine: "Mine C", documentType: "Annual Report",
    year: 2025, status: "completed", confidence: 0.89, uploadDate: "2026-03-01",
    fileSize: "3.8 MB", pageCount: 38,
    extractedEntities: {
      "Mine": { value: "Mine C", confidence: 0.97, page: 1, section: "Cover" },
      "Location": { value: "Korba Coalfield, Chhattisgarh", confidence: 0.94, page: 2, section: "Introduction" },
      "Year": { value: "2025", confidence: 0.99, page: 1, section: "Cover" },
      "Production": { value: "3.4 MT", confidence: 0.91, page: 12, section: "Production Summary" },
      "Capacity": { value: "4.0 MT", confidence: 0.89, page: 12, section: "Production Summary" },
      "Growth": { value: "9.7%", confidence: 0.87, page: 13, section: "Year-over-Year Analysis" },
    },
  },
  {
    id: 7, name: "Mine_D_Report_2025.pdf", mine: "Mine D", documentType: "Annual Report",
    year: 2025, status: "completed", confidence: 0.90, uploadDate: "2026-03-05",
    fileSize: "3.5 MB", pageCount: 36,
    extractedEntities: {
      "Mine": { value: "Mine D", confidence: 0.97, page: 1, section: "Cover" },
      "Location": { value: "Talcher Coalfield, Odisha", confidence: 0.93, page: 2, section: "Introduction" },
      "Year": { value: "2025", confidence: 0.99, page: 1, section: "Cover" },
      "Production": { value: "3.0 MT", confidence: 0.91, page: 11, section: "Production Summary" },
      "Capacity": { value: "3.5 MT", confidence: 0.89, page: 11, section: "Production Summary" },
      "Growth": { value: "11.1%", confidence: 0.86, page: 12, section: "Year-over-Year Analysis" },
    },
  },
  {
    id: 8, name: "Production_Summary_2025.xlsx", mine: "All", documentType: "Spreadsheet",
    year: 2025, status: "completed", confidence: 0.96, uploadDate: "2026-03-10",
    fileSize: "1.2 MB", pageCount: 1,
    extractedEntities: {
      "Mine A Production": { value: "4.8 MT", confidence: 0.85, page: 1, section: "Summary Table" },
      "Mine B Production": { value: "4.1 MT", confidence: 0.96, page: 1, section: "Summary Table" },
      "Mine C Production": { value: "3.4 MT", confidence: 0.95, page: 1, section: "Summary Table" },
      "Mine D Production": { value: "3.0 MT", confidence: 0.95, page: 1, section: "Summary Table" },
    },
  },
];

export const ALL_METRICS: MetricData[] = [
  // Mine A
  { id: 1, mine: "Mine A", metricType: "Production", value: 4.1, unit: "MT", year: 2022, confidence: 0.94, sourceDocument: "Mine_A_Report_2022.pdf", sourcePage: 14, sourceSection: "Production Summary" },
  { id: 2, mine: "Mine A", metricType: "Capacity", value: 5.0, unit: "MT", year: 2022, confidence: 0.93, sourceDocument: "Mine_A_Report_2022.pdf", sourcePage: 14, sourceSection: "Production Summary" },
  { id: 3, mine: "Mine A", metricType: "Production", value: 4.5, unit: "MT", year: 2023, confidence: 0.95, sourceDocument: "Mine_A_Report_2023.pdf", sourcePage: 16, sourceSection: "Production Summary" },
  { id: 4, mine: "Mine A", metricType: "Capacity", value: 5.5, unit: "MT", year: 2023, confidence: 0.94, sourceDocument: "Mine_A_Report_2023.pdf", sourcePage: 16, sourceSection: "Production Summary" },
  { id: 5, mine: "Mine A", metricType: "Production", value: 4.8, unit: "MT", year: 2024, confidence: 0.94, sourceDocument: "Mine_A_Report_2024.pdf", sourcePage: 18, sourceSection: "Production Summary" },
  { id: 6, mine: "Mine A", metricType: "Capacity", value: 5.8, unit: "MT", year: 2024, confidence: 0.93, sourceDocument: "Mine_A_Report_2024.pdf", sourcePage: 18, sourceSection: "Production Summary" },
  { id: 7, mine: "Mine A", metricType: "Production", value: 5.2, unit: "MT", year: 2025, confidence: 0.94, sourceDocument: "Mine_A_Report_2025.pdf", sourcePage: 18, sourceSection: "Production Summary" },
  { id: 8, mine: "Mine A", metricType: "Capacity", value: 6.0, unit: "MT", year: 2025, confidence: 0.93, sourceDocument: "Mine_A_Report_2025.pdf", sourcePage: 18, sourceSection: "Production Summary" },
  // Mine B
  { id: 9, mine: "Mine B", metricType: "Production", value: 3.2, unit: "MT", year: 2022, confidence: 0.91, sourceDocument: "Mine_B_Report_2022.pdf", sourcePage: 12, sourceSection: "Production Summary" },
  { id: 10, mine: "Mine B", metricType: "Capacity", value: 4.0, unit: "MT", year: 2022, confidence: 0.90, sourceDocument: "Mine_B_Report_2022.pdf", sourcePage: 12, sourceSection: "Production Summary" },
  { id: 11, mine: "Mine B", metricType: "Production", value: 3.5, unit: "MT", year: 2023, confidence: 0.92, sourceDocument: "Mine_B_Report_2023.pdf", sourcePage: 13, sourceSection: "Production Summary" },
  { id: 12, mine: "Mine B", metricType: "Capacity", value: 4.2, unit: "MT", year: 2023, confidence: 0.91, sourceDocument: "Mine_B_Report_2023.pdf", sourcePage: 13, sourceSection: "Production Summary" },
  { id: 13, mine: "Mine B", metricType: "Production", value: 3.8, unit: "MT", year: 2024, confidence: 0.93, sourceDocument: "Mine_B_Report_2024.pdf", sourcePage: 14, sourceSection: "Production Summary" },
  { id: 14, mine: "Mine B", metricType: "Capacity", value: 4.5, unit: "MT", year: 2024, confidence: 0.92, sourceDocument: "Mine_B_Report_2024.pdf", sourcePage: 14, sourceSection: "Production Summary" },
  { id: 15, mine: "Mine B", metricType: "Production", value: 4.1, unit: "MT", year: 2025, confidence: 0.92, sourceDocument: "Mine_B_Report_2025.pdf", sourcePage: 15, sourceSection: "Production Summary" },
  { id: 16, mine: "Mine B", metricType: "Capacity", value: 4.8, unit: "MT", year: 2025, confidence: 0.90, sourceDocument: "Mine_B_Report_2025.pdf", sourcePage: 15, sourceSection: "Production Summary" },
  // Mine C
  { id: 17, mine: "Mine C", metricType: "Production", value: 2.8, unit: "MT", year: 2022, confidence: 0.90, sourceDocument: "Mine_C_Report_2022.pdf", sourcePage: 10, sourceSection: "Production Summary" },
  { id: 18, mine: "Mine C", metricType: "Capacity", value: 3.5, unit: "MT", year: 2022, confidence: 0.89, sourceDocument: "Mine_C_Report_2022.pdf", sourcePage: 10, sourceSection: "Production Summary" },
  { id: 19, mine: "Mine C", metricType: "Production", value: 3.0, unit: "MT", year: 2023, confidence: 0.91, sourceDocument: "Mine_C_Report_2023.pdf", sourcePage: 11, sourceSection: "Production Summary" },
  { id: 20, mine: "Mine C", metricType: "Capacity", value: 3.5, unit: "MT", year: 2023, confidence: 0.90, sourceDocument: "Mine_C_Report_2023.pdf", sourcePage: 11, sourceSection: "Production Summary" },
  { id: 21, mine: "Mine C", metricType: "Production", value: 3.1, unit: "MT", year: 2024, confidence: 0.91, sourceDocument: "Mine_C_Report_2024.pdf", sourcePage: 12, sourceSection: "Production Summary" },
  { id: 22, mine: "Mine C", metricType: "Capacity", value: 3.8, unit: "MT", year: 2024, confidence: 0.89, sourceDocument: "Mine_C_Report_2024.pdf", sourcePage: 12, sourceSection: "Production Summary" },
  { id: 23, mine: "Mine C", metricType: "Production", value: 3.4, unit: "MT", year: 2025, confidence: 0.91, sourceDocument: "Mine_C_Report_2025.pdf", sourcePage: 12, sourceSection: "Production Summary" },
  { id: 24, mine: "Mine C", metricType: "Capacity", value: 4.0, unit: "MT", year: 2025, confidence: 0.89, sourceDocument: "Mine_C_Report_2025.pdf", sourcePage: 12, sourceSection: "Production Summary" },
  // Mine D
  { id: 25, mine: "Mine D", metricType: "Production", value: 2.1, unit: "MT", year: 2022, confidence: 0.88, sourceDocument: "Mine_D_Report_2022.pdf", sourcePage: 9, sourceSection: "Production Summary" },
  { id: 26, mine: "Mine D", metricType: "Capacity", value: 3.0, unit: "MT", year: 2022, confidence: 0.87, sourceDocument: "Mine_D_Report_2022.pdf", sourcePage: 9, sourceSection: "Production Summary" },
  { id: 27, mine: "Mine D", metricType: "Production", value: 2.3, unit: "MT", year: 2023, confidence: 0.89, sourceDocument: "Mine_D_Report_2023.pdf", sourcePage: 10, sourceSection: "Production Summary" },
  { id: 28, mine: "Mine D", metricType: "Capacity", value: 3.0, unit: "MT", year: 2023, confidence: 0.88, sourceDocument: "Mine_D_Report_2023.pdf", sourcePage: 10, sourceSection: "Production Summary" },
  { id: 29, mine: "Mine D", metricType: "Production", value: 2.7, unit: "MT", year: 2024, confidence: 0.90, sourceDocument: "Mine_D_Report_2024.pdf", sourcePage: 11, sourceSection: "Production Summary" },
  { id: 30, mine: "Mine D", metricType: "Capacity", value: 3.2, unit: "MT", year: 2024, confidence: 0.89, sourceDocument: "Mine_D_Report_2024.pdf", sourcePage: 11, sourceSection: "Production Summary" },
  { id: 31, mine: "Mine D", metricType: "Production", value: 3.0, unit: "MT", year: 2025, confidence: 0.91, sourceDocument: "Mine_D_Report_2025.pdf", sourcePage: 11, sourceSection: "Production Summary" },
  { id: 32, mine: "Mine D", metricType: "Capacity", value: 3.5, unit: "MT", year: 2025, confidence: 0.89, sourceDocument: "Mine_D_Report_2025.pdf", sourcePage: 11, sourceSection: "Production Summary" },
];

export const SAMPLE_CONFLICTS: ConflictData[] = [
  {
    id: 1, metric: "Mine A Production 2025", mine: "Mine A", year: 2025,
    source1: { document: "Mine_A_Report_2025.pdf", value: "5.2 MT", page: 18, confidence: 0.94 },
    source2: { document: "Production_Summary_2025.xlsx", value: "4.8 MT", page: 1, confidence: 0.85 },
    status: "pending",
  },
  {
    id: 2, metric: "Mine A Capacity 2024", mine: "Mine A", year: 2024,
    source1: { document: "Mine_A_Report_2024.pdf", value: "5.8 MT", page: 18, confidence: 0.93 },
    source2: { document: "Production_Summary_2024.xlsx", value: "5.5 MT", page: 1, confidence: 0.82 },
    status: "pending",
  },
  {
    id: 3, metric: "Mine B Production 2023", mine: "Mine B", year: 2023,
    source1: { document: "Mine_B_Report_2023.pdf", value: "3.5 MT", page: 13, confidence: 0.92 },
    source2: { document: "Coal_Production_Register.xlsx", value: "3.7 MT", page: 1, confidence: 0.80 },
    status: "pending",
  },
  {
    id: 4, metric: "Mine C Growth Rate 2025", mine: "Mine C", year: 2025,
    source1: { document: "Mine_C_Report_2025.pdf", value: "9.7%", page: 13, confidence: 0.87 },
    source2: { document: "Growth_Analysis_2025.xlsx", value: "10.2%", page: 1, confidence: 0.78 },
    status: "pending",
  },
  {
    id: 5, metric: "Mine D Production 2025", mine: "Mine D", year: 2025,
    source1: { document: "Mine_D_Report_2025.pdf", value: "3.0 MT", page: 11, confidence: 0.91 },
    source2: { document: "Production_Summary_2025.xlsx", value: "2.9 MT", page: 1, confidence: 0.88 },
    status: "resolved",
  },
];

export const SAMPLE_TOPICS: TopicData[] = [
  { id: 1, name: "Production", frequency: 342, category: "Operations", relatedDocuments: ["Mine_A_Report_2025.pdf", "Mine_B_Report_2025.pdf", "Production_Summary_2025.xlsx"] },
  { id: 2, name: "Coal Quality", frequency: 218, category: "Geology", relatedDocuments: ["Mine_A_Report_2025.pdf", "Mine_C_Report_2025.pdf"] },
  { id: 3, name: "Exploration", frequency: 186, category: "Geology", relatedDocuments: ["Mine_A_Report_2024.pdf", "Mine_B_Report_2025.pdf"] },
  { id: 4, name: "Capacity Utilization", frequency: 164, category: "Operations", relatedDocuments: ["Mine_A_Report_2025.pdf", "Mine_D_Report_2025.pdf"] },
  { id: 5, name: "Safety", frequency: 156, category: "Compliance", relatedDocuments: ["Mine_A_Report_2025.pdf", "Mine_B_Report_2025.pdf", "Mine_C_Report_2025.pdf"] },
  { id: 6, name: "Equipment", frequency: 142, category: "Operations", relatedDocuments: ["Mine_A_Report_2025.pdf", "Mine_D_Report_2025.pdf"] },
  { id: 7, name: "Infrastructure", frequency: 138, category: "Development", relatedDocuments: ["Mine_B_Report_2025.pdf", "Mine_C_Report_2025.pdf"] },
  { id: 8, name: "Environment", frequency: 124, category: "Compliance", relatedDocuments: ["Mine_A_Report_2025.pdf", "Mine_C_Report_2025.pdf"] },
  { id: 9, name: "Geology", frequency: 118, category: "Geology", relatedDocuments: ["Mine_A_Report_2025.pdf", "Mine_B_Report_2025.pdf", "Mine_D_Report_2025.pdf"] },
  { id: 10, name: "Overburden Removal", frequency: 112, category: "Operations", relatedDocuments: ["Mine_A_Report_2025.pdf", "Mine_B_Report_2025.pdf"] },
  { id: 11, name: "Drainage", frequency: 98, category: "Infrastructure", relatedDocuments: ["Mine_C_Report_2025.pdf"] },
  { id: 12, name: "Transport", frequency: 94, category: "Logistics", relatedDocuments: ["Mine_B_Report_2025.pdf", "Mine_D_Report_2025.pdf"] },
  { id: 13, name: "Manpower", frequency: 88, category: "HR", relatedDocuments: ["Mine_A_Report_2025.pdf", "Mine_D_Report_2025.pdf"] },
  { id: 14, name: "Financial Performance", frequency: 82, category: "Finance", relatedDocuments: ["Mine_A_Report_2025.pdf", "Mine_B_Report_2025.pdf"] },
  { id: 15, name: "Reserves Estimation", frequency: 76, category: "Geology", relatedDocuments: ["Mine_A_Report_2024.pdf", "Mine_C_Report_2025.pdf"] },
];

export const SAMPLE_REPORTS: ReportData[] = [
  {
    id: 1, title: "Executive Mining Report - Mine A (2022-2025)", mine: "Mine A",
    yearFrom: 2022, yearTo: 2025, reportType: "Executive Summary", status: "approved",
    createdAt: "2026-03-15",
  },
  {
    id: 2, title: "Production Analysis Report - All Mines (2025)", mine: "All",
    yearFrom: 2025, yearTo: 2025, reportType: "Production Report", status: "under_review",
    createdAt: "2026-03-14",
  },
  {
    id: 3, title: "Comparative Analysis - Mine A vs Mine B (2024-2025)", mine: "Mine A",
    yearFrom: 2024, yearTo: 2025, reportType: "Comparative Analysis", status: "draft",
    createdAt: "2026-03-13",
  },
];

export const DASHBOARD_INSIGHTS = [
  { id: 1, text: "Mine A production increased 26.8% from 2022 to 2025 (4.1 MT → 5.2 MT).", mine: "Mine A", type: "growth" },
  { id: 2, text: "Mine D showed the highest growth rate at 42.9% over the 4-year period.", mine: "Mine D", type: "growth" },
  { id: 3, text: "5 conflicts detected in 2025 production data requiring verification.", mine: "All", type: "conflict" },
  { id: 4, text: "Mine A capacity utilization improved from 82% to 86.7% in 2025.", mine: "Mine A", type: "efficiency" },
  { id: 5, text: "Total production across all mines reached 15.7 MT in 2025.", mine: "All", type: "summary" },
];

export function getProductionTrend() {
  const years = ["2022", "2023", "2024", "2025"];
  return years.map(year => ({
    year,
    "Mine A": MINE_PRODUCTION["Mine A"][year],
    "Mine B": MINE_PRODUCTION["Mine B"][year],
    "Mine C": MINE_PRODUCTION["Mine C"][year],
    "Mine D": MINE_PRODUCTION["Mine D"][year],
  }));
}

export function getCapacityUtilization() {
  const mines = ["Mine A", "Mine B", "Mine C", "Mine D"];
  return mines.map(mine => ({
    mine,
    production2025: MINE_PRODUCTION[mine]["2025"],
    capacity2025: MINE_CAPACITY[mine]["2025"],
    utilization: Math.round((MINE_PRODUCTION[mine]["2025"] / MINE_CAPACITY[mine]["2025"]) * 100),
  }));
}

export function getGrowthRates() {
  const mines = ["Mine A", "Mine B", "Mine C", "Mine D"];
  return mines.map(mine => {
    const p2022 = MINE_PRODUCTION[mine]["2022"];
    const p2025 = MINE_PRODUCTION[mine]["2025"];
    return {
      mine,
      growth: parseFloat((((p2025 - p2022) / p2022) * 100).toFixed(1)),
      production2022: p2022,
      production2025: p2025,
    };
  });
}