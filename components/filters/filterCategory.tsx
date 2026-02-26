"use client";
import { Button } from "../ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Funnel } from "lucide-react";
import { Input } from "../ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState } from "react";

function FiltersCategories() {
  const searchParam = useSearchParams();
  const router = useRouter();

  const getParam = (key: string) => searchParam.get(key) ?? "";

  const [searchName, setSearchName] = useState(getParam("name"));
  const [createdAfter, setCreatedAfter] = useState(getParam("created_after"));
  const [createdBefore, setCreatedBefore] = useState(getParam("created_before"));

  const debouncedName = useDebounce(searchName, 500);
  useEffect(() => {
    const current = searchParam.get("name") ?? "";
    if (debouncedName === current) return;
    const params = new URLSearchParams(searchParam.toString());
    if (debouncedName) params.set("name", debouncedName);
    else params.delete("name");
    router.replace(`?${params.toString()}`);
  }, [debouncedName]);

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParam.toString());

    const fields: [string, string][] = [
      ["created_after", createdAfter],
      ["created_before", createdBefore],
    ];

    fields.forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });

    router.replace(`?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setSearchName("");
    setCreatedAfter("");
    setCreatedBefore("");
    router.replace("?");
  };

  return (
    <div className="px-4 flex items-center justify-end py-6 gap-3">
      <Input
        value={searchName}
        type="text"
        placeholder="Search Categories"
        onChange={(e) => setSearchName(e.target.value)}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-1 shadow-sm rounded-lg"
          >
            <Funnel className="w-4 h-4 mr-1" /> Filter
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="p-6 rounded-xl shadow-2xl bg-white dark:bg-zinc-900 min-w-[300px] border border-gray-200 dark:border-gray-700 z-50">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="font-bold text-lg mb-3">
              Category Filters
            </DropdownMenuLabel>

            <div className="flex flex-col gap-4 overflow-y-auto max-h-[60vh]">
              <div className="border-t border-gray-200 dark:border-gray-700 my-1" />

              {/* Dates */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <DropdownMenuLabel className="text-sm font-medium mb-1">
                    Created After
                  </DropdownMenuLabel>
                  <input
                    type="date"
                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-primary"
                    value={createdAfter}
                    onChange={(e) => setCreatedAfter(e.target.value)}
                  />
                </div>
                <div>
                  <DropdownMenuLabel className="text-sm font-medium mb-1">
                    Created Before
                  </DropdownMenuLabel>
                  <input
                    type="date"
                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-primary"
                    value={createdBefore}
                    onChange={(e) => setCreatedBefore(e.target.value)}
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 my-1" />

              {/* Actions */}
              <div className="flex gap-2 mt-2 justify-end">
                <Button
                  onClick={handleApplyFilters}
                  className="rounded-md px-4 py-2 shadow-sm"
                >
                  Apply Filters
                </Button>
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                  className="rounded-md px-4 py-2 border border-red-400 text-red-600 hover:bg-red-50 transition-all shadow-sm"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default FiltersCategories;
