import { readFile } from "fs/promises";
export const dynamic = "force-dynamic";
import { join } from "path";

export async function GET() {
  try {
    const filePath = join(process.cwd(), "nail-profile.tar.gz");
    const fileBuffer = await readFile(filePath);

    return new Response(fileBuffer, {
      headers: {
        "Content-Type": "application/gzip",
        "Content-Disposition": "attachment; filename=nail-profile.tar.gz",
        "Content-Length": String(fileBuffer.length),
      },
    });
  } catch {
    return new Response("Archive not found", { status: 404 });
  }
}
