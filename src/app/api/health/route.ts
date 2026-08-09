import { db } from "@/db";
export const dynamic = "force-dynamic";
import { sql } from "drizzle-orm";

export async function GET() {
  await db.execute(sql`select 1`);
  return Response.json({ status: "ok" });
}
