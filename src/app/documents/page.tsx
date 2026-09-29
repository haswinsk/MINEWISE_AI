"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Upload,
  Search,
  Filter,
  Eye,
  Trash2,
  Play,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
} from "lucide-react";

interface Document {
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
}

export default function DocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMine, setFilterMine] = useState("All");
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [processSteps, setProcessSteps] = useState<{ step: string; status: string }[]>([]);

  useEffect(() => {
    fetch("/api/documents")
      .then((r) => r.json())
      .then((d) => {
        setDocuments(d.documents);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setDocuments((prev) => [data.document, ...prev]);
        setShowUpload(false);
      } else {
        alert(data.error);
      }
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleProcess = async (docId: number) => {
    setProcessingId(docId);
    const steps = [
      "Uploading",
      "OCR / Text Extraction",
      "Table Detection",
      "Entity Extraction",
      "Structuring Data",
      "Indexing",
      "Evidence Mapping",
      "Completed",
    ];

    for (let i = 0; i < steps.length; i++) {
      setProcessSteps(steps.slice(0, i + 1).map((s, idx) => ({
        step: s,
        status: idx <= i ? "completed" : "pending",
      })));
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    try {
      await fetch(`/api/documents/${docId}/process`, { method: "POST" });
      setDocuments((prev) =>
        prev.map((d) => (d.id === docId ? { ...d, status: "completed", confidence: 0.94 } : d))
      );
    } catch {
      // ignore
    }

    setTimeout(() => {
      setProcessingId(null);
      setProcessSteps([]);
    }, 1500);
  };

  const filtered = documents.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.mine.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMine = filterMine === "All" || d.mine === filterMine;
    return matchesSearch && matchesMine;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <span className="badge badge-success"><CheckCircle2 size={10} className="mr-1" /> Completed</span>;
      case "processing":
        return <span className="badge badge-warning"><Clock size={10} className="mr-1" /> Processing</span>;
      case "pending":
        return <span className="badge badge-info"><Clock size={10} className="mr-1" /> Pending</span>;
      default:
        return <span className="badge badge-error"><AlertCircle size={10} className="mr-1" /> Error</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Document Repository
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Upload, process, and manage mining documents
          </p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="btn btn-primary"
        >
          <Upload size={16} /> Upload Document
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--text-muted)" }}
          />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg text-sm"
            style={{
              background: "var(--bg-input)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} style={{ color: "var(--text-muted)" }} />
          <select
            value={filterMine}
            onChange={(e) => setFilterMine(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm"
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
            <option value="All">Cross-Mine</option>
          </select>
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="card-static p-6 w-full max-w-md" style={{ background: "var(--bg-card)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                Upload Document
              </h3>
              <button onClick={() => setShowUpload(false)} className="btn btn-ghost p-1">
                <X size={18} />
              </button>
            </div>
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center"
              style={{ borderColor: "var(--border-light)" }}
            >
              <Upload size={32} className="mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
              <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                Drag & drop or click to upload
              </p>
              <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
                PDF, CSV, XLSX, TXT, Images (max 50MB)
              </p>
              <label className="btn btn-primary cursor-pointer">
                {uploading ? "Uploading..." : "Select File"}
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.csv,.xlsx,.txt,.png,.jpg,.jpeg"
                  onChange={handleUpload}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Processing Modal */}
      {processingId && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="card-static p-6 w-full max-w-md" style={{ background: "var(--bg-card)" }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
              Processing Document
            </h3>
            <div className="space-y-3">
              {processSteps.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 size={16} style={{ color: "var(--success)" }} />
                  <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {s.step}
                  </span>
                </div>
              ))}
              {processSteps.length < 8 && (
                <div className="flex items-center gap-3">
                  <div
                    className="animate-spin rounded-full h-4 w-4"
                    style={{ border: "2px solid var(--border)", borderTopColor: "var(--primary-500)" }}
                  />
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                    Processing...
                  </span>
                </div>
              )}
            </div>
            {/* Progress bar */}
            <div className="mt-4 processing-bar h-2 rounded" style={{ background: "var(--bg-surface)" }}>
              <div
                className="h-full rounded transition-all duration-500"
                style={{
                  width: `${(processSteps.length / 8) * 100}%`,
                  background: "linear-gradient(90deg, var(--primary-600), var(--primary-400))",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Document Table */}
      <div className="card-static overflow-hidden">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Document</th>
                <th>Mine</th>
                <th>Type</th>
                <th>Year</th>
                <th>Status</th>
                <th>Confidence</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <FileText size={16} style={{ color: "var(--primary-400)" }} />
                      <span style={{ color: "var(--text-primary)" }}>{doc.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-purple">{doc.mine}</span>
                  </td>
                  <td style={{ color: "var(--text-secondary)" }}>{doc.documentType}</td>
                  <td style={{ color: "var(--text-secondary)" }}>{doc.year}</td>
                  <td>{getStatusBadge(doc.status)}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="confidence-bar w-16">
                        <div
                          className="confidence-bar-fill"
                          style={{
                            width: `${doc.confidence * 100}%`,
                            background: doc.confidence > 0.9 ? "var(--success)" : "var(--warning)",
                          }}
                        />
                      </div>
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {Math.round(doc.confidence * 100)}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      {doc.status === "pending" && (
                        <button
                          onClick={() => handleProcess(doc.id)}
                          className="btn btn-ghost p-1.5"
                          title="Process"
                        >
                          <Play size={14} style={{ color: "var(--primary-400)" }} />
                        </button>
                      )}
                      <button
                        onClick={() => router.push(`/documents/${doc.id}`)}
                        className="btn btn-ghost p-1.5"
                        title="View"
                      >
                        <Eye size={14} style={{ color: "var(--text-secondary)" }} />
                      </button>
                      <button className="btn btn-ghost p-1.5" title="Delete">
                        <Trash2 size={14} style={{ color: "var(--error)" }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <FileText size={40} className="mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
            <p style={{ color: "var(--text-muted)" }}>No documents found</p>
          </div>
        )}
      </div>
    </div>
  );
}