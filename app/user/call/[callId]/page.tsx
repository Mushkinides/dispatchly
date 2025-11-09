// import { CreateNoteButton } from "@/components/create-note-button";
// import NoteCard from "@/components/note-card";
import { AddCallTagButton } from "@/components/add-call-tag-button";
import { PageWrapper } from "@/components/page-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemActions,
} from "@/components/ui/item";
import { getCallById } from "@/server/calls";
import { getTagsByCallId } from "@/server/callTags";
import { getTags } from "@/server/tags";

type Params = Promise<{
  callId: number;
}>;

export default async function CallPage({ params }: { params: Params }) {
  const { callId: callId } = await params;
  const { call } = await getCallById(callId);
  const tags = await getTags();
  const callTags = await getTagsByCallId(callId);

  return (
    <PageWrapper
      breadcrumbs={[
        { label: "Dashboard", href: "/user" },
        {
          label: call?.title ?? "Call",
          href: `/user/call/${callId}`,
        },
      ]}
    >
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>{call?.title}</ItemTitle>

          <div className="flex flex-1 gap-2">
            <Badge>Test</Badge>
            <Badge>Test</Badge>
            <Badge>Test</Badge>
          </div>
        </ItemContent>
        <ItemActions>
          <AddCallTagButton tags={tags.tags} callTags={callTags.tags} />
        </ItemActions>
      </Item>

      {/* <CreateNoteButton notebookId={callId} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {call?.notes?.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div> */}
    </PageWrapper>
  );
}
