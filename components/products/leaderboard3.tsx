"use client";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { usePeriod } from "@/hooks/use-period-param";
interface Leaderboard3Props {
  title?: string;
  description?: string;
  className?: string;
  period?: string;
}

// period = "12months",
const Leaderboard3 = ({
  title = "Top Products",
  description = "Top Products with Highest Revenues",
  className,
}: Leaderboard3Props) => {
  const period = usePeriod();

  const {
    data: stats,
    isLoading: statsIsLoading,
    error: statsError,
  } = useDashboardStats(period);

  const products = stats?.[period].sales?.top_selling_products ?? [];

  return (
    <Card className={cn("max-w-md sm:max-w-2/6 w-full ", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {statsIsLoading && (
          <p className="text-sm text-muted-foreground">Loading...</p>
        )}
        {statsError && (
          <p className="text-sm text-red-500">Failed to load products.</p>
        )}
        <div className="space-y-4">
          {products.map((product, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                  {index + 1}
                </span>
                <span className="font-medium ">{product.product__name}</span>
              </div>
              <div className="flex items-center justify-between gap-4  ">
                <span className="text-xs text-muted-foreground ">
                  Qty: {product.total_quantity}
                </span>
                <span className="text-sm font-semibold   ">
                  Rs.{product.total_revenue.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export { Leaderboard3 };
