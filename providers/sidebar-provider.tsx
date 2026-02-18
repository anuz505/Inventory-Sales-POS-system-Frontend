import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

import React from "react";
import { NavbarWrapper } from "@/components/common/Navbar";

function SidebarWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col w-full justify-baseline items-ce">
        <NavbarWrapper />
        {children}
      </div>
    </SidebarProvider>
  );
}

export default SidebarWrapper;
