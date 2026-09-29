"use client";

import { useEffect, useState } from "react";
import {
  FileOutput,
  Plus,
  Download,
  RefreshCw,
  Send,
  FileText,
  Clock,
  CheckCircle2,
  Eye,
  Loader2,
  Shield,
  BookOpen,
  MapPin,
  Activity,
} from "lucide-react";

interface ReportSection {
  title: string;
  content: string;
  reviewStatus: "verified" | "needs_review" | "edit";
  evidence?: { value: string; sourceDocument: string; page: number; section: string; confidence: number }[];
}

interface Report {
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

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [formMine, setFormMine] = useState("All");
  const [formYearFrom, setFormYearFrom] = useState("2022");
  const [formYearTo, setFormYearTo] = useState("2025");
  const [formType, setFormType] = useState("Executive Summary");

  useEffect(() => {
    fetch("/api/reports")
      .then((r) => r.json())
      .then((d) => {
        setReports(d.reports);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mine: formMine,
          yearFrom: formYearFrom,
          yearTo: formYearTo,
          reportType: formType,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedReport(data.report);
        setReports((prev) => [data.report, ...prev]);
        setShowGenerator(false);
      }
    } catch {
      // ignore
    } finally {
      setGenerating(false);
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

  const getReviewBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <span className="badge badge-success">Verified</span>;
      case "needs_review":
        return <span className="badge badge-warning">Needs Review</span>;
      case "edit":
        return <span className="badge badge-info">Edit</span>;
      default:
        return null;
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            <FileOutput size={24} className="inline mr-2" style={{ color: "var(--primary-400)" }} />
            Report Generator
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Generate evidence-backed mining reports from indexed documents
          </p>
        </div>
        <button onClick={() => setShowGenerator(true)} className="btn btn-primary">
          <Plus size={16} /> Generate Report
        </button>
      </div>

      {/* Generator Modal */}
      {showGenerator && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="card-static p-6 w-full max-w-md" style={{ background: "var(--bg-card)" }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
              Generate Mining Report
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                  Mine
                </label>
                <select
                  value={formMine}
                  onChange={(e) => setFormMine(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                >
                  <option value="All">All Mines</option>
                  <option value="Mine A">Mine A</option>
                  <option value="Mine B">Mine B</option>
                  <option value="Mine C">Mine C</option>
                  <option value="Mine D">Mine D</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                    From Year
                  </label>
                  <select
                    value={formYearFrom}
                    onChange={(e) => setFormYearFrom(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm"
                    style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                  >
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                    To Year
                  </label>
                  <select
                    value={formYearTo}
                    onChange={(e) => setFormYearTo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm"
                    style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                  >
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                  Report Type
                </label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                >
                  <option>Executive Summary</option>
                  <option>Production Report</option>
                  <option>Comparative Analysis</option>
                  <option>Geological Summary</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={() => setShowGenerator(false)} className="btn btn-secondary flex-1">
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="btn btn-primary flex-1"
              >
                {generating ? <Loader2 size={16} className="animate-spin" /> : <FileOutput size={16} />}
                {generating ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Viewer */}
      {selectedReport && selectedReport.sections && (
        <div className="card-static overflow-hidden">
          <div
            className="px-5 py-4 flex items-center justify-between"
            style={{ borderBottom: "1px solid var(--border)", background: "rgba(124, 58, 237, 0.05)" }}
          >
            <div>
              <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                {selectedReport.title}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                {getStatusBadge(selectedReport.status)}
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Generated on {selectedReport.createdAt}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-secondary text-xs"><RefreshCw size={14} /> Regenerate</button>
              <button className="btn btn-secondary text-xs"><Download size={14} /> Export PDF</button>
              <button className="btn btn-primary text-xs"><Send size={14} /> Send for Review</button>
            </div>
          </div>

          <div className="p-5 space-y-4">
            {selectedReport.sections.map((section, i) => (
              <div key={i} className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                <div
                  className="px-4 py-3 flex items-center justify-between"
                  style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}
                >
                  <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {i + 1}. {section.title}
                  </h3>
                  {getReviewBadge(section.reviewStatus)}
                </div>
                <div className="p-4">
                  <div
                    className="text-sm whitespace-pre-line leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {section.content}
                  </div>
                  {section.evidence && section.evidence.length > 0 && (
                    <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                      <h4 className="text-xs font-medium mb-2 flex items-center gap-1" style={{ color: "var(--accent)" }}>
                        <Shield size={10} /> Evidence
                      </h4>
                      <div className="space-y-1">
                        {section.evidence.map((ev, j) => (
                          <div
                            key={j}
                            className="flex items-center gap-3 text-xs p-2 rounded"
                            style={{ background: "var(--bg-surface)" }}
                          >
                            <FileText size={12} style={{ color: "var(--primary-400)" }} />
                            <span style={{ color: "var(--text-secondary)" }}>{ev.value}</span>
                            <span style={{ color: "var(--text-muted)" }}>from {ev.sourceDocument}</span>
                            <span style={{ color: "var(--text-muted)" }}>Page {ev.page}</span>
                            <span style={{ color: getConfidenceColor(ev.confidence) }}>
                              {Math.round(ev.confidence * 100)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div
              className="text-xs text-center p-3"
              style={{ color: "var(--text-muted)" }}
            >
              Generated from indexed documents &bull; Sample/Demo Data &bull; Evidence references attached
            </div>
          </div>
        </div>
      )}

      {/* Reports List */}
      <div className="card-static overflow-hidden">
        <div className="px-5 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Generated Reports
          </h3>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Report</th>
                <th>Mine</th>
                <th>Period</th>
                <th>Type</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <FileOutput size={14} style={{ color: "var(--primary-400)" }} />
                      <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                        {report.title}
                      </span>
                    </div>
                  </td>
                  <td><span className="badge badge-purple">{report.mine}</span></td>
                  <td style={{ color: "var(--text-secondary)" }}>
                    {report.yearFrom}-{report.yearTo}
                  </td>
                  <td style={{ color: "var(--text-secondary)" }}>{report.reportType}</td>
                  <td>{getStatusBadge(report.status)}</td>
                  <td style={{ color: "var(--text-muted)" }}>{report.createdAt}</td>
                  <td>
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="btn btn-ghost p-1.5"
                    >
                      <Eye size={14} style={{ color: "var(--text-secondary)" }} />
                    </button>
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