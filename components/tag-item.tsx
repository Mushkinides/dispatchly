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

interface TagItemProps {
  tag: Tag;
}

const TagItem = ({ tag }: TagItemProps) => {
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
          </ItemActions>
        </Item>
      </div>
    </>
  );
};

export default TagItem;
