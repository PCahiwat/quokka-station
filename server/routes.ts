import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

const ADMIN_SECRET = "quokka-admin-2026";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Upsert user on login (called from frontend after Bedrock auth)
  app.post("/api/users", async (req, res) => {
    try {
      const { id, email, name, displayName, picture, ethAddress, provider, createdAt } = req.body;
      if (!id) {
        return res.status(400).json({ error: "User ID is required" });
      }
      const user = await storage.upsertUser({
        id,
        email: email || null,
        name: name || null,
        displayName: displayName || null,
        picture: picture || null,
        ethAddress: ethAddress || null,
        provider: provider || null,
        createdAt: createdAt || new Date().toISOString(),
      });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to save user" });
    }
  });

  // Auth callback — Bedrock redirects here with tokens as query params.
  // Forward them to the hash route so the React app can handle them.
  app.get("/auth/callback", (req, res) => {
    const query = new URLSearchParams(req.query as Record<string, string>).toString();
    res.redirect(`/?${query}#/auth/callback`);
  });

  // Get all users (admin endpoint)
  app.get("/api/admin/users", async (req, res) => {
    const secret = req.headers["x-admin-secret"];
    if (secret !== ADMIN_SECRET) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const users = await storage.getAllUsers();
    res.json(users);
  });

  return httpServer;
}
