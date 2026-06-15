import React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/app/app-sidebar";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <TooltipProvider>
        <AppSidebar />
        <SidebarInset className="relative overflow-hidden border border-neutral-200/50">
          <div className="absolute left-4 top-4 z-40 md:hidden">
            <SidebarTrigger className="rounded-full bg-white/90 p-2 shadow-sm border border-neutral-200/50" />
          </div>
          {children}
        </SidebarInset>
      </TooltipProvider>
    </SidebarProvider>
  );
};

export default AppLayout;
