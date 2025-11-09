"use client";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCall } from "@/server/calls";

export const CreateCallButton = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");

  async function onSubmit(event?: React.FormEvent) {
    if (event) event.preventDefault();
    const title = input.trim();
    if (!title) return;
    try {
      const res = await createCall({ title });
      if (res.success) {
        setInput("");
        toast.success("Call created successfully");
        router.refresh();
        setIsOpen(false);
      } else {
        toast.error(res.message);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to create call");
    } finally {
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-max">New Call</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new call</DialogTitle>
          <DialogDescription>Call names must be unique.</DialogDescription>
        </DialogHeader>

        <form className="mt-4" onSubmit={onSubmit}>
          <div className="flex flex-col w-full gap-4 md:flex-row">
            <Input
              id="new-call-title"
              placeholder="New call title"
              type="text"
              required
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <Button type="submit" disabled={input ? false : true}>
                Create
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
