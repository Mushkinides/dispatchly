"use client";

import { Tag } from "@/db/schema";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import {
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  Item,
} from "./ui/item";
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
import { deleteTag } from "@/server/tags";

interface TagItemProps {
  tag: Tag;
}

const TagItem = ({ tag }: TagItemProps) => {
  const router = useRouter();

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

  return (
    <>
      <div className="flex flex-col w-full gap-4 md:flex-row">
        <Item variant="outline">
          <ItemContent>
            <ItemTitle>{tag.name}</ItemTitle>
          </ItemContent>
          <ItemActions>
            <Button variant="secondary" size="sm">
              Edit
            </Button>

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
                  <AlertDialogAction onClick={handleDelete}>
                    Delete
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
