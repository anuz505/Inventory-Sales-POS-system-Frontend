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

function FiltersSales() {
  const searchParam = useSearchParams();
  const router = useRouter();

  const getParam = (key: string) => searchParam.get(key) ?? "";

  const [invoiceNumber, setInvoiceNumber] = useState(
    getParam("invoice_number"),
  );
  const [paymentMethod, setPaymentMethod] = useState(
    getParam("payment_method"),
  );
  const [paymentStatus, setPaymentStatus] = useState(
    getParam("payment_status"),
  );
  const [minTotal, setMinTotal] = useState(getParam("min_total"));
  const [maxTotal, setMaxTotal] = useState(getParam("max_total"));
  const [minDiscount, setMinDiscount] = useState(getParam("min_discount"));
  const [maxDiscount, setMaxDiscount] = useState(getParam("max_discount"));
  const [createdAfter, setCreatedAfter] = useState(getParam("created_after"));
  const [createdBefore, setCreatedBefore] = useState(
    getParam("created_before"),
  );

  // Debounced invoice number search — updates URL automatically
  const debouncedInvoice = useDebounce(invoiceNumber, 500);
  useEffect(() => {
    const current = searchParam.get("invoice_number") ?? "";
    if (debouncedInvoice === current) return;
    const params = new URLSearchParams(searchParam.toString());
    if (debouncedInvoice) params.set("invoice_number", debouncedInvoice);
    else params.delete("invoice_number");
    router.replace(`?${params.toString()}`);
  }, [debouncedInvoice]);

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParam.toString());

    const fields: [string, string][] = [
      ["payment_method", paymentMethod],
      ["payment_status", paymentStatus],
      ["min_total", minTotal],
      ["max_total", maxTotal],
      ["min_discount", minDiscount],
      ["max_discount", maxDiscount],
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
    setInvoiceNumber("");
    setPaymentMethod("");
    setPaymentStatus("");
    setMinTotal("");
    setMaxTotal("");
    setMinDiscount("");
    setMaxDiscount("");
    setCreatedAfter("");
    setCreatedBefore("");
    router.replace("?");
  };

  return (
    <div className="px-4 flex items-center justify-end py-6 gap-3">
      <Input
        value={invoiceNumber}
        type="text"
        placeholder="Search by Invoice Number"
        onChange={(e) => setInvoiceNumber(e.target.value)}
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
              Sales Filters
            </DropdownMenuLabel>

            <div className="flex flex-col gap-4 overflow-y-auto max-h-[60vh]">
              {/* Payment Method */}
              <div>
                <DropdownMenuLabel className="text-sm font-medium mb-1">
                  Payment Method
                </DropdownMenuLabel>
                <select
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-2 py-2 text-sm bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="">All Methods</option>
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="net_banking">Net Banking</option>
                  <option value="wallet">Wallet</option>
                </select>
              </div>

              {/* Payment Status */}
              <div>
                <DropdownMenuLabel className="text-sm font-medium mb-1">
                  Payment Status
                </DropdownMenuLabel>
                <select
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-2 py-2 text-sm bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary"
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 my-1" />

              {/* Total Amount Range */}
              <div>
                <DropdownMenuLabel className="text-sm font-medium mb-1">
                  Total Amount Range
                </DropdownMenuLabel>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={minTotal}
                    onChange={(e) => setMinTotal(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={maxTotal}
                    onChange={(e) => setMaxTotal(e.target.value)}
                  />
                </div>
              </div>

              {/* Discount Range */}
              <div>
                <DropdownMenuLabel className="text-sm font-medium mb-1">
                  Discount Range
                </DropdownMenuLabel>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={minDiscount}
                    onChange={(e) => setMinDiscount(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                  />
                </div>
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

export default FiltersSales;
