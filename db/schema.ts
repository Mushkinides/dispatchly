import { pgTable, integer, timestamp, varchar } from "drizzle-orm/pg-core";

// ========== TAGS ==========
export const tags = pgTable("tags", {
  id: integer("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
