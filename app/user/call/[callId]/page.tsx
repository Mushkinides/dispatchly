import { AddCallTagButton } from "@/components/add-call-tag-button";
import { CreateTaskButton } from "@/components/create-task-button";
import { TaskItem } from "@/components/task-item";
import { PageWrapper } from "@/components/page-wrapper";
import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemActions,
} from "@/components/ui/item";
import { getCallById } from "@/server/calls";
import { getTagsByCallId } from "@/server/callTags";
import { getTags } from "@/server/tags";
import { getTasksByCallId } from "@/server/tasks";

type Params = Promise<{
  callId: number;
}>;

export default async function CallPage({ params }: { params: Params }) {
  const { callId } = await params;
  const { call } = await getCallById(callId);
  const { tags } = await getTags();
  const { tags: callTags } = await getTagsByCallId(callId);
  const { tasks } = await getTasksByCallId(callId);

  const callTagList = callTags ?? [];
  const tagList = tags ?? [];
  const taskList = tasks ?? [];

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
      {/* Call Info Section */}
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>{call?.title}</ItemTitle>

          <div className="flex flex-1 gap-2 flex-wrap">
            {callTagList.length === 0 ? (
              <Badge variant="secondary">No tags</Badge>
            ) : (
              callTagList.map((t) => <Badge key={String(t.id)}>{t.name}</Badge>)
            )}
          </div>
        </ItemContent>
        <ItemActions>
          <AddCallTagButton
            callId={callId}
            tags={tagList}
            callTags={callTagList}
          />
        </ItemActions>
      </Item>

      {/* Tasks Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Tasks</h2>
          <CreateTaskButton callId={callId} />
        </div>

        <div className="space-y-2">
          {taskList.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No tasks yet. Create one to get started!
            </div>
          ) : (
            taskList.map((task) => (
              <TaskItem key={task.id} task={task} callId={callId} />
            ))
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
