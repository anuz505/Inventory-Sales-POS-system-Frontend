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
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <SidebarMenuButton>
                  <h2 className="px-4 py-2 font-bold text-lg">My App</h2>
                </SidebarMenuButton>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content className="w-[--radix-popper-anchor-width]">
                <DropdownMenu.Item>
                  <span>Hello</span>
                  {/* TODO */}
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
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
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
      <SidebarRail />
    </Sidebar>
  );
}
