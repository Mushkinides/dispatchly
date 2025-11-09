"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { createCallTag, deleteCallTag } from "@/server/callTags";
import { useRouter } from "next/navigation";

// type Checked = DropdownMenuCheckboxItemProps["checked"];

type Tag = {
  id: number;
  name: string;
};

type CallTag = {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
};

type Props = {
  callId: number;
  tags: Tag[]; // all available tags
  callTags: CallTag[]; // tags already assigned to this call
};

export function AddCallTagButton({ callId, tags, callTags }: Props) {
  const router = useRouter();

  // Set of assigned tag ids for fast lookup
  const initialAssigned = React.useMemo(
    () => new Set(callTags.map((ct) => ct.id)),
    [callTags]
  );

  // local state of assigned tag ids (optimistic)
  const [assigned, setAssigned] = React.useState<Set<number>>(initialAssigned);

  // Sync state when callTags prop changes from server
  React.useEffect(() => {
    setAssigned(new Set(callTags.map((ct) => ct.id)));
  }, [callTags]);

  // toggle function for a tagId
  const toggleTag = async (tagId: number) => {
    const wasAssigned = assigned.has(tagId);

    // Create previous state for rollback
    const previousState = new Set(assigned);

    // optimistic update
    const nextState = new Set(assigned);
    if (wasAssigned) {
      nextState.delete(tagId);
    } else {
      nextState.add(tagId);
    }
    setAssigned(nextState);

    try {
      if (!wasAssigned) {
        // Add tag
        const res = await createCallTag({ callId, tagId });

        if (res.success) {
          toast.success("Tag assigned successfully");
        } else {
          toast.error(res.message);
          // rollback on server error
          setAssigned(previousState);
        }
      } else {
        // Remove tag
        const res = await deleteCallTag(callId, tagId);

        if (res.success) {
          toast.success("Tag removed from call successfully");
        } else {
          toast.error(res.message);
          // rollback on server error
          setAssigned(previousState);
        }
      }
    } catch {
      // rollback on error
      toast.error("Failed to update tag assignment");
      setAssigned(previousState);
    } finally {
      router.refresh();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Tags</Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Assign tags</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {tags.length === 0 ? (
          <div className="px-3 py-2 text-sm text-muted-foreground">No tags</div>
        ) : (
          tags.map((t) => {
            const isChecked = assigned.has(t.id);
            return (
              <DropdownMenuCheckboxItem
                key={t.id}
                checked={isChecked}
                onCheckedChange={() => toggleTag(t.id)}
              >
                {t.name}
              </DropdownMenuCheckboxItem>
            );
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
