"use client";
import { MenuIcon, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
type NavigationItem = {
  title: string;
  href: string;
}[];
import useAuthCheckUser from "@/hooks/AuthCheckUser";
const Navbar = ({ navigationData }: { navigationData: NavigationItem }) => {
  const { user, loading } = useAuthCheckUser();
  const router = useRouter();
  const handleLoginButtonclick = () => {
    router.push("/sign-in");
  };
  return (
    <header className="bg-background sticky top-0 z-50">
      <div className="flex max-w-7xl items-center justify-between gap-4 mx-auto py-6 sm:px-2">
        <h1
          onClick={() => router.push("/")}
          className="md:text-4xl font-poppins text-2xl font-bold text-gray-700 "
        >
          Dashboard
        </h1>
        <div className="text-muted-foreground  flex-1 items-center gap-8 font-medium md:justify-end lg:gap-16 hidden md:flex lg:flex">
          {navigationData.map((item, index) => (
            <a key={index} href={item.href} className=" ">
              {item.title}
            </a>
          ))}
          <Button onClick={handleLoginButtonclick}>
            {user ? user.username : "Sign in"}
          </Button>
        </div>

        <div className="flex items-center gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger className="md:hidden" asChild>
              <Button variant="outline" size="icon">
                <MenuIcon />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuGroup>
                {navigationData.map((item, index) => (
                  <DropdownMenuItem key={index}>
                    <a href={item.href}>{item.title}</a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
