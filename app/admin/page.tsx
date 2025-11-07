"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Admin = () => {
  const [input, setInput] = useState("");

  function clearInput() {
    setInput("");
  }

  return (
    <>
      <div className="w-full px-2 pt-20">
        <div className="mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12">
          <div className=" py-3 lg:gap-0 lg:py-4">
            <span className="text-xl font-bold">
              <span className="text-primary">A</span>dmin D
              <span className="text-primary">A</span>shboard
            </span>
            <form className="mt-4">
              <FieldGroup>
                <FieldSet>
                  <FieldLegend>Tags</FieldLegend>
                  <FieldGroup>
                    <Field className="border-2 rounded-2xl py-2 px-4">
                      <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
                        Create a new tag
                      </FieldLabel>
                      <FieldDescription>
                        Tag names must be unique
                      </FieldDescription>
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
                          <Button type="submit">Add</Button>
                          <Button
                            variant="outline"
                            type="button"
                            onClick={clearInput}
                          >
                            Clear
                          </Button>
                        </div>
                      </div>
                    </Field>
                  </FieldGroup>
                  <FieldSeparator />
                  <FieldGroup>
                    <Field className="border-2 rounded-2xl py-2 px-4">
                      <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
                        Tags List
                      </FieldLabel>
                      <div className="flex flex-col w-full gap-4 md:flex-row">
                        <p>Something else</p>

                        <div className="flex justify-end gap-2">
                          <Button type="submit" variant="secondary">
                            Edit
                          </Button>
                          <Button variant="destructive" type="button">
                            Remove
                          </Button>
                        </div>
                      </div>
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </FieldGroup>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
