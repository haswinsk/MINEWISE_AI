"use client";

import { useState } from "react";
import {
  Settings,
  User,
  Shield,
  Database,
  Brain,
  Save,
  CheckCircle2,
} from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [aiProvider, setAiProvider] = useState("demo");
  const [llmModel, setLlmModel] = useState("gpt-4");
  const [ocrEngine, setOcrEngine] = useState("tesseract");
  const [embeddingModel, setEmbeddingModel] = useState("text-embedding-3-small");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          <Settings size={24} className="inline mr-2" style={{ color: "var(--primary-400)" }} />
          Settings
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Configure MINEWISE AI platform settings
        </p>
      </div>

      {/* User Info */}
      <div className="card-static p-5">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
          <User size={16} style={{ color: "var(--primary-400)" }} /> User Profile
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>
              Username
            </label>
            <input
              type="text"
              value="admin"
              readOnly
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>
              Role
            </label>
            <input
              type="text"
              value="Administrator"
              readOnly
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
            />
          </div>
        </div>
      </div>

      {/* AI Configuration */}
      <div className="card-static p-5">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
          <Brain size={16} style={{ color: "var(--primary-400)" }} /> AI Service Configuration
        </h3>
        <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
          Configure the AI backend. Currently using demo mode with deterministic responses based on sample data.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>
              AI Provider
            </label>
            <select
              value={aiProvider}
              onChange={(e) => setAiProvider(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
            >
              <option value="demo">Demo (No API Key Required)</option>
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="local">Local LLM</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>
              LLM Model
            </label>
            <select
              value={llmModel}
              onChange={(e) => setLlmModel(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
            >
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-4o">GPT-4o</option>
              <option value="claude-3">Claude 3</option>
              <option value="local">Local Model</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>
              Embedding Model
            </label>
            <select
              value={embeddingModel}
              onChange={(e) => setEmbeddingModel(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
            >
              <option value="text-embedding-3-small">text-embedding-3-small</option>
              <option value="text-embedding-3-large">text-embedding-3-large</option>
              <option value="local">Local Embeddings</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>
              OCR Engine
            </label>
            <select
              value={ocrEngine}
              onChange={(e) => setOcrEngine(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ background: "var(--bg-input)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
            >
              <option value="tesseract">Tesseract</option>
              <option value="google-vision">Google Vision</option>
              <option value="aws-textract">AWS Textract</option>
              <option value="demo">Demo (No OCR Required)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Database Info */}
      <div className="card-static p-5">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
          <Database size={16} style={{ color: "var(--primary-400)" }} /> Database Configuration
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>
              Database Type
            </label>
            <input
              type="text"
              value="PostgreSQL"
              readOnly
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>
              Vector Store
            </label>
            <input
              type="text"
              value="pgvector (Ready)"
              readOnly
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
            />
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="card-static p-5">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
          <Shield size={16} style={{ color: "var(--primary-400)" }} /> Security & Access
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: "var(--bg-surface)" }}>
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Role-Based Access Control</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Admin, Analyst, Reviewer roles</p>
            </div>
            <span className="badge badge-success">Active</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: "var(--bg-surface)" }}>
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>JWT Authentication</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>24-hour token expiration</p>
            </div>
            <span className="badge badge-success">Active</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: "var(--bg-surface)" }}>
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Evidence Traceability</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>All AI outputs linked to source documents</p>
            </div>
            <span className="badge badge-success">Active</span>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button onClick={handleSave} className="btn btn-primary">
          {saved ? <><CheckCircle2 size={16} /> Saved!</> : <><Save size={16} /> Save Settings</>}
        </button>
      </div>

      {/* Prototype Notice */}
      <div
        className="p-4 rounded-lg text-xs text-center"
        style={{
          background: "rgba(124, 58, 237, 0.08)",
          border: "1px solid rgba(124, 58, 237, 0.15)",
          color: "var(--text-muted)",
        }}
      >
        MINEWISE AI Prototype &bull; Demo Configuration &bull; Connect real API keys to enable production AI services
      </div>
    </div>
  );
}