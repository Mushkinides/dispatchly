import AddTagCard from "@/components/add-tag-card";
import TagItem from "@/components/tag-item";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { getTags } from "@/server/tags";

export default async function Admin() {
  const tags = await getTags();
  return (
    <>
      <div className="w-full px-2 pt-20">
        <div className="mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12">
          <div className=" py-3 lg:gap-0 lg:py-4">
            <span className="text-xl font-bold">
              <span className="text-primary">A</span>dmin D
              <span className="text-primary">A</span>shboard
            </span>
            <AddTagCard />
            <FieldSeparator />
            <Field className="border-2 rounded-2xl py-2 px-4">
              <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
                Tags List
              </FieldLabel>
              <div className="flex flex-col w-full gap-4 md:flex-row">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {tags.success &&
                    tags?.tags?.map((tag) => (
                      <TagItem key={tag.id} tag={tag} />
                    ))}
                </div>
                {tags.success && tags?.tags?.length == 0 && (
                  <div>No tags found</div>
                )}
              </div>
            </Field>
          </div>
        </div>
      </div>
    </>
  );
}
