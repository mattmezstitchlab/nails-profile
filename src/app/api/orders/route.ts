import { db } from "@/db";
export const dynamic = "force-dynamic";
import { designSets, nailProfiles, orders, users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      designSetId?: string;
      finish?: "glossy" | "matte" | "chrome" | "metallic";
      nailShape?: "natural" | "almond" | "oval" | "square" | "coffin" | "stiletto" | "round" | "ballerina";
      totalPrice?: string;
    };

    const user = await db.query.users.findFirst();
    if (!user) {
      return Response.json({ error: "Aucun utilisateur disponible" }, { status: 404 });
    }

    const profile = await db.query.nailProfiles.findFirst({
      where: eq(nailProfiles.userId, user.id),
    });

    let designSetId = body.designSetId;
    if (!designSetId) {
      const defaultSet = await db.query.designSets.findFirst({
        where: eq(designSets.name, "Sunset Ocean"),
      });
      designSetId = defaultSet?.id;
    }

    const [order] = await db
      .insert(orders)
      .values({
        userId: user.id,
        designSetId: designSetId ?? null,
        profileId: profile?.id ?? null,
        status: "confirmed",
        finish: body.finish ?? "glossy",
        nailShape: body.nailShape ?? "almond",
        totalPrice: body.totalPrice ?? "39.90",
      })
      .returning();

    if (designSetId) {
      await db
        .update(designSets)
        .set({ orders: sql`coalesce(${designSets.orders}, 0) + 1` })
        .where(eq(designSets.id, designSetId));
    }

    return Response.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Order creation failed", error);
    return Response.json({ error: "Impossible de créer la commande" }, { status: 500 });
  }
}

export async function GET() {
  const user = await db.query.users.findFirst();
  if (!user) return Response.json([]);

  const result = await db.query.orders.findMany({
    where: eq(orders.userId, user.id),
    with: { designSet: true },
  });

  return Response.json(result);
}
