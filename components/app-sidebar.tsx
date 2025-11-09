import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { getCalls } from "@/server/calls";
import { CreateCallButton } from "./create-call-button";
import Link from "next/link";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const calls = await getCalls();

  const data = {
    navMain: [
      ...(calls.calls?.map((call) => ({
        id: call.id,
        title: call.title,
        url: `${call.id}`,
      })) ?? []),
    ],
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex gap-4 justify-between">
          <h3 className="font-bold text-lg">
            User D<span className="text-primary">A</span>shboard
          </h3>
          <CreateCallButton />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((call) => (
          <SidebarMenuItem key={call.id}>
            <SidebarMenuButton asChild>
              <Link href={call.url}>{call.title}</Link>
              {/* <a href={call.url}>{call.title}</a> */}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
