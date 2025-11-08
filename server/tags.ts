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
    const tags = await db.query.tags.findMany();

    return { success: true, tags: tags };
  } catch {
    return { success: false, message: "Failed to get tags" };
  }
};

// export const getNotebookById = async (id: string) => {
//   try {
//     const notebook = await db.query.notebooks.findFirst({
//       where: eq(notebooks.id, id),
//       with: { notes: true },
//     });
//     return { success: true, notebook: notebook };
//   } catch {
//     return { success: false, message: "Failed to get notebook" };
//   }
// };

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
