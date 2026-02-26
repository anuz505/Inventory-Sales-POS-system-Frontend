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
import { MovementType, MovementReason } from "@/types/stockmovement-types";

function FiltersStockMovement() {
  const searchParam = useSearchParams();
  const router = useRouter();

  const getParam = (key: string) => searchParam.get(key) ?? "";

  const [searchProductName, setSearchProductName] = useState(
    getParam("product_name"),
  );
  const [movementType, setMovementType] = useState<MovementType | "">(
    getParam("movement_type") as MovementType | "",
  );
  const [reason, setReason] = useState<MovementReason | "">(
    getParam("reason") as MovementReason | "",
  );
  const [username, setUsername] = useState(getParam("username"));
  const [createdAfter, setCreatedAfter] = useState(getParam("created_after"));
  const [createdBefore, setCreatedBefore] = useState(
    getParam("created_before"),
  );

  // Debounced product name search — updates URL automatically
  const debouncedProductName = useDebounce(searchProductName, 500);
  useEffect(() => {
    const current = searchParam.get("product_name") ?? "";
    if (debouncedProductName === current) return;
    const params = new URLSearchParams(searchParam.toString());
    if (debouncedProductName) params.set("product_name", debouncedProductName);
    else params.delete("product_name");
    router.replace(`?${params.toString()}`);
  }, [debouncedProductName]);

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParam.toString());

    const fields: [string, string][] = [
      ["movement_type", movementType],
      ["reason", reason],
      ["username", username],
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
    setSearchProductName("");
    setMovementType("");
    setReason("");
    setUsername("");
    setCreatedAfter("");
    setCreatedBefore("");
    router.replace("?");
  };

  return (
    <div className="px-4 flex items-center justify-end py-6 gap-3">
      <Input
        value={searchProductName}
        type="text"
        placeholder="Search by product name"
        onChange={(e) => setSearchProductName(e.target.value)}
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
              Stock Movement Filters
            </DropdownMenuLabel>

            <div className="flex flex-col gap-4 overflow-y-auto max-h-[60vh]">
              {/* Movement Type */}
              <div>
                <DropdownMenuLabel className="text-sm font-medium mb-1">
                  Movement Type
                </DropdownMenuLabel>
                <select
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-sm focus:ring-2 focus:ring-primary bg-white dark:bg-zinc-900"
                  value={movementType}
                  onChange={(e) =>
                    setMovementType(e.target.value as MovementType | "")
                  }
                >
                  <option value="">All</option>
                  <option value="IN">IN</option>
                  <option value="OUT">OUT</option>
                </select>
              </div>

              {/* Reason */}
              <div>
                <DropdownMenuLabel className="text-sm font-medium mb-1">
                  Reason
                </DropdownMenuLabel>
                <select
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-2 py-1.5 text-sm focus:ring-2 focus:ring-primary bg-white dark:bg-zinc-900"
                  value={reason}
                  onChange={(e) =>
                    setReason(e.target.value as MovementReason | "")
                  }
                >
                  <option value="">All</option>
                  <option value="PURCHASE">Purchase</option>
                  <option value="SALE">Sale</option>
                  <option value="RETURN">Return</option>
                  <option value="ADJUSTMENT">Adjustment</option>
                  <option value="TRANSFER">Transfer</option>
                </select>
              </div>

              {/* Username */}
              <div>
                <DropdownMenuLabel className="text-sm font-medium mb-1">
                  Username
                </DropdownMenuLabel>
                <Input
                  type="text"
                  placeholder="Filter by username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

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

export default FiltersStockMovement;
