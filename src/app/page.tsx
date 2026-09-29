"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("minewise_token");
    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen" style={{ background: "var(--bg-dark)" }}>
      <div className="text-center">
        <div
          className="animate-spin rounded-full h-10 w-10 mx-auto mb-4"
          style={{ border: "3px solid var(--border)", borderTopColor: "var(--primary-500)" }}
        />
        <p style={{ color: "var(--text-muted)" }}>Loading MINEWISE AI...</p>
      </div>
    </div>
  );
}