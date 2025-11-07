import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

// ========== TAGS ==========
export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Tag = typeof tags.$inferSelect;
export type InsertTags = typeof tags.$inferInsert;

export const schema = {
  tags,
};
