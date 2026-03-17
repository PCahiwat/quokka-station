import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  email: text("email"),
  name: text("name"),
  displayName: text("display_name"),
  picture: text("picture"),
  ethAddress: text("eth_address"),
  provider: text("provider"),
  createdAt: text("created_at"),
});

export const insertUserSchema = createInsertSchema(users).omit({ });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
