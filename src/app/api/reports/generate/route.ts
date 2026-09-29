import { NextResponse } from "next/server";
import { AIService } from "@/lib/ai-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mine, yearFrom, yearTo, reportType } = body;

    if (!mine || !yearFrom || !yearTo || !reportType) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Simulate AI report generation
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const report = AIService.generateReport(
      mine,
      parseInt(yearFrom),
      parseInt(yearTo),
      reportType
    );

    return NextResponse.json({
      success: true,
      report: {
        id: Date.now(),
        title: `${reportType} - ${mine} (${yearFrom}-${yearTo})`,
        mine,
        yearFrom: parseInt(yearFrom),
        yearTo: parseInt(yearTo),
        reportType,
        status: "draft",
        createdAt: new Date().toISOString().split("T")[0],
        ...report,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Report generation failed" },
      { status: 500 }
    );
  }
}