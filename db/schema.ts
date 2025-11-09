import { relations } from "drizzle-orm";
import {
  pgTable,
  primaryKey,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// ========== TAGS ==========
export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Tag = typeof tags.$inferSelect;
export type InsertTag = typeof tags.$inferInsert;

// ========== CALLS ==========
export const calls = pgTable("calls", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const callRelations = relations(calls, ({ many }) => ({
  tasks: many(tasks),
  callTags: many(callTags),
}));

export type Call = typeof calls.$inferSelect & {
  tasks?: Task[];
  callTags?: CallTag[];
};
export type InsertCall = typeof calls.$inferInsert;

// ========== TASKS ==========
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  callId: serial("call_id")
    .notNull()
    .references(() => calls.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  status: varchar("status", { length: 32 }).notNull().default("Open"),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});

export const tasksRelations = relations(tasks, ({ one }) => ({
  call: one(calls, { fields: [tasks.callId], references: [calls.id] }),
}));

export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

// ========== CALL_TAGS ==========
export const callTags = pgTable(
  "call_tags",
  {
    callId: serial("call_id")
      .notNull()
      .references(() => calls.id, { onDelete: "cascade" }),
    tagId: serial("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.callId, table.tagId] }),
  })
);

export const callTagsRelations = relations(callTags, ({ one }) => ({
  call: one(calls, {
    fields: [callTags.callId],
    references: [calls.id],
  }),
  tag: one(tags, {
    fields: [callTags.tagId],
    references: [tags.id],
  }),
}));

export type CallTag = typeof callTags.$inferSelect;
export type InsertCallTag = typeof callTags.$inferInsert;

// ========== SCHEMA_EXPORT ==========
export const schema = {
  tags,
  calls,
  tasks,
  callTags,
};
