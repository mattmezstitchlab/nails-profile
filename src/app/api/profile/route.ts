import { db } from "@/db";
export const dynamic = "force-dynamic";
import { nailProfiles, nails, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const user = await db.query.users.findFirst();
  if (!user) {
    return Response.json({ profile: null, nails: [] });
  }

  const profile = await db.query.nailProfiles.findFirst({
    where: eq(nailProfiles.userId, user.id),
  });

  if (!profile) {
    return Response.json({ profile: null, nails: [] });
  }

  const nailList = await db.query.nails.findMany({
    where: eq(nails.profileId, profile.id),
  });

  const fingerOrder = [
    "thumb_left", "index_left", "middle_left", "ring_left", "pinky_left",
    "thumb_right", "index_right", "middle_right", "ring_right", "pinky_right",
  ];

  const sortedNails = fingerOrder
    .map((finger) => nailList.find((n) => n.finger === finger))
    .filter(Boolean);

  return Response.json({ profile, nails: sortedNails, user });
}
