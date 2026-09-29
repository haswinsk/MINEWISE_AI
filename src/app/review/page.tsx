"use client";

import { useEffect, useState } from "react";
import {
  ClipboardCheck,
  FileText,
  CheckCircle2,
  XCircle,
  Edit3,
  Clock,
  Shield,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Loader2,
} from "lucide-react";

interface ReportSection {
  title: string;
  content: string;
  reviewStatus: "verified" | "needs_review" | "edit";
  evidence?: { value: string; sourceDocument: string; page: number; section: string; confidence: number }[];
}

interface ReviewReport {
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

export default function ReviewPage() {
  const [reports, setReports] = useState<ReviewReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedReport, setExpandedReport] = useState<number | null>(null);
  const [sectionStatuses, setSectionStatuses] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/reports")
      .then((r) => r.json())
      .then((d) => {
        setReports(d.reports);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleReview = async (reportId: number, sectionIndex: number, action: string) => {
    const key = `${reportId}-${sectionIndex}`;
    setSectionStatuses((prev) => ({ ...prev, [key]: action }));
  };

  const handleSubmitReview = async (reportId: number, status: string) => {
    setSubmitting(true);
    try {
      await fetch(`/api/reports/${reportId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: status }),
      });
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status } : r))
      );
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <span className="badge badge-success"><CheckCircle2 size={10} className="mr-1" /> Approved</span>;
      case "under_review":
        return <span className="badge badge-warning"><Clock size={10} className="mr-1" /> Under Review</span>;
      case "draft":
        return <span className="badge badge-info"><FileText size={10} className="mr-1" /> Draft</span>;
      default:
        return <span className="badge badge-purple">{status}</span>;
    }
  };

  const getReviewStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle2 size={14} style={{ color: "var(--success)" }} />;
      case "needs_review":
        return <AlertTriangle size={14} style={{ color: "var(--warning)" }} />;
      case "edit":
        return <Edit3 size={14} style={{ color: "var(--info)" }} />;
      default:
        return <Clock size={14} style={{ color: "var(--text-muted)" }} />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "var(--success)";
    if (confidence >= 0.8) return "var(--warning)";
    return "var(--error)";
  };

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
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          <ClipboardCheck size={24} className="inline mr-2" style={{ color: "var(--primary-400)" }} />
          Review & Approval
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Human-in-the-loop verification for AI-generated reports
        </p>
      </div>

      {/* Reports */}
      <div className="space-y-4">
        {reports.map((report) => {
          const isExpanded = expandedReport === report.id;
          return (
            <div key={report.id} className="card-static overflow-hidden">
              {/* Report Header */}
              <button
                onClick={() => setExpandedReport(isExpanded ? null : report.id)}
                className="w-full px-5 py-4 flex items-center justify-between transition-colors"
                style={{ background: isExpanded ? "rgba(124, 58, 237, 0.05)" : "transparent" }}
              >
                <div className="flex items-center gap-3 text-left">
                  <FileText size={18} style={{ color: "var(--primary-400)" }} />
                  <div>
                    <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {report.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusBadge(report.status)}
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {report.reportType} &bull; {report.createdAt}
                      </span>
                    </div>
                  </div>
                </div>
                {isExpanded ? <ChevronUp size={16} style={{ color: "var(--text-muted)" }} /> : <ChevronDown size={16} style={{ color: "var(--text-muted)" }} />}
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-5 pb-5" style={{ borderTop: "1px solid var(--border)" }}>
                  <div className="space-y-3 mt-4">
                    {report.sections ? (
                      report.sections.map((section, i) => {
                        const key = `${report.id}-${i}`;
                        const currentStatus = sectionStatuses[key] || section.reviewStatus;
                        return (
                          <div
                            key={i}
                            className="rounded-lg overflow-hidden"
                            style={{ border: "1px solid var(--border)" }}
                          >
                            <div
                              className="px-4 py-3 flex items-center justify-between"
                              style={{ background: "var(--bg-surface)" }}
                            >
                              <div className="flex items-center gap-2">
                                {getReviewStatusIcon(currentStatus)}
                                <h4 className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                                  {i + 1}. {section.title}
                                </h4>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleReview(report.id, i, "verified")}
                                  className="btn p-1.5 rounded-lg"
                                  style={{
                                    background: currentStatus === "verified" ? "rgba(34, 197, 94, 0.15)" : "transparent",
                                    color: currentStatus === "verified" ? "var(--success)" : "var(--text-muted)",
                                  }}
                                  title="Verified"
                                >
                                  <CheckCircle2 size={16} />
                                </button>
                                <button
                                  onClick={() => handleReview(report.id, i, "needs_review")}
                                  className="btn p-1.5 rounded-lg"
                                  style={{
                                    background: currentStatus === "needs_review" ? "rgba(245, 158, 11, 0.15)" : "transparent",
                                    color: currentStatus === "needs_review" ? "var(--warning)" : "var(--text-muted)",
                                  }}
                                  title="Needs Review"
                                >
                                  <AlertTriangle size={16} />
                                </button>
                                <button
                                  onClick={() => handleReview(report.id, i, "edit")}
                                  className="btn p-1.5 rounded-lg"
                                  style={{
                                    background: currentStatus === "edit" ? "rgba(59, 130, 246, 0.15)" : "transparent",
                                    color: currentStatus === "edit" ? "var(--info)" : "var(--text-muted)",
                                  }}
                                  title="Edit"
                                >
                                  <Edit3 size={16} />
                                </button>
                              </div>
                            </div>
                            <div className="p-4">
                              <p
                                className="text-sm whitespace-pre-line leading-relaxed"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                {section.content}
                              </p>
                              {section.evidence && section.evidence.length > 0 && (
                                <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                                  <h5 className="text-xs font-medium mb-1 flex items-center gap-1" style={{ color: "var(--accent)" }}>
                                    <Shield size={10} /> Evidence
                                  </h5>
                                  {section.evidence.slice(0, 3).map((ev, j) => (
                                    <div key={j} className="text-xs p-1.5 rounded mt-1" style={{ background: "var(--bg-surface)" }}>
                                      <span style={{ color: "var(--text-secondary)" }}>{ev.value}</span>
                                      <span style={{ color: "var(--text-muted)" }}> — {ev.sourceDocument}, p.{ev.page}</span>
                                      <span style={{ color: getConfidenceColor(ev.confidence) }}> ({Math.round(ev.confidence * 100)}%)</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div
                        className="text-center py-8"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <p className="text-sm">Generate a report with sections to begin review</p>
                      </div>
                    )}
                  </div>

                  {/* Review Actions */}
                  <div className="flex gap-2 mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                    <button
                      onClick={() => handleSubmitReview(report.id, "rejected")}
                      disabled={submitting}
                      className="btn btn-danger"
                    >
                      <XCircle size={16} /> Reject
                    </button>
                    <button
                      onClick={() => handleSubmitReview(report.id, "under_review")}
                      disabled={submitting}
                      className="btn btn-secondary"
                    >
                      <Clock size={16} /> Mark Under Review
                    </button>
                    <button
                      onClick={() => handleSubmitReview(report.id, "approved")}
                      disabled={submitting}
                      className="btn btn-primary"
                    >
                      {submitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                      Approve
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {reports.length === 0 && (
        <div className="text-center py-16">
          <ClipboardCheck size={48} className="mx-auto mb-3" style={{ color: "var(--text-muted)", opacity: 0.3 }} />
          <p style={{ color: "var(--text-muted)" }}>No reports to review</p>
        </div>
      )}
    </div>
  );
}