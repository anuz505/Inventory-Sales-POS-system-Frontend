"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { useStockMovements } from "@/hooks/use-stockmovement";
import { Spinner } from "../ui/spinner";
import SkeletonTable from "../common/skeleton-table";
import { useRouter, useSearchParams } from "next/navigation";
import FiltersStockMovement from "../filters/filterStockMovement";
import { MovementType, MovementReason } from "@/types/stockmovement-types";
import { Badge } from "../ui/badge";
import { downloadStockMovementCSV } from "@/services/stockmovement-file";
const movementTypeBadge = (type: MovementType) => {
  return type === "IN" ? (
    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">IN</Badge>
  ) : (
    <Badge className="bg-red-100 text-red-700 hover:bg-red-100">OUT</Badge>
  );
};
const reasonBadge = (reason: MovementReason) => {
  const styles: Record<MovementReason, string> = {
    PURCHASE: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    SALE: "bg-orange-100 text-orange-700 hover:bg-orange-100",
    RETURN: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
    ADJUSTMENT: "bg-purple-100 text-purple-700 hover:bg-purple-100",
    TRANSFER: "bg-gray-100 text-gray-700 hover:bg-gray-100",
  };
  return (
    <Badge className={styles[reason] ?? "bg-gray-100 text-gray-700"}>
      {reason}
    </Badge>
  );
};

function StockMovements() {
  const searchParam = useSearchParams();
  const router = useRouter();

  const getParam = (key: string) => searchParam.get(key) ?? undefined;

  const params = {
    product_name: getParam("product_name"),
    movement_type: getParam("movement_type") as MovementType | undefined,
    reason: getParam("reason") as MovementReason | undefined,
    username: getParam("username"),
    created_after: getParam("created_after"),
    created_before: getParam("created_before"),
  };

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useStockMovements(params);

  const allMovements = data?.pages.flatMap((page) => page.results) ?? [];
  const totalCount = data?.pages[0]?.count ?? 0;

  if (isLoading) return <SkeletonTable />;
  if (error) {
    console.error(error);
    return (
      <div className="text-red-500 text-sm">Error loading stock movements.</div>
    );
  }

  return (
    <div className="py-5 px-7 w-full">
      <div className="flex justify-between">
        <Button variant="ghost" onClick={() => router.push("/")}>
          <ArrowLeft />
          Back
        </Button>
        <Button variant="outline" onClick={downloadStockMovementCSV}>
          Download Stock Movement Logs
        </Button>
      </div>
      <FiltersStockMovement />
      <Table>
        <TableCaption>Stock Movement List</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allMovements.map((movement) => (
            <TableRow key={movement.id}>
              <TableCell className="font-medium">
                {movement.product_name}
              </TableCell>
              <TableCell>{movement.quantity}</TableCell>
              <TableCell>{movementTypeBadge(movement.movement_type)}</TableCell>
              <TableCell>{reasonBadge(movement.reason)}</TableCell>
              <TableCell>{movement.username}</TableCell>
              <TableCell className="max-w-[200px] truncate text-muted-foreground text-sm">
                {movement.notes}
              </TableCell>
              <TableCell>
                {new Date(movement.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-end items-center gap-4 mt-4">
        <span>
          Showing {allMovements.length} of {totalCount} movements
        </span>
        <Button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
          className="px-4 py-2 rounded bg-primary disabled:opacity-50"
        >
          {isFetchingNextPage ? (
            <div className="flex gap-2">
              <Spinner /> Loading..
            </div>
          ) : (
            "Load More"
          )}
        </Button>
      </div>
    </div>
  );
}

export default StockMovements;
