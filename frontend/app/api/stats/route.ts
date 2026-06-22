import { getTodayStats } from "@/lib/kv";

export async function GET() {
  const stats = await getTodayStats();
  return Response.json(stats);
}
