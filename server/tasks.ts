"use server";

import { db } from "@/db/drizzle";
import { InsertTask, tasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const createTask = async (values: InsertTask) => {
  try {
    const [task] = await db.insert(tasks).values(values).returning();
    revalidatePath(`/user/call/${values.callId}`);
    return { success: true, message: "Task created successfully", task };
  } catch (error) {
    console.error("createTask error:", error);
    return { success: false, message: "Failed to create task" };
  }
};

export const getTasksByCallId = async (callId: number) => {
  try {
    if (callId === undefined || callId === null) {
      return { success: false, message: "callId is required", tasks: [] };
    }

    const taskList = await db
      .select()
      .from(tasks)
      .where(eq(tasks.callId, callId))
      .orderBy(tasks.createdAt);

    return { success: true, tasks: taskList };
  } catch (error) {
    console.error("getTasksByCallId error:", error);
    return { success: false, message: "Failed to get tasks", tasks: [] };
  }
};

export const updateTask = async (
  taskId: number,
  values: Partial<InsertTask>
) => {
  try {
    const [task] = await db
      .update(tasks)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(tasks.id, taskId))
      .returning();

    if (task?.callId) {
      revalidatePath(`/user/call/${task.callId}`);
    }

    return { success: true, message: "Task updated successfully", task };
  } catch (error) {
    console.error("updateTask error:", error);
    return { success: false, message: "Failed to update task" };
  }
};

export const deleteTask = async (taskId: number, callId: number) => {
  try {
    await db.delete(tasks).where(eq(tasks.id, taskId));
    revalidatePath(`/user/call/${callId}`);
    return { success: true, message: "Task deleted successfully" };
  } catch (error) {
    console.error("deleteTask error:", error);
    return { success: false, message: "Failed to delete task" };
  }
};
