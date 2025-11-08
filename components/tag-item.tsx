"use client";

import { Tag } from "@/db/schema";
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
import { Label } from "@/components/ui/label";
import { deleteTag, updateTag } from "@/server/tags";

interface TagItemProps {
  tag: Tag;
}

const TagItem = ({ tag }: TagItemProps) => {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [isOpen, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      // setIsDeleting(true);
      const response = await deleteTag(tag.id);

      if (response.success) {
        toast.success("Tag deleted successfully");
        router.refresh();
      }
    } catch {
      toast.error("Failed to delete tag");
    } finally {
      // setIsDeleting(false);
      // setIsOpen(false);
    }
  };

  const handleUpdate = async (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    const newName = name.trim();
    if (!newName) return toast.error("Name cannot be empty");

    tag.name = newName;

    try {
      const response = await updateTag(tag.id, tag);
      if (response.success) {
        toast.success("Tag updated successfully");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(response.message);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to updated tag");
    }
  };

  return (
    <>
      <div className="flex flex-col w-full gap-4 md:flex-row">
        <Item variant="outline">
          <ItemContent>
            <ItemTitle>{tag.name}</ItemTitle>
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
                    <DialogTitle>Edit tag name</DialogTitle>
                    <DialogDescription>
                      Changes the tags name here. Click save when you&apos;re
                      done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-3">
                    <Input
                      defaultValue={tag.name}
                      onChange={(e) => setName(e.target.value)}
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
                  Remove
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the tag.
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

export default TagItem;
