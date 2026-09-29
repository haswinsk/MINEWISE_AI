import { NextResponse } from "next/server";
import { SAMPLE_CONFLICTS } from "@/data/sample-data";

export async function GET() {
  return NextResponse.json({ conflicts: SAMPLE_CONFLICTS });
}