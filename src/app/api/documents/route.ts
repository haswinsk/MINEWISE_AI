import { NextResponse } from "next/server";
import { SAMPLE_DOCUMENTS } from "@/data/sample-data";

export async function GET() {
  return NextResponse.json({ documents: SAMPLE_DOCUMENTS });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "application/pdf",
      "text/csv",
      "text/plain",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "image/png",
      "image/jpeg",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Unsupported file format" },
        { status: 400 }
      );
    }

    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "File too large (max 50MB)" },
        { status: 400 }
      );
    }

    const newDoc = {
      id: SAMPLE_DOCUMENTS.length + 1,
      name: file.name,
      mine: "Unknown",
      documentType: file.type.includes("pdf")
        ? "PDF Report"
        : file.type.includes("csv")
        ? "Spreadsheet"
        : "Document",
      year: new Date().getFullYear(),
      status: "pending",
      confidence: 0,
      uploadDate: new Date().toISOString().split("T")[0],
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      pageCount: 0,
    };

    return NextResponse.json({ success: true, document: newDoc });
  } catch {
    return NextResponse.json(
      { success: false, error: "Upload failed" },
      { status: 500 }
    );
  }
}