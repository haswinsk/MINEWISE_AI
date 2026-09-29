"use client";

import { useEffect, useState } from "react";
import {
  Tags,
  FileText,
  BarChart3,
  X,
} from "lucide-react";

interface Topic {
  id: number;
  name: string;
  frequency: number;
  category: string;
  relatedDocuments: string[];
}

export default function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [filterCategory, setFilterCategory] = useState("All");

  useEffect(() => {
    fetch("/api/topics")
      .then((r) => r.json())
      .then((d) => {
        setTopics(d.topics);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = ["All", ...new Set(topics.map((t) => t.category))];
  const maxFreq = Math.max(...topics.map((t) => t.frequency));
  const filtered = filterCategory === "All" ? topics : topics.filter((t) => t.category === filterCategory);

  const getTopicSize = (freq: number) => {
    const ratio = freq / maxFreq;
    if (ratio > 0.8) return "text-2xl";
    if (ratio > 0.6) return "text-xl";
    if (ratio > 0.4) return "text-lg";
    if (ratio > 0.2) return "text-base";
    return "text-sm";
  };

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      Operations: "#A855F7",
      Geology: "#22C55E",
      Compliance: "#F59E0B",
      Development: "#3B82F6",
      Infrastructure: "#EC4899",
      Logistics: "#14B8A6",
      HR: "#F97316",
      Finance: "#8B5CF6",
    };
    return colors[cat] || "#A855F7";
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
          <Tags size={24} className="inline mr-2" style={{ color: "var(--primary-400)" }} />
          Topic Identification
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Key topics extracted from mining documents using AI analysis
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: filterCategory === cat ? "rgba(124, 58, 237, 0.15)" : "var(--bg-card)",
              color: filterCategory === cat ? "var(--primary-400)" : "var(--text-muted)",
              border: filterCategory === cat
                ? "1px solid rgba(124, 58, 237, 0.3)"
                : "1px solid var(--border)",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Word Cloud */}
        <div className="lg:col-span-2 card-static p-6">
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
            Mining Topics Word Cloud
          </h3>
          <div className="flex flex-wrap gap-3 items-center justify-center py-6">
            {filtered.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic)}
                className={`${getTopicSize(topic.frequency)} font-medium px-3 py-1.5 rounded-lg transition-all cursor-pointer`}
                style={{
                  color: getCategoryColor(topic.category),
                  background: selectedTopic?.id === topic.id
                    ? `${getCategoryColor(topic.category)}20`
                    : "transparent",
                  border: selectedTopic?.id === topic.id
                    ? `1px solid ${getCategoryColor(topic.category)}40`
                    : "1px solid transparent",
                  opacity: 0.7 + (topic.frequency / maxFreq) * 0.3,
                }}
              >
                {topic.name}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Details */}
        <div className="card-static p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
            Topic Details
          </h3>
          {selectedTopic ? (
            <div className="space-y-4">
              <div>
                <h4
                  className="text-lg font-bold"
                  style={{ color: getCategoryColor(selectedTopic.category) }}
                >
                  {selectedTopic.name}
                </h4>
                <span
                  className="badge mt-1"
                  style={{
                    background: `${getCategoryColor(selectedTopic.category)}15`,
                    color: getCategoryColor(selectedTopic.category),
                    border: `1px solid ${getCategoryColor(selectedTopic.category)}30`,
                  }}
                >
                  {selectedTopic.category}
                </span>
              </div>

              <div
                className="p-3 rounded-lg"
                style={{ background: "var(--bg-surface)" }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 size={14} style={{ color: "var(--text-muted)" }} />
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>Frequency</span>
                </div>
                <div className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                  {selectedTopic.frequency}
                </div>
                <div className="confidence-bar mt-2">
                  <div
                    className="confidence-bar-fill"
                    style={{
                      width: `${(selectedTopic.frequency / maxFreq) * 100}%`,
                      background: getCategoryColor(selectedTopic.category),
                    }}
                  />
                </div>
              </div>

              <div>
                <h4 className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>
                  Related Documents
                </h4>
                <div className="space-y-2">
                  {selectedTopic.relatedDocuments.map((doc, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2 rounded-lg text-sm"
                      style={{ background: "var(--bg-surface)" }}
                    >
                      <FileText size={14} style={{ color: "var(--primary-400)" }} />
                      <span style={{ color: "var(--text-secondary)" }}>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center py-12 text-center"
              style={{ color: "var(--text-muted)" }}
            >
              <Tags size={32} className="mb-3 opacity-50" />
              <p className="text-sm">Select a topic to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Topic Table */}
      <div className="card-static overflow-hidden">
        <div className="px-5 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            All Topics
          </h3>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Topic</th>
                <th>Category</th>
                <th>Frequency</th>
                <th>Documents</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((topic) => (
                <tr
                  key={topic.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedTopic(topic)}
                >
                  <td>
                    <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                      {topic.name}
                    </span>
                  </td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        background: `${getCategoryColor(topic.category)}15`,
                        color: getCategoryColor(topic.category),
                        border: `1px solid ${getCategoryColor(topic.category)}30`,
                      }}
                    >
                      {topic.category}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="confidence-bar w-16">
                        <div
                          className="confidence-bar-fill"
                          style={{
                            width: `${(topic.frequency / maxFreq) * 100}%`,
                            background: getCategoryColor(topic.category),
                          }}
                        />
                      </div>
                      <span style={{ color: "var(--text-secondary)" }}>{topic.frequency}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ color: "var(--text-secondary)" }}>
                      {topic.relatedDocuments.length} docs
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