import { db } from "@/db";

export async function GET() {
  const collections = await db.query.collections.findMany({
    with: {
      collectionDesigns: {
        with: {
          designSet: true,
        },
      },
    },
  });

  return Response.json(collections);
}
