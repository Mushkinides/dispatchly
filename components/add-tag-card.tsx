"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Field, FieldLabel, FieldDescription, FieldGroup } from "./ui/field";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { createTag } from "@/server/tags";
import { useRouter } from "next/navigation";

const AddTagCard = () => {
  const [input, setInput] = useState("");
  const router = useRouter();

  function clearInput() {
    setInput("");
  }

  async function addTag(event?: React.FormEvent) {
    if (event) event.preventDefault();
    const name = input.trim();
    if (!name) return;
    try {
      // setIsLoading(true);
      const res = await createTag({ name });
      if (res.success) {
        setInput("");
        toast.success("Tag created successfully");
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to create tag");
    } finally {
      // setIsLoading(false);
    }
  }

  return (
    <form className="mt-4" onSubmit={addTag}>
      <FieldGroup>
        <FieldGroup>
          <Field className="border-2 rounded-2xl py-2 px-4">
            <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
              Create a new tag
            </FieldLabel>
            <FieldDescription>Tag names must be unique</FieldDescription>
            <div className="flex flex-col w-full gap-4 md:flex-row">
              <Input
                id="new-tag-name"
                placeholder="New tag name"
                type="text"
                required
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />

              <div className="flex justify-end gap-2">
                <Button type="submit" disabled={input ? false : true}>
                  Add
                </Button>
                <Button variant="outline" type="button" onClick={clearInput}>
                  Clear
                </Button>
              </div>
            </div>
          </Field>
        </FieldGroup>
      </FieldGroup>
    </form>
  );
};

export default AddTagCard;
