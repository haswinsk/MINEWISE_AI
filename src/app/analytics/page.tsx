"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Activity,
  Filter,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface AnalyticsData {
  productionTrend: Record<string, unknown>[];
  capacityUtilization: { mine: string; production2025: number; capacity2025: number; utilization: number }[];
  growthRates: { mine: string; growth: number; production2022: number; production2025: number }[];
  documentStatus: { completed: number; processing: number; pending: number; failed: number };
  metricsByType: { production: number; capacity: number };
  totalMetrics: number;
}

const COLORS = ["#A855F7", "#F59E0B", "#22C55E", "#3B82F6"];

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterMine, setFilterMine] = useState("All");
  const [filterYear, setFilterYear] = useState("All");

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div
          className="animate-spin rounded-full h-8 w-8"
          style={{ border: "3px solid var(--border)", borderTopColor: "var(--primary-500)" }}
        />
      </div>
    );
  }

  if (!data) return null;

  const docStatusData = [
    { name: "Completed", value: data.documentStatus.completed },
    { name: "Pending", value: data.documentStatus.pending },
    { name: "Processing", value: data.documentStatus.processing },
  ];

  const filteredTrend =
    filterMine === "All"
      ? data.productionTrend
      : data.productionTrend.map((t) => ({
          year: t.year,
          [filterMine]: t[filterMine],
        }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Mining Analytics
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Comprehensive production and operational analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} style={{ color: "var(--text-muted)" }} />
          <select
            value={filterMine}
            onChange={(e) => setFilterMine(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-sm"
            style={{
              background: "var(--bg-input)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
          >
            <option value="All">All Mines</option>
            <option value="Mine A">Mine A</option>
            <option value="Mine B">Mine B</option>
            <option value="Mine C">Mine C</option>
            <option value="Mine D">Mine D</option>
          </select>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-sm"
            style={{
              background: "var(--bg-input)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
          >
            <option value="All">All Years</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 size={16} style={{ color: "var(--primary-400)" }} />
            <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Total Metrics
            </span>
          </div>
          <div className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            {data.totalMetrics}
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} style={{ color: "var(--success)" }} />
            <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Production Metrics
            </span>
          </div>
          <div className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            {data.metricsByType.production}
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={16} style={{ color: "var(--accent)" }} />
            <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Capacity Metrics
            </span>
          </div>
          <div className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            {data.metricsByType.capacity}
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 size={16} style={{ color: "var(--info)" }} />
            <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Documents Processed
            </span>
          </div>
          <div className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            {data.documentStatus.completed}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Production Trend */}
        <div className="card-static p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
            Production Trend (MT)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredTrend}>
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
              {(filterMine === "All" ? ["Mine A", "Mine B", "Mine C", "Mine D"] : [filterMine]).map(
                (mine, i) => (
                  <Line
                    key={mine}
                    type="monotone"
                    dataKey={mine}
                    stroke={COLORS[i]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                )
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Mine Comparison */}
        <div className="card-static p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
            2025 Production Comparison (MT)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
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

        {/* Growth Rates */}
        <div className="card-static p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
            Growth Rate (2022-2025)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.growthRates} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" stroke="var(--text-muted)" fontSize={12} />
              <YAxis type="category" dataKey="mine" stroke="var(--text-muted)" fontSize={12} width={60} />
              <Tooltip
                contentStyle={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-light)",
                  borderRadius: 8,
                  color: "var(--text-primary)",
                }}
              />
              <Bar dataKey="growth" name="Growth %" fill="#F59E0B" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Capacity Utilization */}
        <div className="card-static p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
            Document Processing Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={docStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {docStatusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-light)",
                  borderRadius: 8,
                  color: "var(--text-primary)",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Utilization Table */}
      <div className="card-static p-5">
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          Capacity Utilization Detail
        </h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Mine</th>
                <th>Production (MT)</th>
                <th>Capacity (MT)</th>
                <th>Utilization</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.capacityUtilization.map((m) => (
                <tr key={m.mine}>
                  <td className="font-medium" style={{ color: "var(--text-primary)" }}>{m.mine}</td>
                  <td style={{ color: "var(--text-secondary)" }}>{m.production2025}</td>
                  <td style={{ color: "var(--text-secondary)" }}>{m.capacity2025}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="confidence-bar w-20">
                        <div
                          className="confidence-bar-fill"
                          style={{
                            width: `${m.utilization}%`,
                            background:
                              m.utilization > 85
                                ? "var(--success)"
                                : m.utilization > 70
                                ? "var(--warning)"
                                : "var(--error)",
                          }}
                        />
                      </div>
                      <span style={{ color: "var(--text-secondary)" }}>{m.utilization}%</span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={
                        m.utilization > 85
                          ? "badge badge-success"
                          : m.utilization > 70
                          ? "badge badge-warning"
                          : "badge badge-error"
                      }
                    >
                      {m.utilization > 85 ? "Excellent" : m.utilization > 70 ? "Good" : "Low"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}