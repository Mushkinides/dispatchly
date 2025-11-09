"use client";

import { Call } from "@/db/schema";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { ItemContent, ItemTitle, ItemActions, Item } from "./ui/item";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { deleteCall, updateCall } from "@/server/calls";

interface CallItemProps {
  call: Call;
}

const CallItem = ({ call }: CallItemProps) => {
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [isOpen, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await deleteCall(call.id);

      if (response.success) {
        toast.success("Tag deleted successfully");
        router.refresh();
      }
    } catch {
      toast.error("Failed to delete tag");
    } finally {
      setOpen(false);
    }
  };

  const handleUpdate = async (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    const newTitle = title.trim();
    if (!newTitle) return toast.error("Title cannot be empty");

    call.title = newTitle;

    try {
      const response = await updateCall(call.id, call);
      if (response.success) {
        toast.success("Call updated successfully");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(response.message);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to updated call");
    }
  };

  return (
    <>
      <div className="flex flex-col w-full gap-4 md:flex-row">
        <Item variant="outline">
          <ItemContent>
            <ItemTitle>{call.title}</ItemTitle>
          </ItemContent>
          <ItemActions>
            {/* == EDIT TAG == */}
            <Dialog open={isOpen} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Edit</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                  <DialogHeader>
                    <DialogTitle>Edit call title</DialogTitle>
                    <DialogDescription>
                      Changes the title of the call.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-3">
                    <Input
                      defaultValue={call.title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* == DELETE TAG == */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the call and all its tasks.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button onClick={handleDelete}>Delete</Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </ItemActions>
        </Item>
      </div>
    </>
  );
};

export default CallItem;
