"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type topcustomerTypes = {
  customer__name: string;
  total_orders: number;
  total_spent: number;
};
interface TopCustomersProps {
  period?: string;
  data: any;
  isLoading?: boolean;
  error?: any;
  params: { period?: string; from?: string };
}

export const TopCustomerList = ({
  data,
  isLoading,
  error,
  params,
}: TopCustomersProps) => {
  let customers: topcustomerTypes[] = [];
  if (params?.period) {
    customers = data?.[params.period]?.sales?.top_customers ?? [];
  } else if (params?.from) {
    customers = data?.[params.from]?.sales?.top_customers ?? [];
  }
  return (
    <Card className="w-full lg:flex-1">
      {" "}
      <CardHeader>
        <span className="font-bold">Top Customers</span>
        <CardDescription>
          Top customers that generated high revenue
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <p className="text-sm text-muted-foreground">Loading...</p>
        )}
        {error && (
          <p className="text-sm text-red-500">Failed to load products.</p>
        )}
        <div className="space-y-4">
          {customers.map((customer, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                  {index + 1}
                </span>
                <span className="font-medium ">{customer.customer__name}</span>
              </div>
              <span className="text-xs text-muted-foreground ">
                Orders: {customer.total_orders}
              </span>
              <span className="text-sm font-semibold   ">
                Rs.{customer.total_spent.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
