"use client";

import { useState } from "react";
import {
  Send,
  Loader2,
  FileText,
  MapPin,
  BookOpen,
  Activity,
  TrendingUp,
  MessageSquareText,
  Sparkles,
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

interface Evidence {
  value: string;
  sourceDocument: string;
  page: number;
  section: string;
  confidence: number;
}

interface QueryResult {
  success: boolean;
  question: string;
  answer: string;
  evidence: Evidence[];
  chartData?: Record<string, unknown>[];
  chartType?: string;
  growth?: string;
}

const EXAMPLE_QUESTIONS = [
  "What was Mine A production from 2022 to 2025?",
  "Which mine had the highest production growth?",
  "Compare Mine A and Mine B production in 2024.",
  "What conflicts exist in the 2025 reports?",
  "Generate an executive summary for Mine A.",
];

export default function QueryPage() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<QueryResult[]>([]);
  const [currentResult, setCurrentResult] = useState<QueryResult | null>(null);

  const handleSubmit = async (q?: string) => {
    const query = q || question;
    if (!query.trim()) return;

    setLoading(true);
    setCurrentResult(null);

    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query }),
      });
      const data = await res.json();
      setCurrentResult(data);
      setResults((prev) => [data, ...prev]);
    } catch {
      setCurrentResult({
        success: false,
        question: query,
        answer: "Failed to process query. Please try again.",
        evidence: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "var(--success)";
    if (confidence >= 0.8) return "var(--warning)";
    return "var(--error)";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          <Sparkles size={24} className="inline mr-2" style={{ color: "var(--primary-400)" }} />
          Ask Mining Intelligence
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Query your mining documents with evidence-backed AI responses
        </p>
      </div>

      {/* Query Input */}
      <div className="card-static p-5">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <MessageSquareText
              size={16}
              className="absolute left-3 top-3"
              style={{ color: "var(--text-muted)" }}
            />
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder="Ask a question about your mining documents..."
              rows={2}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm resize-none"
              style={{
                background: "var(--bg-input)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
            />
          </div>
          <button
            onClick={() => handleSubmit()}
            disabled={loading || !question.trim()}
            className="btn btn-primary self-end"
            style={{ opacity: loading || !question.trim() ? 0.5 : 1 }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            Ask
          </button>
        </div>

        {/* Example Questions */}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            Try:
          </span>
          {EXAMPLE_QUESTIONS.map((eq, i) => (
            <button
              key={i}
              onClick={() => {
                setQuestion(eq);
                handleSubmit(eq);
              }}
              className="text-xs px-2.5 py-1 rounded-full transition-all"
              style={{
                background: "rgba(124, 58, 237, 0.08)",
                color: "var(--primary-300)",
                border: "1px solid rgba(124, 58, 237, 0.2)",
              }}
            >
              {eq}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="card-static p-8 text-center">
          <Loader2
            size={32}
            className="animate-spin mx-auto mb-3"
            style={{ color: "var(--primary-400)" }}
          />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Analyzing documents and retrieving evidence...
          </p>
        </div>
      )}

      {/* Result */}
      {currentResult && !loading && (
        <div className="space-y-4 animate-fade-in">
          {/* Answer */}
          <div className="card-static p-5">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--primary-400)" }}>
              <Sparkles size={14} /> AI Answer
            </h3>
            <div
              className="text-sm whitespace-pre-line leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {currentResult.answer}
            </div>
            {currentResult.growth && (
              <div
                className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{
                  background: "rgba(34, 197, 94, 0.1)",
                  border: "1px solid rgba(34, 197, 94, 0.2)",
                }}
              >
                <TrendingUp size={14} style={{ color: "var(--success)" }} />
                <span className="text-sm font-medium" style={{ color: "#4ADE80" }}>
                  Growth: {currentResult.growth}
                </span>
              </div>
            )}
          </div>

          {/* Chart */}
          {currentResult.chartData && currentResult.chartData.length > 0 && (
            <div className="card-static p-5">
              <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                Visualization
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                {currentResult.chartType === "line" ? (
                  <LineChart data={currentResult.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                      dataKey={currentResult.chartData[0]?.year ? "year" : "mine"}
                      stroke="var(--text-muted)"
                      fontSize={12}
                    />
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
                    {Object.keys(currentResult.chartData[0])
                      .filter((k) => k !== "year" && k !== "mine")
                      .map((key, i) => (
                        <Line
                          key={key}
                          type="monotone"
                          dataKey={key}
                          stroke={["#A855F7", "#F59E0B", "#22C55E", "#3B82F6"][i % 4]}
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      ))}
                  </LineChart>
                ) : (
                  <BarChart data={currentResult.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                      dataKey={currentResult.chartData[0]?.mine ? "mine" : "year"}
                      stroke="var(--text-muted)"
                      fontSize={12}
                    />
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
                    {Object.keys(currentResult.chartData[0])
                      .filter((k) => k !== "mine" && k !== "year")
                      .map((key, i) => (
                        <Bar
                          key={key}
                          dataKey={key}
                          fill={["#A855F7", "#F59E0B", "#22C55E", "#3B82F6"][i % 4]}
                          radius={[4, 4, 0, 0]}
                        />
                      ))}
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          )}

          {/* Evidence */}
          {currentResult.evidence.length > 0 && (
            <div className="card-static p-5">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--accent)" }}>
                <BookOpen size={14} /> Evidence Sources
              </h3>
              <div className="space-y-2">
                {currentResult.evidence.map((ev, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg"
                    style={{ background: "var(--bg-surface)" }}
                  >
                    <FileText size={16} className="mt-0.5 shrink-0" style={{ color: "var(--primary-400)" }} />
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      <div>
                        <span style={{ color: "var(--text-muted)" }}>Value: </span>
                        <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                          {ev.value}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: "var(--text-muted)" }}>Source: </span>
                        <span style={{ color: "var(--text-secondary)" }}>{ev.sourceDocument}</span>
                      </div>
                      <div>
                        <MapPin size={10} className="inline mr-1" style={{ color: "var(--text-muted)" }} />
                        <span style={{ color: "var(--text-muted)" }}>Page: </span>
                        <span style={{ color: "var(--text-secondary)" }}>{ev.page}</span>
                      </div>
                      <div>
                        <Activity size={10} className="inline mr-1" style={{ color: "var(--text-muted)" }} />
                        <span style={{ color: "var(--text-muted)" }}>Confidence: </span>
                        <span style={{ color: getConfidenceColor(ev.confidence) }}>
                          {Math.round(ev.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!currentResult && !loading && (
        <div className="text-center py-16">
          <MessageSquareText size={48} className="mx-auto mb-4" style={{ color: "var(--text-muted)", opacity: 0.3 }} />
          <p className="text-lg font-medium" style={{ color: "var(--text-muted)" }}>
            Ask a question to get started
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)", opacity: 0.7 }}>
            Every answer comes with verifiable evidence from source documents
          </p>
        </div>
      )}
    </div>
  );
}