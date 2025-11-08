"use server";

import { db } from "@/db/drizzle";
import { InsertTag, tags } from "@/db/schema";
import { eq } from "drizzle-orm";

export const createTag = async (values: InsertTag) => {
  try {
    await db.insert(tags).values(values);

    return { success: true, message: "Tag created successfully" };
  } catch {
    return { success: false, message: "Failed to create tag" };
  }
};

export const getTags = async () => {
  try {
    const tags = await db.query.tags.findMany({
      orderBy: (tags, { asc }) => [asc(tags.name)],
    });

    return { success: true, tags: tags };
  } catch {
    return { success: false, message: "Failed to get tags" };
  }
};

export const getTagById = async (id: number) => {
  try {
    const tag = await db.query.tags.findFirst({
      where: eq(tags.id, id),
    });
    return { success: true, tag: tag };
  } catch {
    return { success: false, message: "Failed to get tag" };
  }
};

export const updateTag = async (id: number, values: InsertTag) => {
  try {
    await db.update(tags).set(values).where(eq(tags.id, id));
    return { success: true, message: "Tag updated successfully" };
  } catch {
    return { success: false, message: "Failed to update tag" };
  }
};

export const deleteTag = async (id: number) => {
  try {
    await db.delete(tags).where(eq(tags.id, id));
    return { success: true, message: "Tag deleted successfully" };
  } catch {
    return { success: false, message: "Failed to delete tag" };
  }
};
