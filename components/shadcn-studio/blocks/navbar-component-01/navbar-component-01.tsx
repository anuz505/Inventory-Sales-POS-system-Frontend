"use client";
import { MenuIcon, SearchIcon } from "lucide-react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
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
import { SidebarTrigger } from "@/components/ui/sidebar";
import useAuthCheckUser from "@/hooks/AuthCheckUser";
const Navbar = () => {
  const { user, loading } = useAuthCheckUser();
  const router = useRouter();
  const handleLoginButtonclick = () => {
    router.push("/sign-in");
  };
  const { setTheme } = useTheme();
  return (
    <header className="bg-background z-50 sticky top-0 flex justify-center items-center">
      <div className="flex w-full  justify-between  py-6 sm:px-2 items-center">
        <div className="flex">
          <SidebarTrigger />
          <h1
            onClick={() => router.push("/")}
            className="px-4  md:text-4xl font-poppins text-2xl font-bold text-primary"
          >
            Dashboard
          </h1>
        </div>
        <div className="flex justify-between gap-4 pr-3">
          <div className="text-muted-foreground    font-medium md:justify-end lg:justify-end md:flex lg:flex  ">
            <Button
              onClick={handleLoginButtonclick}
              disabled={!!user}
              className="disabled:pointer-events-none disabled:opacity-50 disabled:bg-gray-300 disabled:text-gray-500"
            >
              {user ? user.username : "Sign in"}
            </Button>
          </div>

          <div className="flex items-center gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
