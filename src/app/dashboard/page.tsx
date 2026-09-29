"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  CheckCircle2,
  Database,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  Zap,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DashboardData {
  stats: { totalDocuments: number; processedDocuments: number; extractedMetrics: number; detectedConflicts: number };
  insights: { id: number; text: string; mine: string; type: string }[];
  productionTrend: Record<string, unknown>[];
  capacityUtilization: { mine: string; production2025: number; capacity2025: number; utilization: number }[];
  recentDocuments: { id: number; name: string; mine: string; year: number; status: string; confidence: number }[];
}

const COLORS = ["#A855F7", "#F59E0B", "#22C55E", "#3B82F6"];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card-static p-5">
              <div className="skeleton h-4 w-24 mb-3" />
              <div className="skeleton h-8 w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const statCards = [
    { label: "Total Documents", value: data.stats.totalDocuments, icon: FileText, color: "#A855F7" },
    { label: "Processed", value: data.stats.processedDocuments, icon: CheckCircle2, color: "#22C55E" },
    { label: "Extracted Metrics", value: data.stats.extractedMetrics.toLocaleString(), icon: Database, color: "#F59E0B" },
    { label: "Detected Conflicts", value: data.stats.detectedConflicts, icon: AlertTriangle, color: "#EF4444" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Mining Intelligence Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Evidence-driven analytics across all mining operations
          </p>
        </div>
        <div
          className="badge badge-purple px-3 py-1.5 text-xs"
        >
          <Zap size={12} className="mr-1" /> Demo Dataset
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="card p-5 group cursor-default"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-xs font-medium uppercase tracking-wide"
                  style={{ color: "var(--text-muted)" }}
                >
                  {stat.label}
                </span>
                <div
                  className="p-2 rounded-lg"
                  style={{ background: `${stat.color}15` }}
                >
                  <Icon size={16} style={{ color: stat.color }} />
                </div>
              </div>
              <div className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Processing Pipeline */}
      <div className="card-static p-5">
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          Document Processing Pipeline
        </h3>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {["Upload", "OCR/Parse", "Table Extract", "Entity Extract", "Structure", "Index", "Evidence", "AI Retrieval", "Validate", "Report"].map(
            (step, i) => (
              <div key={i} className="flex items-center gap-2 shrink-0">
                <div
                  className="px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{
                    background: "rgba(124, 58, 237, 0.12)",
                    color: "var(--primary-300)",
                    border: "1px solid rgba(124, 58, 237, 0.25)",
                  }}
                >
                  {step}
                </div>
                {i < 9 && (
                  <div
                    className="w-6 h-0.5 rounded"
                    style={{ background: "var(--primary-700)" }}
                  />
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Production Trend */}
        <div className="card-static p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
            Production Trend (MT)
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data.productionTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="year" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-light)",
                  borderRadius: 8,
                  color: "var(--text-primary)",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="Mine A" stroke="#A855F7" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Mine B" stroke="#F59E0B" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Mine C" stroke="#22C55E" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Mine D" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Mine Comparison */}
        <div className="card-static p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
            Capacity Utilization (2025)
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.capacityUtilization}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="mine" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-light)",
                  borderRadius: 8,
                  color: "var(--text-primary)",
                }}
              />
              <Legend />
              <Bar dataKey="production2025" name="Production" fill="#A855F7" radius={[4, 4, 0, 0]} />
              <Bar dataKey="capacity2025" name="Capacity" fill="rgba(124, 58, 237, 0.3)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Documents */}
        <div className="card-static p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
            Recent Documents
          </h3>
          <div className="space-y-2">
            {data.recentDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 rounded-lg transition-colors"
                style={{ background: "var(--bg-surface)" }}
              >
                <div className="flex items-center gap-3">
                  <FileText size={16} style={{ color: "var(--primary-400)" }} />
                  <div>
                    <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      {doc.name}
                    </div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {doc.mine} &bull; {doc.year}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={doc.status === "completed" ? "badge badge-success" : "badge badge-warning"}>
                    {doc.status}
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {Math.round(doc.confidence * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="card-static p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
            Recent AI Insights
          </h3>
          <div className="space-y-3">
            {data.insights.map((insight) => (
              <div
                key={insight.id}
                className="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all"
                style={{ background: "var(--bg-surface)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(124, 58, 237, 0.08)";
                  e.currentTarget.style.borderColor = "var(--primary-700)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--bg-surface)";
                  e.currentTarget.style.borderColor = "transparent";
                }}
              >
                <TrendingUp size={16} className="mt-0.5 shrink-0" style={{ color: "var(--accent)" }} />
                <div className="flex-1">
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {insight.text}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="badge badge-purple">{insight.mine}</span>
                    <span className="badge badge-info">{insight.type}</span>
                  </div>
                </div>
                <ArrowUpRight size={14} style={{ color: "var(--text-muted)" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}