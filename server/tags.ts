"use server";

import { db } from "@/db/drizzle";
import { InsertTag, tags } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const createTag = async (values: InsertTag) => {
  try {
    const [tag] = await db.insert(tags).values(values).returning();
    revalidatePath("/admin");
    return { success: true, message: "Tag created successfully", tag };
  } catch (error) {
    console.error("createTag error:", error);
    return { success: false, message: "Failed to create tag" };
  }
};

export const getTags = async () => {
  try {
    const tagList = await db.select().from(tags).orderBy(tags.createdAt);
    return { success: true, tags: tagList };
  } catch (error) {
    console.error("getTags error:", error);
    return { success: false, message: "Failed to get tags", tags: [] };
  }
};

export const updateTag = async (tagId: number, values: Partial<InsertTag>) => {
  try {
    const [tag] = await db
      .update(tags)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(tags.id, tagId))
      .returning();

    revalidatePath("/admin");
    return { success: true, message: "Tag updated successfully", tag };
  } catch (error) {
    console.error("updateTag error:", error);
    return { success: false, message: "Failed to update tag" };
  }
};

export const deleteTag = async (tagId: number) => {
  try {
    await db.delete(tags).where(eq(tags.id, tagId));
    revalidatePath("/admin");
    return { success: true, message: "Tag deleted successfully" };
  } catch (error) {
    console.error("deleteTag error:", error);
    return { success: false, message: "Failed to delete tag" };
  }
};
