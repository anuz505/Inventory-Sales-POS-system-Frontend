import { Skeleton } from "../ui/skeleton";

import React from "react";

function SkeletonTable() {
  return (
    <div className="flex mt-2 py-5 px-7 w-full flex-col gap-2">
      {Array.from({ length: 20 }).map((_, index) => (
        <div className="flex gap-4" key={index}>
          <Skeleton className="h-7 flex-1" />
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-7 w-20" />
        </div>
      ))}
    </div>
  );
}
export default SkeletonTable;
