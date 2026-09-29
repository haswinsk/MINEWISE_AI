import { NextResponse } from "next/server";
import { SAMPLE_DOCUMENTS } from "@/data/sample-data";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const docId = parseInt(id, 10);
  const doc = SAMPLE_DOCUMENTS.find((d) => d.id === docId);

  if (!doc) {
    return NextResponse.json(
      { success: false, error: "Document not found" },
      { status: 404 }
    );
  }

  // Simulate processing steps
  const steps = [
    { step: "Uploading", status: "completed", progress: 100 },
    { step: "OCR / Text Extraction", status: "completed", progress: 100 },
    { step: "Table Detection", status: "completed", progress: 100 },
    { step: "Entity Extraction", status: "completed", progress: 100 },
    { step: "Structuring Data", status: "completed", progress: 100 },
    { step: "Indexing", status: "completed", progress: 100 },
    { step: "Evidence Mapping", status: "completed", progress: 100 },
    { step: "Completed", status: "completed", progress: 100 },
  ];

  return NextResponse.json({
    success: true,
    document: { ...doc, status: "completed" },
    steps,
  });
}