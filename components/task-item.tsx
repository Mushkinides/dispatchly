"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Item, ItemContent, ItemActions } from "@/components/ui/item";
import { deleteTask, updateTask } from "@/server/tasks";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import { Task } from "@/db/schema";

const STATUS_OPTIONS = ["Open", "In Progress", "Complete"] as const;

type TaskItemProps = {
  task: Task;
  callId: number;
};

export function TaskItem({ task, callId }: TaskItemProps) {
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [editName, setEditName] = React.useState(task.name);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await updateTask(task.id, { status: newStatus });
      if (res.success) {
        toast.success("Status updated successfully");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error("Task name cannot be empty");
      return;
    }

    setIsUpdating(true);
    try {
      const res = await updateTask(task.id, { name: editName.trim() });
      if (res.success) {
        toast.success("Task updated successfully");
        setIsEditOpen(false);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Failed to update task");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await deleteTask(task.id, callId);
      if (res.success) {
        toast.success("Task deleted successfully");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Failed to delete task");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Item variant="outline">
        <ItemContent>
          <div className="flex items-center gap-4 flex-1">
            <span className="flex-1 font-medium">{task.name}</span>
            <Select
              value={task.status}
              onValueChange={handleStatusChange}
              disabled={isUpdating}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </ItemContent>
        <ItemActions>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setEditName(task.name);
              setIsEditOpen(true);
            }}
            disabled={isDeleting}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </ItemActions>
      </Item>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>Update the task name below.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="task-name">Task Name</Label>
              <Input
                id="task-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter task name"
                className="mt-2"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
