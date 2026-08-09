import { db } from "@/db";
export const dynamic = "force-dynamic";
import { designSets, designs } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      visibility?: "private" | "public" | "creator";
      price?: string;
    };
    const user = await db.query.users.findFirst();
    if (!user) return Response.json({ error: "Utilisateur introuvable" }, { status: 404 });

    const designSet = await db.query.designSets.findFirst({
      where: eq(designSets.name, "Sunset Ocean"),
    });
    if (!designSet) return Response.json({ error: "Création introuvable" }, { status: 404 });

    const [updated] = await db
      .update(designSets)
      .set({
        visibility: body.visibility ?? "public",
        price: body.price ?? designSet.price,
        updatedAt: new Date(),
      })
      .where(eq(designSets.id, designSet.id))
      .returning();

    return Response.json({ designSet: updated });
  } catch (error) {
    console.error("Design publication failed", error);
    return Response.json({ error: "Impossible de publier la création" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const visibility = searchParams.get("visibility");
  const style = searchParams.get("style");

  let query = db.select().from(designSets);

  const conditions = [];
  if (visibility) {
    conditions.push(eq(designSets.visibility, visibility as "public" | "private" | "creator"));
  } else {
    conditions.push(eq(designSets.visibility, "public"));
  }
  if (style) {
    conditions.push(eq(designSets.style, style));
  }

  const result = await db.query.designSets.findMany({
    where: and(...conditions),
    orderBy: (designSets, { desc }) => [desc(designSets.createdAt)],
    with: {
      designs: true,
    },
  });

  return Response.json(result);
}
