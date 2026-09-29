import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { action, sectionIndex, status, comment } = body;

  // In production, this would update the database
  return NextResponse.json({
    success: true,
    reviewId: parseInt(id, 10),
    action,
    sectionIndex,
    status,
    comment,
    updatedAt: new Date().toISOString(),
  });
}