"use server";

import { db } from "@/db/drizzle";
import { InsertCallTag, callTags, tags } from "@/db/schema";
import { eq } from "drizzle-orm";

export const createCallTag = async (values: InsertCallTag) => {
  try {
    await db.insert(callTags).values(values);

    return { success: true, message: "Tag added to call successfully" };
  } catch {
    return { success: false, message: "Failed to add the tag to the call" };
  }
};

export const getTagsByCallId = async (callId: number) => {
  try {
    if (callId === undefined || callId === null) {
      return { success: false, message: "callId is required" };
    }

    const rows = await db
      .select({
        id: tags.id,
        name: tags.name,
        createdAt: tags.createdAt,
        updatedAt: tags.updatedAt,
      })
      .from(tags)
      .innerJoin(callTags, eq(callTags.tagId, tags.id))
      .where(eq(callTags.callId, callId));

    // rows is an array of objects shaped like { id, name, createdAt, updatedAt }
    return { success: true, tags: rows };
  } catch (err) {
    console.error("getTagsByCallId error:", err);
    return { success: false, message: "Failed to get tags for call" };
  }
};

// export const deleteCall = async (id: number) => {
//   try {
//     await db.delete(calls).where(eq(calls.id, id));
//     return { success: true, message: "Call deleted successfully" };
//   } catch {
//     return { success: false, message: "Failed to delete call" };
//   }
// };
