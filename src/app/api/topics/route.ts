import { NextResponse } from "next/server";
import { SAMPLE_TOPICS } from "@/data/sample-data";

export async function GET() {
  return NextResponse.json({ topics: SAMPLE_TOPICS });
}