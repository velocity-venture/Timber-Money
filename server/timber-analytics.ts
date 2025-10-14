import { Router, Request, Response } from "express";
import { sql } from "drizzle-orm";
import { db } from "./db";
import { timberAnalytics } from "@shared/schema";

export const timberAnalyticsRouter = Router();

type TimberEvent = {
  event: "tip_impression" | "tip_hover" | "tip_click" | string;
  path?: string;
  ts?: number;
  uid?: string;
  tipHash?: number;
};

function sanitize(s: any) {
  if (typeof s === "string") {
    return s.replace(/[\r\n]/g, " ").slice(0, 200);
  }
  return s;
}

timberAnalyticsRouter.post("/analytics", async (req: Request, res: Response) => {
  try {
    const data = req.body as TimberEvent || {};
    const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.socket.remoteAddress || "unknown";
    const line = JSON.stringify({
      at: new Date().toISOString(),
      ip: sanitize(ip),
      ev: sanitize(data.event || "unknown"),
      path: sanitize(data.path || ""),
      tipHash: data.tipHash ?? null,
      uid: sanitize(data.uid || "anon"),
    });
    // Log to console for Replit logs
    console.log("[timber-analytics]", line);
    
    // Save to database
    try {
      await db.insert(timberAnalytics).values({
        event: String(data.event || "unknown").slice(0, 64),
        path: String(data.path || "").slice(0, 256),
        tipHash: typeof data.tipHash === "number" ? data.tipHash : null,
        uid: String(data.uid || "anon").slice(0, 128),
        ip: String(ip || "").slice(0, 64),
      });
    } catch (dbError) {
      console.error("[timber-analytics] db-insert-error", dbError);
    }
    
    res.status(204).end();
  } catch (e) {
    console.error("[timber-analytics] error", e);
    res.status(204).end();
  }
});

/**
 * GET /api/timber/stats?day=YYYY-MM-DD
 * Returns: { day, totals: { impressions, hovers, clicks }, byPath: [...], byTip: [...] }
 */
timberAnalyticsRouter.get("/stats", async (req: Request, res: Response) => {
  try {
    const day = (req.query.day as string) || new Date().toISOString().slice(0, 10);
    const start = new Date(day + "T00:00:00.000Z");
    const end = new Date(day + "T23:59:59.999Z");

    // Totals by event
    const totalsResult = await db.execute(
      sql`select event, count(*) as c from ${timberAnalytics}
       where created_at >= ${start} and created_at <= ${end}
       group by event`
    );
    
    const totals = { impressions: 0, hovers: 0, clicks: 0 };
    for (const r of totalsResult.rows || []) {
      const row = r as any;
      if (row.event === 'tip_impression') totals.impressions = Number(row.c);
      if (row.event === 'tip_hover') totals.hovers = Number(row.c);
      if (row.event === 'tip_click') totals.clicks = Number(row.c);
    }

    const byPathResult = await db.execute(
      sql`select path, event, count(*) as c from ${timberAnalytics}
       where created_at >= ${start} and created_at <= ${end}
       group by path, event
       order by c desc limit 50`
    );

    const byTipResult = await db.execute(
      sql`select tip_hash as "tipHash", event, count(*) as c from ${timberAnalytics}
       where created_at >= ${start} and created_at <= ${end}
       group by tip_hash, event
       order by c desc limit 50`
    );

    res.json({
      day,
      totals,
      byPath: byPathResult.rows || [],
      byTip: byTipResult.rows || [],
    });
  } catch (e) {
    console.error("[timber-analytics] stats-error", e);
    res.status(500).json({ error: "stats_failed" });
  }
});
