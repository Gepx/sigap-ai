"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/nav-user";
import {
  Sparkles,
  SquarePen,
  Search,
  PanelLeft,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const historyItems = [
  { id: 1, title: "Analyzing Sales Data Q4 2025" },
  { id: 2, title: "Customer Segmentation Model" },
  { id: 3, title: "Revenue Forecast Analysis" },
  { id: 4, title: "Product Performance Report" },
  { id: 5, title: "Marketing Campaign Review" },
  { id: 6, title: "Supply Chain Optimization" },
  { id: 7, title: "User Retention Dashboard" },
  { id: 8, title: "Competitor Pricing Analysis" },
  { id: 9, title: "Quarterly Financial Summary" },
  { id: 10, title: "Inventory Trend Prediction" },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state, toggleSidebar } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          {/* Logo + Toggle row */}
          <SidebarMenuItem className="mb-4">
            <div className="flex items-center justify-between w-full">
              {state === "collapsed" ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={toggleSidebar}
                      className="group/logo relative flex aspect-square size-8 items-center justify-center rounded-lg bg-emerald-600 text-white cursor-pointer transition-all hover:bg-emerald-700"
                      size="icon"
                      variant="ghost"
                    >
                      <Sparkles className="size-4 transition-opacity duration-200 group-hover/logo:opacity-0" />
                      <PanelLeftOpen className="size-4 absolute inset-0 m-auto opacity-0 transition-opacity duration-200 group-hover/logo:opacity-100" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Open sidebar</TooltipContent>
                </Tooltip>
              ) : (
                <>
                  <SidebarMenuButton
                    size="lg"
                    tooltip="SIGAP AI"
                    className="cursor-pointer flex-1 hover:bg-transparent"
                  >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                      <Sparkles className="size-4" />
                    </div>
                    <span className="truncate font-semibold text-lg">
                      SIGAP AI
                    </span>
                  </SidebarMenuButton>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={toggleSidebar}
                        className="group/toggle relative flex items-center justify-center size-8 rounded-full text-emerald-600 hover:bg-emerald-100 transition-colors cursor-pointer shrink-0"
                        variant="ghost"
                        size="icon"
                      >
                        <PanelLeft className="size-4 transition-opacity duration-200 group-hover/toggle:opacity-0" />
                        <PanelLeftClose className="size-4 absolute inset-0 m-auto opacity-0 transition-opacity duration-200 group-hover/toggle:opacity-100" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">Close sidebar</TooltipContent>
                  </Tooltip>
                </>
              )}
            </div>
          </SidebarMenuItem>

          {/* New Chat */}
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="New Chat" className="cursor-pointer">
              <SquarePen className="size-4" />
              <span>New chat</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Search */}
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Search" className="cursor-pointer">
              <Search className="size-4" />
              <span>Search chats</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content: History List */}
      <SidebarContent>
        {state === "expanded" && (
          <SidebarGroup>
            <SidebarGroupLabel>Recent</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {historyItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className="cursor-pointer"
                    >
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Footer: User Profile */}
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
