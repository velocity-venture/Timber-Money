import { Router, Request, Response } from "express";
import path from "path";
import { db } from "./db";
import { documents } from "../shared/schema";
import { eq } from "drizzle-orm";

export const docsAdminRouter = Router();

function isAdmin(req: Request): boolean {
  const adminKey = process.env.ADMIN_VIEW_KEY || "";
  if (!adminKey) return false;
  return req.headers["x-admin-key"] === adminKey;
}

// Serve admin HTML page
docsAdminRouter.get("/", (req: Request, res: Response) => {
  if (!isAdmin(req)) {
    return res.status(401).send("Unauthorized - Valid admin key required");
  }
  const htmlPath = path.join(process.cwd(), "client/public/admin/docs.html");
  res.sendFile(htmlPath);
});

// Edit document fields
docsAdminRouter.post("/:id/edit", async (req: Request, res: Response) => {
  if (!isAdmin(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  try {
    const { id } = req.params;
    const { total, date, vendor, documentType, notes } = req.body || {};
    
    // Fetch current document
    const [doc] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, id))
      .limit(1);
    
    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }
    
    // Update analysisData with edited fields
    const analysisData = (doc.analysisData as any) || {};
    analysisData.summary = analysisData.summary || {};
    
    if (total !== undefined) analysisData.summary.total = total;
    if (date !== undefined) analysisData.summary.date = date;
    if (vendor !== undefined) analysisData.summary.vendor = vendor;
    
    analysisData.validations = analysisData.validations || {};
    if (Array.isArray(notes)) {
      analysisData.validations.notes = notes;
    }
    
    // Update document
    await db
      .update(documents)
      .set({
        analysisData,
        documentType: documentType || doc.documentType,
        needsReview: false,
        processedAt: new Date(),
      })
      .where(eq(documents.id, id));
    
    res.json({ ok: true, message: "Document updated successfully" });
  } catch (error) {
    console.error("Error editing document:", error);
    res.status(500).json({ error: "Failed to edit document" });
  }
});

// Approve document (mark as completed, no review needed)
docsAdminRouter.post("/:id/approve", async (req: Request, res: Response) => {
  if (!isAdmin(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  try {
    const { id } = req.params;
    
    await db
      .update(documents)
      .set({
        status: "completed",
        needsReview: false,
        processedAt: new Date(),
      })
      .where(eq(documents.id, id));
    
    res.json({ ok: true, message: "Document approved successfully" });
  } catch (error) {
    console.error("Error approving document:", error);
    res.status(500).json({ error: "Failed to approve document" });
  }
});
