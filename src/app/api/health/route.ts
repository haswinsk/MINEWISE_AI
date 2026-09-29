import { db } from "@/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (db.readyState === 1) {
      return Response.json({ ok: true });
    }
    return Response.json({ ok: false, message: 'Database not connected' }, { status: 500 });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
