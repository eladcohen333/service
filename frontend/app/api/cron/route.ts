import { getTodayStats } from "@/lib/kv";
import { sendDailyReport } from "@/lib/email";

// Called by Vercel Cron every day at 20:00 Israel time
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  const stats = await getTodayStats();
  await sendDailyReport(stats);
  return Response.json({ ok: true, stats });
}
