"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/nav-user";
import { Sparkles, SquarePen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const historyItems = [
  { id: 1, title: "Coffee chain reviews", detail: "Processed 1,247 rows" },
  { id: 2, title: "New delivery feedback", detail: "Negative spike detected" },
  { id: 3, title: "Branch sentiment report", detail: "Ready for export" },
  { id: 4, title: "Product quality scan", detail: "3 top themes found" },
  {
    id: 5,
    title: "Support response audit",
    detail: "Recommendation generated",
  },
];

function SidebarHoverTrigger() {
  const { isMobile, state } = useSidebar();

  if (isMobile || state !== "collapsed") {
    return null;
  }

  return (
    <div className="group fixed left-0 top-5 z-30 h-16 w-8 md:block">
      <div className="absolute inset-y-0 left-0 w-8" />
      <SidebarTrigger className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full border border-[#1A2E26]/10 bg-white/95 text-[#1A2E26]/70 shadow-lg shadow-[#1A2E26]/10 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100 hover:bg-[#E8FFF4] hover:text-[#007A51]" />
    </div>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredHistory = historyItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.detail.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <Sidebar variant="inset" {...props}>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  size="lg"
                  asChild
                  className="hover:bg-transparent"
                >
                  <Link href="/app">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#00B074] text-white">
                      <Sparkles className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">SIGAP AI</span>
                      <span className="truncate text-xs text-muted-foreground">
                        Review intelligence
                      </span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarTrigger className="group-data-[collapsible=icon]:hidden rounded-full border border-[#1A2E26]/10 bg-white/90 text-[#1A2E26]/65 shadow-sm transition hover:bg-[#E8FFF4] hover:text-[#007A51]" />
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="rounded-lg bg-[#00B074] text-white hover:bg-[#079968] hover:text-white"
                >
                  <Link href="/app">
                    <SquarePen className="size-4" />
                    <span>New analysis</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup className="pt-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 size-4 text-[#1A2E26]/40" />
              <Input
                type="search"
                placeholder="Search chats..."
                className="h-9 w-full rounded-lg border-[#1A2E26]/10 bg-white pl-8 text-sm placeholder:text-[#1A2E26]/40 focus-visible:ring-[#00B074]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Recent analyses</SidebarGroupLabel>
            <SidebarGroupContent>
              {filteredHistory.length > 0 ? (
                <SidebarMenu>
                  {filteredHistory.map((item, index) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        className={`h-auto py-2 ${
                          index === 0 && searchQuery === ""
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : ""
                        }`}
                      >
                        <div className="grid gap-0.5 text-left">
                          <span className="truncate text-sm font-medium">
                            {item.title}
                          </span>
                          <span className="truncate text-xs text-muted-foreground">
                            {item.detail}
                          </span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              ) : (
                <p className="px-2 py-4 text-center text-xs text-muted-foreground">
                  No chats found.
                </p>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>
      <SidebarHoverTrigger />
    </>
  );
}
