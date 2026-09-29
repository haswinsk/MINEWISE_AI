import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import AppLayout from "@/components/AppLayout";

export const metadata: Metadata = {
  title: "MINEWISE AI - Evidence-Driven Mining Intelligence Platform",
  description: "AI-powered mining document intelligence platform for CMPDI/CIL subsidiaries",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Inter', sans-serif" }}>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}