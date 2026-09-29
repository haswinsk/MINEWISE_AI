import { NextResponse } from "next/server";
import { SAMPLE_DOCUMENTS } from "@/data/sample-data";

export async function GET(
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

  return NextResponse.json({ document: doc });
}

export async function DELETE(
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

  return NextResponse.json({ success: true, message: `Document ${doc.name} deleted` });
}