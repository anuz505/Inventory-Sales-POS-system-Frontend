"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

import React from "react";
import { NavbarWrapper } from "@/components/common/Navbar";
import { usePathname } from "next/navigation";

function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();
  const isAuthPage =
    pathName.startsWith("/sign-in") || pathName.startsWith("/sign-up");
  return (
    <>
      {isAuthPage ? (
        children
      ) : (
        <SidebarProvider>
          <AppSidebar />
          <div className="flex flex-col w-full justify-baseline items-ce">
            <NavbarWrapper />
            {children}
          </div>
        </SidebarProvider>
      )}
    </>
  );
}

export default SidebarWrapper;
