"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  FileText,
  ArrowRight,
  Shield,
  CheckCircle2,
  Clock,
  UserCheck,
} from "lucide-react";

interface Conflict {
  id: number;
  metric: string;
  mine: string;
  year: number;
  source1: { document: string; value: string; page: number; confidence: number };
  source2: { document: string; value: string; page: number; confidence: number };
  status: string;
}

export default function ConflictsPage() {
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetch("/api/conflicts")
      .then((r) => r.json())
      .then((d) => {
        setConflicts(d.conflicts);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = filterStatus === "all"
    ? conflicts
    : conflicts.filter((c) => c.status === filterStatus);

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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            <AlertTriangle size={24} className="inline mr-2" style={{ color: "var(--warning)" }} />
            Conflict Center
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Detected discrepancies between mining documents
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-error">
            {conflicts.filter((c) => c.status === "pending").length} Pending
          </span>
          <span className="badge badge-success">
            {conflicts.filter((c) => c.status === "resolved").length} Resolved
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {["all", "pending", "resolved"].map((f) => (
          <button
            key={f}
            onClick={() => setFilterStatus(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all`}
            style={{
              background: filterStatus === f ? "rgba(124, 58, 237, 0.15)" : "var(--bg-card)",
              color: filterStatus === f ? "var(--primary-400)" : "var(--text-muted)",
              border: filterStatus === f
                ? "1px solid rgba(124, 58, 237, 0.3)"
                : "1px solid var(--border)",
            }}
          >
            {f === "all" ? `All (${conflicts.length})` : `${f} (${conflicts.filter((c) => c.status === f).length})`}
          </button>
        ))}
      </div>

      {/* Conflicts */}
      <div className="space-y-4">
        {filtered.map((conflict) => (
          <div key={conflict.id} className="card-static overflow-hidden">
            {/* Conflict Header */}
            <div
              className="px-5 py-3 flex items-center justify-between"
              style={{
                background:
                  conflict.status === "pending"
                    ? "rgba(239, 68, 68, 0.08)"
                    : "rgba(34, 197, 94, 0.08)",
                borderBottom: `1px solid ${
                  conflict.status === "pending"
                    ? "rgba(239, 68, 68, 0.2)"
                    : "rgba(34, 197, 94, 0.2)"
                }`,
              }}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle
                  size={18}
                  style={{
                    color: conflict.status === "pending" ? "var(--error)" : "var(--success)",
                  }}
                />
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {conflict.metric}
                  </h3>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {conflict.mine} &bull; {conflict.year}
                  </span>
                </div>
              </div>
              <span
                className={conflict.status === "pending" ? "badge badge-error" : "badge badge-success"}
              >
                {conflict.status === "pending" ? (
                  <><Clock size={10} className="mr-1" /> Pending Review</>
                ) : (
                  <><CheckCircle2 size={10} className="mr-1" /> Resolved</>
                )}
              </span>
            </div>

            {/* Conflict Content */}
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Source 1 */}
                <div
                  className="p-4 rounded-lg"
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <FileText size={14} style={{ color: "var(--primary-400)" }} />
                    <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                      SOURCE 1
                    </span>
                  </div>
                  <div className="text-2xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
                    {conflict.source1.value}
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span style={{ color: "var(--text-muted)" }}>Document</span>
                      <span style={{ color: "var(--text-secondary)" }}>{conflict.source1.document}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: "var(--text-muted)" }}>Page</span>
                      <span style={{ color: "var(--text-secondary)" }}>{conflict.source1.page}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: "var(--text-muted)" }}>Confidence</span>
                      <span style={{ color: "var(--text-secondary)" }}>
                        {Math.round(conflict.source1.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Source 2 */}
                <div
                  className="p-4 rounded-lg"
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <FileText size={14} style={{ color: "var(--accent)" }} />
                    <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                      SOURCE 2
                    </span>
                  </div>
                  <div className="text-2xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
                    {conflict.source2.value}
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span style={{ color: "var(--text-muted)" }}>Document</span>
                      <span style={{ color: "var(--text-secondary)" }}>{conflict.source2.document}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: "var(--text-muted)" }}>Page</span>
                      <span style={{ color: "var(--text-secondary)" }}>{conflict.source2.page}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: "var(--text-muted)" }}>Confidence</span>
                      <span style={{ color: "var(--text-secondary)" }}>
                        {Math.round(conflict.source2.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Human Review Notice */}
              {conflict.status === "pending" && (
                <div
                  className="mt-4 p-3 rounded-lg flex items-center gap-3"
                  style={{
                    background: "rgba(245, 158, 11, 0.08)",
                    border: "1px solid rgba(245, 158, 11, 0.2)",
                  }}
                >
                  <UserCheck size={18} style={{ color: "var(--accent)" }} />
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: "var(--accent)" }}>
                      Human verification required
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      This conflict must be manually reviewed before the correct value can be determined.
                    </p>
                  </div>
                  <button className="btn btn-accent text-xs">
                    <Shield size={14} /> Review Conflict
                  </button>
                </div>
              )}

              {conflict.status === "resolved" && (
                <div
                  className="mt-4 p-3 rounded-lg flex items-center gap-3"
                  style={{
                    background: "rgba(34, 197, 94, 0.08)",
                    border: "1px solid rgba(34, 197, 94, 0.2)",
                  }}
                >
                  <CheckCircle2 size={18} style={{ color: "var(--success)" }} />
                  <p className="text-sm" style={{ color: "#4ADE80" }}>
                    This conflict has been reviewed and resolved.
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <AlertTriangle size={48} className="mx-auto mb-3" style={{ color: "var(--text-muted)", opacity: 0.3 }} />
          <p style={{ color: "var(--text-muted)" }}>No conflicts found</p>
        </div>
      )}
    </div>
  );
}