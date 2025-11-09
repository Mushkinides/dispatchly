// import { CreateNoteButton } from "@/components/create-note-button";
// import NoteCard from "@/components/note-card";
import { PageWrapper } from "@/components/page-wrapper";
import { getCallById } from "@/server/calls";

type Params = Promise<{
  callId: number;
}>;

export default async function CallPage({ params }: { params: Params }) {
  const { callId: callId } = await params;

  const { call } = await getCallById(callId);

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
      <h1>{call?.title}</h1>

      {/* <CreateNoteButton notebookId={callId} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {call?.notes?.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div> */}
    </PageWrapper>
  );
}
