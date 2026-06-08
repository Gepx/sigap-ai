"use client"

import * as React from "react"
import { Sparkles, MessageSquarePlus, Search, MoreHorizontal, Settings, LogOut } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const recentChats = [
  { id: 1, title: "Analyzing Sales Data Q4 2025" },
  { id: 2, title: "Customer Segmentation Model" },
  { id: 3, title: "Telco Churn Prediction" },
  { id: 4, title: "Social Media Sentiment Tracking" },
  { id: 5, title: "Q1 Campaign Performance" },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { toggleSidebar } = useSidebar()

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="border-b border-border/50 pb-4">
        <div className="flex items-center justify-between px-2 pt-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00B074]/10">
              <Sparkles className="h-5 w-5 text-[#00B074]" />
            </div>
            <span className="text-lg font-bold text-[#1A2E26] tracking-tight">SIGAP AI</span>
          </div>
          {/* Note: The SidebarTrigger is usually handled by the parent layout or SidebarTrigger component, 
              but the requirements asked to "Include the collapse sidebar button next to it."
              We can just use a standard button here if needed, or rely on the SidebarTrigger.
              We will add a custom collapse button just in case. */}
          <button 
            onClick={toggleSidebar} 
            className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-black/5 text-[#1A2E26]/50"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 px-2 flex flex-col gap-1">
          <button className="flex w-full items-center gap-2 rounded-md bg-[#00B074] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#00B074]/90">
            <MessageSquarePlus className="h-4 w-4" />
            New chat
          </button>
          <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[#1A2E26]/70 transition-colors hover:bg-black/5 hover:text-[#1A2E26]">
            <Search className="h-4 w-4" />
            Search chats
          </button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-semibold text-[#1A2E26]/50 uppercase tracking-wider mb-2">
            Recent
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {recentChats.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton asChild>
                    <a href="#" className="flex w-full items-center truncate text-sm text-[#1A2E26]/80 hover:text-[#1A2E26] hover:bg-black/5 rounded-md px-2 py-1.5 transition-colors">
                      <span className="truncate">{chat.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center justify-between rounded-lg px-2 py-2 hover:bg-black/5 transition-colors">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarImage src="" alt="Testing User" />
                  <AvatarFallback className="bg-[#00B074]/10 text-[#00B074] font-medium">TU</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm font-medium text-[#1A2E26]">Testing User</span>
                  <span className="text-xs text-[#1A2E26]/50 truncate max-w-[120px]">testing.user@sigap.ai</span>
                </div>
              </div>
              <MoreHorizontal className="h-4 w-4 text-[#1A2E26]/50" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px] rounded-xl">
            <DropdownMenuItem className="gap-2 text-[#1A2E26] cursor-pointer focus:bg-black/5 focus:text-[#1A2E26]">
              <Settings className="h-4 w-4" />
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-rose-500 cursor-pointer focus:bg-rose-50 focus:text-rose-600">
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

