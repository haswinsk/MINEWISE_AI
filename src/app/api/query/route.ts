import { NextResponse } from "next/server";
import { AIService } from "@/lib/ai-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question } = body;

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { success: false, error: "Please provide a question" },
        { status: 400 }
      );
    }

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const response = AIService.answerQuestion(question);

    return NextResponse.json({
      success: true,
      question,
      ...response,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Query processing failed" },
      { status: 500 }
    );
  }
}