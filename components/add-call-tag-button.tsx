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

type Checked = DropdownMenuCheckboxItemProps["checked"];

type Tag = {
  id: number;
  name: string;
};

type CallTag = {
  tagId: string;
  // optionally other fields
};

type Props = {
  callId: number;
  tags: Tag[]; // all available tags
  callTags: CallTag[]; // tags already assigned to this call
};

export function AddCallTagButton({ callId, tags, callTags }: Props) {
  const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true);
  const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false);
  const [showPanel, setShowPanel] = React.useState<Checked>(false);

  // Set of assigned tag ids for fast lookup
  const initialAssigned = React.useMemo(
    () => new Set(callTags.map((ct) => String(ct.tagId))),
    [callTags]
  );

  // local state of assigned tag ids (optimistic)
  const [assigned, setAssigned] = React.useState<Set<string>>(initialAssigned);

  // keep assigned in sync if props change
  React.useEffect(() => {
    setAssigned(new Set(initialAssigned));
  }, [callTags, initialAssigned]);

  // toggle function for a tagId
  const toggleTag = async (tagId: string) => {
    const id = String(tagId);
    const wasAssigned = assigned.has(id);

    // optimistic update
    const next = new Set(assigned);
    if (wasAssigned) next.delete(id);
    else next.add(id);
    setAssigned(next);

    try {
      if (!wasAssigned) {
        // assign
        const res = await fetch(`/api/calls/${callId}/tags`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tagId: id }),
        });
        if (!res.ok)
          throw new Error((await res.json()).error ?? "Assign failed");
      } else {
        // remove
        const res = await fetch(`/api/calls/${callId}/tags/${id}`, {
          method: "DELETE",
        });
        if (!res.ok)
          throw new Error((await res.json()).error ?? "Remove failed");
      }
    } catch (err: any) {
      // rollback on error
      toast.error(err?.message ?? "Failed to update tag assignment");
      setAssigned(new Set(assigned)); // revert to previous (assigned was old Set)
      // small safety: re-fetch is better in production
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
            const isChecked = assigned.has(String(t.id));
            return (
              <DropdownMenuCheckboxItem
                key={t.id}
                checked={isChecked}
                onCheckedChange={() => toggleTag(String(t.id))}
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
