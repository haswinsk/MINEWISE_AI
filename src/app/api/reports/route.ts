import { NextResponse } from "next/server";
import { SAMPLE_REPORTS } from "@/data/sample-data";

export async function GET() {
  return NextResponse.json({ reports: SAMPLE_REPORTS });
}