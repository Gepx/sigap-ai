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
    <Sidebar variant="inset" className="border-none" {...props}>
      <SidebarHeader className="pb-6 pt-4">
        <div className="flex items-center justify-between px-4 pt-2 mb-6">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00B074]/10">
              <Sparkles className="h-5 w-5 text-[#00B074]" />
            </div>
            <span className="text-xl font-extrabold text-[#1A2E26] tracking-tight">SIGAP AI</span>
          </div>
          <button 
            onClick={toggleSidebar} 
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-black/5 text-[#1A2E26]/50 transition-colors"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>

        <div className="px-4 flex flex-col gap-3">
          <button className="flex w-full items-center gap-3 rounded-full bg-[#00B074] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#00B074]/20 transition-all hover:bg-[#00B074]/90 hover:scale-[1.02]">
            <MessageSquarePlus className="h-5 w-5" />
            New chat
          </button>
          <button className="flex w-full items-center gap-3 rounded-full border border-border/50 bg-white px-5 py-3.5 text-sm font-medium text-[#1A2E26]/70 shadow-sm transition-all hover:bg-black/5 hover:text-[#1A2E26]">
            <Search className="h-5 w-5 text-[#1A2E26]/40" />
            Search chats
          </button>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-bold text-[#1A2E26]/40 uppercase tracking-widest mb-3">
            Recent
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {recentChats.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton asChild>
                    <a href="#" className="flex w-full items-center truncate text-sm text-[#1A2E26]/70 font-medium hover:text-[#1A2E26] hover:bg-black/5 rounded-xl px-4 py-2.5 transition-colors">
                      <span className="truncate">{chat.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center justify-between rounded-full bg-white border border-border/50 px-3 py-2.5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 border border-border/50 shadow-sm">
                  <AvatarImage src="" alt="Testing User" />
                  <AvatarFallback className="bg-[#00B074]/10 text-[#00B074] font-bold">TU</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm font-bold text-[#1A2E26]">Testing User</span>
                  <span className="text-[11px] font-medium text-[#1A2E26]/50 truncate max-w-[110px]">testing.user@sigap.ai</span>
                </div>
              </div>
              <MoreHorizontal className="h-5 w-5 text-[#1A2E26]/40 mr-1" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[220px] rounded-2xl p-2 shadow-xl border-border/50">
            <DropdownMenuItem className="gap-3 text-[#1A2E26] font-medium rounded-xl p-3 cursor-pointer focus:bg-black/5 focus:text-[#1A2E26]">
              <Settings className="h-4 w-4" />
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-3 text-rose-600 font-medium rounded-xl p-3 cursor-pointer focus:bg-rose-50 focus:text-rose-700">
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
