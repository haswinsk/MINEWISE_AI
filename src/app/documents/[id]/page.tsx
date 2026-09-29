"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  FileText,
  ArrowLeft,
  MapPin,
  Calendar,
  TrendingUp,
  Activity,
  Shield,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

interface ExtractedEntity {
  value: string;
  confidence: number;
  page: number;
  section: string;
}

interface DocumentDetail {
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
  extractedEntities?: Record<string, ExtractedEntity>;
}

export default function DocumentViewerPage() {
  const params = useParams();
  const [doc, setDoc] = useState<DocumentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/documents/${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        setDoc(d.document);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

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

  if (!doc) {
    return (
      <div className="text-center py-20">
        <FileText size={48} className="mx-auto mb-4" style={{ color: "var(--text-muted)" }} />
        <p style={{ color: "var(--text-muted)" }}>Document not found</p>
      </div>
    );
  }

  const entities = doc.extractedEntities || {};
  const entityEntries = Object.entries(entities);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "var(--success)";
    if (confidence >= 0.8) return "var(--warning)";
    return "var(--error)";
  };

  const selectedEv = selectedEntity ? entities[selectedEntity] : null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Button */}
      <Link
        href="/documents"
        className="inline-flex items-center gap-2 text-sm"
        style={{ color: "var(--text-muted)" }}
      >
        <ArrowLeft size={16} /> Back to Documents
      </Link>

      {/* Document Header */}
      <div className="card-static p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className="p-3 rounded-xl"
              style={{ background: "rgba(124, 58, 237, 0.15)" }}
            >
              <FileText size={28} style={{ color: "var(--primary-400)" }} />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                {doc.name}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="badge badge-purple">{doc.mine}</span>
                <span className="badge badge-info">{doc.documentType}</span>
                <span className="badge badge-success">{doc.status}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm" style={{ color: "var(--text-muted)" }}>
              Overall Confidence
            </div>
            <div className="text-2xl font-bold" style={{ color: getConfidenceColor(doc.confidence) }}>
              {Math.round(doc.confidence * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* LEFT: Document Preview */}
        <div className="card-static p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
            Document Preview
          </h3>
          <div
            className="rounded-lg p-6 text-center"
            style={{ background: "var(--bg-surface)", minHeight: 400 }}
          >
            <div
              className="mx-auto mb-4 p-4 rounded-xl inline-block"
              style={{ background: "rgba(124, 58, 237, 0.1)" }}
            >
              <FileText size={48} style={{ color: "var(--primary-500)" }} />
            </div>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {doc.name}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              {doc.pageCount} pages &bull; {doc.fileSize}
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs p-2 rounded" style={{ background: "var(--bg-card)" }}>
                <span style={{ color: "var(--text-muted)" }}>File Type</span>
                <span style={{ color: "var(--text-secondary)" }}>{doc.documentType}</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 rounded" style={{ background: "var(--bg-card)" }}>
                <span style={{ color: "var(--text-muted)" }}>Upload Date</span>
                <span style={{ color: "var(--text-secondary)" }}>{doc.uploadDate}</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 rounded" style={{ background: "var(--bg-card)" }}>
                <span style={{ color: "var(--text-muted)" }}>Size</span>
                <span style={{ color: "var(--text-secondary)" }}>{doc.fileSize}</span>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER: Extracted Content */}
        <div className="card-static p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
            Extracted Entities
          </h3>
          <div className="space-y-2">
            {entityEntries.map(([key, entity]) => {
              const isSelected = selectedEntity === key;
              return (
                <div
                  key={key}
                  className="p-3 rounded-lg cursor-pointer transition-all"
                  style={{
                    background: isSelected ? "rgba(124, 58, 237, 0.12)" : "var(--bg-surface)",
                    border: isSelected
                      ? "1px solid rgba(124, 58, 237, 0.3)"
                      : "1px solid transparent",
                  }}
                  onClick={() => setSelectedEntity(isSelected ? null : key)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                        {key}
                      </span>
                      <p className="text-base font-semibold mt-0.5" style={{ color: "var(--text-primary)" }}>
                        {entity.value}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="confidence-bar w-12">
                        <div
                          className="confidence-bar-fill"
                          style={{
                            width: `${entity.confidence * 100}%`,
                            background: getConfidenceColor(entity.confidence),
                          }}
                        />
                      </div>
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {Math.round(entity.confidence * 100)}%
                      </span>
                      <ChevronRight
                        size={14}
                        style={{
                          color: "var(--text-muted)",
                          transform: isSelected ? "rotate(90deg)" : "none",
                          transition: "transform 0.2s",
                        }}
                      />
                    </div>
                  </div>
                  {isSelected && (
                    <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span style={{ color: "var(--text-muted)" }}>Page: </span>
                          <span style={{ color: "var(--text-secondary)" }}>{entity.page}</span>
                        </div>
                        <div>
                          <span style={{ color: "var(--text-muted)" }}>Section: </span>
                          <span style={{ color: "var(--text-secondary)" }}>{entity.section}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Evidence Panel */}
        <div className="card-static p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
            <Shield size={14} className="inline mr-2" style={{ color: "var(--accent)" }} />
            Evidence Panel
          </h3>

          {selectedEv ? (
            <div
              className="p-4 rounded-lg"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="text-center mb-4">
                <div className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                  {selectedEv.value}
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  {selectedEntity}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs">
                  <FileText size={12} style={{ color: "var(--primary-400)" }} />
                  <span style={{ color: "var(--text-muted)" }}>Source:</span>
                  <span style={{ color: "var(--text-secondary)" }}>{doc.name}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <MapPin size={12} style={{ color: "var(--primary-400)" }} />
                  <span style={{ color: "var(--text-muted)" }}>Page:</span>
                  <span style={{ color: "var(--text-secondary)" }}>{selectedEv.page}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <ChevronRight size={12} style={{ color: "var(--primary-400)" }} />
                  <span style={{ color: "var(--text-muted)" }}>Section:</span>
                  <span style={{ color: "var(--text-secondary)" }}>{selectedEv.section}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Activity size={12} style={{ color: "var(--primary-400)" }} />
                  <span style={{ color: "var(--text-muted)" }}>Confidence:</span>
                  <span style={{ color: getConfidenceColor(selectedEv.confidence) }}>
                    {Math.round(selectedEv.confidence * 100)}%
                  </span>
                </div>
              </div>

              <div
                className="mt-4 p-3 rounded-lg text-xs"
                style={{
                  background: "rgba(124, 58, 237, 0.08)",
                  border: "1px solid rgba(124, 58, 237, 0.15)",
                }}
              >
                <div className="flex items-center gap-1 mb-1">
                  <Shield size={10} style={{ color: "var(--primary-400)" }} />
                  <span className="font-medium" style={{ color: "var(--primary-300)" }}>
                    Evidence Trace
                  </span>
                </div>
                <p style={{ color: "var(--text-muted)" }}>
                  Value &quot;{selectedEv.value}&quot; extracted from {doc.name}, page {selectedEv.page}, section &quot;{selectedEv.section}&quot; with {Math.round(selectedEv.confidence * 100)}% confidence.
                </p>
              </div>
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center py-12 text-center"
              style={{ color: "var(--text-muted)" }}
            >
              <Shield size={32} className="mb-3 opacity-50" />
              <p className="text-sm">Click an entity to view its evidence</p>
              <p className="text-xs mt-1">Every extracted value is traceable</p>
            </div>
          )}

          {/* Quick Evidence Summary */}
          <div className="mt-4">
            <h4 className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>
              Quick Evidence Summary
            </h4>
            <div className="space-y-2">
              {entityEntries.slice(0, 4).map(([key, entity]) => (
                <div
                  key={key}
                  className="flex items-center justify-between text-xs p-2 rounded"
                  style={{ background: "var(--bg-surface)" }}
                >
                  <span style={{ color: "var(--text-secondary)" }}>{key}</span>
                  <span style={{ color: getConfidenceColor(entity.confidence) }}>
                    P{entity.page} &bull; {Math.round(entity.confidence * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}