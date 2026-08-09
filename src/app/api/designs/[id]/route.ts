import { db } from "@/db";
export const dynamic = "force-dynamic";
import { designSets } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const designSet = await db.query.designSets.findFirst({
    where: eq(designSets.id, id),
    with: {
      designs: true,
    },
  });

  if (!designSet) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(designSet);
}
