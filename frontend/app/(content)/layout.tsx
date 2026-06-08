import React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/app-sidebar";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <TooltipProvider>
        <AppSidebar />
        <SidebarInset className="overflow-hidden border border-neutral-200/50">{children}</SidebarInset>
      </TooltipProvider>
    </SidebarProvider>
  );
};

export default AppLayout;
