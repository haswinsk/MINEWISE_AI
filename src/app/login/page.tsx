"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { HardHat, Lock, User, AlertCircle, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem("minewise_token", data.token);
        localStorage.setItem("minewise_user", JSON.stringify(data.user));
        router.push("/dashboard");
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch {
      setError("Connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ background: "var(--bg-dark)" }}
    >
      {/* Background pattern */}
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, var(--primary-500) 2px, transparent 0)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center rounded-2xl mb-4"
            style={{
              width: 72,
              height: 72,
              background: "linear-gradient(135deg, var(--primary-600), var(--primary-900))",
              boxShadow: "0 0 40px rgba(124, 58, 237, 0.3)",
            }}
          >
            <HardHat size={36} color="white" />
          </div>
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            MINEWISE AI
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Evidence-Driven Mining Intelligence Platform
          </p>
        </div>

        {/* Login Card */}
        <div className="card-static p-8" style={{ background: "var(--bg-card)" }}>
          <h2
            className="text-lg font-semibold mb-6"
            style={{ color: "var(--text-primary)" }}
          >
            Sign In
          </h2>

          {error && (
            <div
              className="flex items-center gap-2 p-3 rounded-lg mb-4 text-sm"
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#FCA5A5",
              }}
            >
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-xs font-medium mb-1.5"
                style={{ color: "var(--text-secondary)" }}
              >
                Username
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-muted)" }}
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm"
                  style={{
                    background: "var(--bg-input)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            <div>
              <label
                className="block text-xs font-medium mb-1.5"
                style={{ color: "var(--text-secondary)" }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-muted)" }}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm"
                  style={{
                    background: "var(--bg-input)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: loading
                  ? "var(--primary-800)"
                  : "linear-gradient(135deg, var(--primary-600), var(--primary-700))",
                color: "white",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <div
                  className="animate-spin rounded-full h-4 w-4"
                  style={{
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "white",
                  }}
                />
              ) : (
                <>
                  Sign In <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div
            className="mt-6 p-3 rounded-lg"
            style={{
              background: "rgba(124, 58, 237, 0.08)",
              border: "1px solid rgba(124, 58, 237, 0.2)",
            }}
          >
            <p
              className="text-xs font-medium mb-2"
              style={{ color: "var(--primary-400)" }}
            >
              Demo Credentials
            </p>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span style={{ color: "var(--text-muted)" }}>Admin:</span>
                <span style={{ color: "var(--text-secondary)" }}>
                  admin / admin123
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: "var(--text-muted)" }}>Analyst:</span>
                <span style={{ color: "var(--text-secondary)" }}>
                  analyst / analyst123
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: "var(--text-muted)" }}>Reviewer:</span>
                <span style={{ color: "var(--text-secondary)" }}>
                  reviewer / reviewer123
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p
          className="text-center text-xs mt-6"
          style={{ color: "var(--text-muted)" }}
        >
          Prototype Demo &bull; Sample/Demo Data Only
        </p>
      </div>
    </div>
  );
}