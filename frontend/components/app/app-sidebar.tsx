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
import { NavUser } from "@/components/app/nav-user";
import {
  Sparkles,
  SquarePen,
  Search,
  MoreHorizontal,
  Trash2,
  Edit2,
  Check,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { toast } from "sonner";
import { useParams, useRouter, usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

interface HistoryItem {
  uuid: string;
  title: string;
  detail: string;
}

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
  const [historyItems, setHistoryItems] = React.useState<HistoryItem[]>([]);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState("");

  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentId = params?.id;
  const isNewChat = pathname === "/app";

  React.useEffect(() => {
    api
      .get("/api/ai/history")
      .then((res) => {
        if (res.data && res.data.success) {
          setHistoryItems(res.data.data);
        }
      })
      .catch((err) => console.error("Failed to fetch history", err));
  }, [pathname]);

  const handleRename = (uuid: string, currentTitle: string) => {
    setEditingId(uuid);
    setEditTitle(currentTitle);
  };

  const submitRename = async (uuid: string) => {
    if (!editTitle.trim()) {
      setEditingId(null);
      return;
    }
    try {
      await api.patch(`/api/ai/history/${uuid}`, { title: editTitle });
      setHistoryItems((prev) =>
        prev.map((item) =>
          item.uuid === uuid ? { ...item, title: editTitle } : item,
        ),
      );
    } catch (e: any) {
      console.error(e);
      toast.error("Gagal mengubah nama", {
        description:
          e?.response?.data?.message || "Terjadi kesalahan pada server.",
      });
    }
    setEditingId(null);
  };

  const handleDelete = async (uuid: string) => {
    try {
      await api.delete(`/api/ai/history/${uuid}`);
      setHistoryItems((prev) => prev.filter((item) => item.uuid !== uuid));
      if (currentId === uuid) {
        router.push("/app");
      }
    } catch (e: any) {
      console.error(e);
      toast.error("Gagal menghapus riwayat", {
        description:
          e?.response?.data?.message || "Terjadi kesalahan pada server.",
      });
    }
  };

  const filteredHistory = historyItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.detail.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const displayHistory = [...filteredHistory];
  if (isNewChat && !searchQuery) {
    displayHistory.unshift({
      uuid: "new-chat-temp",
      title: "New chat",
      detail: "Creating new analysis...",
    });
  }

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
                    <div className="flex aspect-square size-8 items-center justify-center">
                      <Image
                        src="/green_sigap_logo.png"
                        alt="Sigap AI Logo"
                        width={32}
                        height={32}
                        className="object-contain"
                      />
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
              {displayHistory.length > 0 ? (
                <SidebarMenu>
                  {displayHistory.map((item) => (
                    <SidebarMenuItem
                      key={item.uuid}
                      className="group/item relative"
                    >
                      {editingId === item.uuid ? (
                        <div className="flex h-12 w-full items-center gap-2 px-2">
                          <Input
                            autoFocus
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") submitRename(item.uuid);
                              if (e.key === "Escape") setEditingId(null);
                            }}
                            className="h-8 flex-1 bg-white"
                          />
                          <button
                            onClick={() => submitRename(item.uuid)}
                            className="text-emerald-600 hover:text-emerald-700"
                          >
                            <Check className="size-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex w-full items-center pr-2">
                          <SidebarMenuButton
                            asChild
                            className={`h-auto flex-1 py-2 pr-8 ${
                              currentId === item.uuid ||
                              (isNewChat && item.uuid === "new-chat-temp")
                                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                : ""
                            }`}
                          >
                            <Link
                              href={
                                item.uuid === "new-chat-temp"
                                  ? "/app"
                                  : `/app/${item.uuid}`
                              }
                            >
                              <div className="grid gap-0.5 text-left pr-6">
                                <span className="truncate text-sm font-medium">
                                  {item.title}
                                </span>
                                <span className="truncate text-xs text-muted-foreground">
                                  {item.detail.startsWith("{")
                                    ? "Processed CSV"
                                    : item.detail}
                                </span>
                              </div>
                            </Link>
                          </SidebarMenuButton>

                          {item.uuid !== "new-chat-temp" && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 opacity-0 hover:text-[#1A2E26] group-hover/item:opacity-100 transition-opacity">
                                  <MoreHorizontal className="size-4 text-slate-500 hover:text-slate-800 transition-colors" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleRename(item.uuid, item.title)
                                  }
                                >
                                  <Edit2 className="mr-2 size-4" />
                                  Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(item.uuid)}
                                  className="text-rose-600 focus:text-rose-600"
                                >
                                  <Trash2 className="mr-2 size-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      )}
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
