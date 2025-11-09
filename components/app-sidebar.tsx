"use client";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@radix-ui/react-dialog";
import { DialogHeader, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createCall } from "@/server/calls";
import { CreateCallButton } from "./create-call-button";

const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Call list",
      url: "#",
      items: [
        {
          title: "Installation",
          url: "#",
        },
        {
          title: "Project Structure",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isOpen, setOpen] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [input, setInput] = useState("");
  const router = useRouter();

  async function handleNewCall(event?: React.FormEvent) {
    if (event) event.preventDefault();
    const title = input.trim();
    if (!title) return;
    try {
      const res = await createCall({ title: title });
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
      setOpen(false);
    }
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex gap-4 justify-between">
          <h3 className="text-bold text-2xl">DAshboard</h3>
          <CreateCallButton />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
