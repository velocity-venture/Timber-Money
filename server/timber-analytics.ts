import { Router, Request, Response } from "express";

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

timberAnalyticsRouter.post("/analytics", (req: Request, res: Response) => {
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
    // Log to console for now (Replit logs). Swap with DB later.
    console.log("[timber-analytics]", line);
    res.status(204).end();
  } catch (e) {
    console.error("[timber-analytics] error", e);
    res.status(204).end();
  }
});
