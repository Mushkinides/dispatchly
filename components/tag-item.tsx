"use client";

import { Tag } from "@/db/schema";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

interface TagItemProps {
  tag: Tag;
}

const TagItem = ({ tag }: TagItemProps) => {
  return (
    <>
      <div className="flex flex-col w-full gap-4 md:flex-row">
        <p>{tag.name}</p>

        <div className="flex justify-end gap-2">
          <Button type="submit" variant="secondary">
            Edit
          </Button>
          <Button variant="destructive" type="button">
            Remove
          </Button>
        </div>
      </div>
    </>
  );
};

export default TagItem;
