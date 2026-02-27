"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { navigationData } from "@/config/navbar-config";
import { CircleChevronDown } from "lucide-react";

export function AppSidebar() {
  const {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu.Root></DropdownMenu.Root>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navigationData.map((item) => (
              <SidebarMenuItem key={item.href} className="overflow-hidden">
                <a
                  href={item.href}
                  className="block px-4 py-2 hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all  rounded"
                >
                  {item.title}
                </a>
              </SidebarMenuItem>
            ))}
            <SidebarMenuItem className="overflow-hidden">
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <SidebarMenuButton className=" block px-4 pb-2 text-lg items-center hover:bg-primary hover:text-primary-foreground  transition-all  rounded">
                    <h2>Inventory</h2>
                    <CircleChevronDown />
                  </SidebarMenuButton>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.Item>
                    <a
                      href="/stock-movement"
                      className="block px-4 py-2 hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all  rounded"
                    >
                      Stock Movement
                    </a>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item>
                    <a
                      href="/suppliers"
                      className="block px-4 py-2 hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all  rounded"
                    >
                      Suppliers
                    </a>
                  </DropdownMenu.Item>
                  <DropdownMenu.DropdownMenuItem>
                    <a
                      href="/categories"
                      className="block px-4 py-2 hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all  rounded"
                    >
                      Categories
                    </a>
                  </DropdownMenu.DropdownMenuItem>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
      <SidebarRail />
    </Sidebar>
  );
}
