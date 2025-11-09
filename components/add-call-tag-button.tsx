"use client";

import * as React from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

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

type Checked = DropdownMenuCheckboxItemProps["checked"];

type Tag = {
  id: number;
  name: string;
};

type CallTag = {
  tagId: number;
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
    () => new Set(callTags.map((ct) => ct.tagId)),
    [callTags]
  );

  // local state of assigned tag ids (optimistic)
  const [assigned, setAssigned] = React.useState<Set<number>>(initialAssigned);

  console.log("YOMAMA3");
  console.log(callTags);
  console.log(initialAssigned);
  console.log(assigned);

  // keep assigned in sync if props change
  React.useEffect(() => {
    setAssigned(new Set(initialAssigned));
  }, [callTags, initialAssigned]);

  // toggle function for a tagId
  const toggleTag = async (tagId: number) => {
    const id = tagId;
    const wasAssigned = assigned.has(id);

    console.log("YOMAMA");
    console.log(wasAssigned);
    console.log(assigned);

    // optimistic update
    const next = new Set(assigned);
    console.log("YOMAMA2");
    console.log(next);

    if (wasAssigned) next.delete(id);
    else next.add(id);
    setAssigned(next);

    try {
      if (!wasAssigned) {
        const res = await createCallTag({ callId, tagId });

        if (res.success) {
          toast.success("Tag assigned successfully");
        } else {
          toast.error(res.message);
        }
      } else {
        // remove
        // const res = await fetch(`/api/calls/${callId}/tags/${id}`, {
        //   method: "DELETE",
        // });

        const res = await deleteCallTag(callId, tagId);

        if (res.success) {
          toast.success("Tag removed from call successfuly");
        } else {
          toast.error(res.message);
        }
      }
    } catch {
      // rollback on error
      toast.error("Failed to update tag assignment");
      setAssigned(new Set(assigned)); // revert to previous (assigned was old Set)
      // small safety: re-fetch is better in production
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
