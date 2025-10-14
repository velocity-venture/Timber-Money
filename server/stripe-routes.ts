import type { Express, Request, Response } from "express";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

const prices = {
  family_monthly: process.env.PRICE_FAMILY_MONTHLY!,
  pro_annual: process.env.PRICE_PRO_ANNUAL!,
  family_annual: process.env.PRICE_FAMILY_ANNUAL!,
  pro_monthly: process.env.PRICE_PRO_MONTHLY!,
};

export function registerStripeRoutes(app: Express) {
  // POST /api/checkout
  app.post("/api/checkout", async (req: Request, res: Response) => {
    try {
      const plan = String(req.body.plan || "").toLowerCase();
      const priceId = prices[plan as keyof typeof prices];
      if (!priceId) {
        return res.status(400).json({ message: "Invalid plan." });
      }

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${req.protocol}://${req.get("host")}/?checkout=success`,
        cancel_url: `${req.protocol}://${req.get("host")}/?checkout=cancel`,
        automatic_tax: { enabled: true },
        allow_promotion_codes: true,
      });

      return res.json({ url: session.url });
    } catch (err: any) {
      return res.status(500).json({ message: err.message || "Stripe error" });
    }
  });

  // GET /api/checkout/test/:plan
  app.get("/api/checkout/test/:plan", async (req: Request, res: Response) => {
    try {
      const plan = String(req.params.plan || "").toLowerCase();
      const priceId = prices[plan as keyof typeof prices];
      if (!priceId) {
        return res.status(400).json({ message: "Invalid plan." });
      }

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${req.protocol}://${req.get("host")}/?checkout=success`,
        cancel_url: `${req.protocol}://${req.get("host")}/?checkout=cancel`,
        automatic_tax: { enabled: true },
        allow_promotion_codes: true,
      });

      return res.json({ url: session.url });
    } catch (err: any) {
      return res.status(500).json({ message: err.message || "Stripe error" });
    }
  });
}
