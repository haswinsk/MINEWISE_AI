"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  MessageSquareText,
  BarChart3,
  AlertTriangle,
  Tags,
  FileOutput,
  ClipboardCheck,
  Settings,
  LogOut,
  Shield,
  HardHat,
} from "lucide-react";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/documents", label: "Documents", icon: FileText },
  { path: "/query", label: "AI Query", icon: MessageSquareText },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/conflicts", label: "Conflicts", icon: AlertTriangle },
  { path: "/topics", label: "Topics", icon: Tags },
  { path: "/reports", label: "Reports", icon: FileOutput },
  { path: "/review", label: "Review", icon: ClipboardCheck },
  { path: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("minewise_token");
    localStorage.removeItem("minewise_user");
    router.push("/login");
  };

  return (
    <aside
      className="fixed left-0 top-0 h-screen flex flex-col"
      style={{
        width: "240px",
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--border)",
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-5 py-5"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div
          className="flex items-center justify-center rounded-lg"
          style={{
            width: 36,
            height: 36,
            background: "linear-gradient(135deg, var(--primary-600), var(--primary-800))",
          }}
        >
          <HardHat size={20} color="white" />
        </div>
        <div>
          <div className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
            MINEWISE AI
          </div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>
            Mining Intelligence
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path || pathname?.startsWith(item.path + "/");
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: isActive ? "rgba(124, 58, 237, 0.15)" : "transparent",
                  color: isActive ? "var(--primary-400)" : "var(--text-muted)",
                  borderLeft: isActive ? "3px solid var(--primary-500)" : "3px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "rgba(124, 58, 237, 0.08)";
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--text-muted)";
                  }
                }}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* User section */}
      <div className="px-3 py-4" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width: 32,
              height: 32,
              background: "linear-gradient(135deg, var(--primary-500), var(--primary-700))",
            }}
          >
            <Shield size={14} color="white" />
          </div>
          <div>
            <div className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
              Admin User
            </div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
              Administrator
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
            e.currentTarget.style.color = "#FCA5A5";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--text-muted)";
          }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}