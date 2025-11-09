import CallItem from "@/components/call-item";
import { CreateCallButton } from "@/components/create-call-button";
import { PageWrapper } from "@/components/page-wrapper";
import { getCalls } from "@/server/calls";

export default async function Page() {
  const calls = await getCalls();

  return (
    <PageWrapper breadcrumbs={[{ label: "Dashboard", href: "/user" }]}>
      <h1>Calls</h1>

      <CreateCallButton />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {calls.success &&
          calls?.calls?.map((call) => (
            // <NotebookCard key={notebook.id} notebook={notebook} />
            <CallItem key={call.id} call={call} />
          ))}
      </div>
      {calls.success && calls?.calls?.length == 0 && <div>No calls found</div>}
    </PageWrapper>
  );
}
