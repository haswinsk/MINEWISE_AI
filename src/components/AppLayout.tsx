"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("minewise_token");
    if (!token && pathname !== "/login") {
      router.push("/login");
    } else {
      setMounted(true);
    }
  }, [pathname, router]);

  if (pathname === "/login") {
    return <>{children}</>;
  }

  if (!mounted) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        style={{ background: "var(--bg-dark)" }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-10 w-10 mx-auto mb-4"
            style={{
              border: "3px solid var(--border)",
              borderTopColor: "var(--primary-500)",
            }}
          />
          <p style={{ color: "var(--text-muted)" }}>Loading MINEWISE AI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg-dark)" }}>
      <Sidebar />
      <main className="flex-1" style={{ marginLeft: "240px" }}>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}