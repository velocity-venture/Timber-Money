import type { Express, Request, Response } from "express";
import Stripe from "stripe";
import { isAuthenticated } from "./replitAuth";

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
  // POST /api/checkout - Protected: requires authentication
  app.post("/api/checkout", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req.user as any).claims;
      const plan = String(req.body.plan || "").toLowerCase();
      const priceId = prices[plan as keyof typeof prices];
      
      if (!priceId) {
        return res.status(400).json({ message: "Invalid plan." });
      }

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${req.protocol}://${req.get("host")}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.protocol}://${req.get("host")}/pricing`,
        automatic_tax: { enabled: true },
        allow_promotion_codes: true,
        customer_email: user.email,
        metadata: {
          userId: user.sub,
          plan: plan,
        },
        subscription_data: {
          metadata: {
            userId: user.sub,
            plan: plan,
          },
        },
      });

      return res.json({ url: session.url });
    } catch (err: any) {
      return res.status(500).json({ message: err.message || "Stripe error" });
    }
  });

  // GET /api/checkout/test/:plan - Test endpoint (keep for backward compatibility)
  app.get("/api/checkout/test/:plan", async (req: Request, res: Response) => {
    try {
      const plan = String(req.params.plan || "").toLowerCase();
      const priceId = prices[plan as keyof typeof prices];
      if (!priceId) {
        return res.status(400).json({ message: "Invalid plan." });
      }

      // Create anonymous checkout for testing
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

  // GET /api/checkout/verify-session - Verify Stripe session and update user subscription
  // Note: This endpoint is public (no auth required) because Stripe redirects may lose session context
  // Security is maintained by verifying the Stripe session is valid and extracting userId from metadata
  app.get("/api/checkout/verify-session", async (req: Request, res: Response) => {
    try {
      const sessionId = req.query.session_id as string;

      if (!sessionId) {
        return res.status(400).json({ message: "Missing session_id" });
      }

      // Retrieve the session from Stripe (this validates it exists and is real)
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['subscription'],
      });

      // Extract userId from session metadata (set during checkout)
      const userId = session.metadata?.userId;
      if (!userId) {
        return res.status(400).json({ message: "Invalid session: missing user information" });
      }

      // Check if payment is complete and subscription exists
      if (!session.subscription || session.payment_status !== 'paid') {
        return res.status(200).json({
          success: false,
          pending: true,
          message: "Payment is still being processed. Please wait a moment.",
          paymentStatus: session.payment_status,
        });
      }

      // Extract subscription details (safe now that we've checked it exists)
      const subscription = session.subscription as Stripe.Subscription;
      const plan = session.metadata?.plan || 'unknown';

      // Import storage to update user
      const { storage } = await import("./storage");

      // Update user with subscription info
      await storage.updateUserSubscription(userId, {
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
        subscriptionPlan: plan,
      });

      return res.json({
        success: true,
        subscription: {
          id: subscription.id,
          status: subscription.status,
          plan: plan,
          currentPeriodEnd: (subscription as any).current_period_end || null,
        },
      });
    } catch (err: any) {
      console.error("Session verification error:", err);
      return res.status(500).json({ message: err.message || "Verification error" });
    }
  });
}
