"use server";

import { db } from "@/db/drizzle";
import { InsertCall, calls } from "@/db/schema";
import { eq } from "drizzle-orm";

export const createCall = async (values: InsertCall) => {
  try {
    await db.insert(calls).values(values);

    return { success: true, message: "Call created successfully" };
  } catch {
    return { success: false, message: "Failed to create call" };
  }
};

export const getCalls = async () => {
  try {
    const calls = await db.query.calls.findMany();
    return { success: true, calls: calls };
  } catch {
    return { success: false, message: "Failed to get calls" };
  }
};

// export const getTagById = async (id: number) => {
//   try {
//     const tag = await db.query.tags.findFirst({
//       where: eq(tags.id, id),
//     });
//     return { success: true, tag: tag };
//   } catch {
//     return { success: false, message: "Failed to get tag" };
//   }
// };

export const updateCall = async (id: number, values: InsertCall) => {
  try {
    await db.update(calls).set(values).where(eq(calls.id, id));
    return { success: true, message: "Call updated successfully" };
  } catch {
    return { success: false, message: "Failed to update call" };
  }
};

export const deleteCall = async (id: number) => {
  try {
    await db.delete(calls).where(eq(calls.id, id));
    return { success: true, message: "Call deleted successfully" };
  } catch {
    return { success: false, message: "Failed to delete call" };
  }
};
