import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TotalProductsSoldCard({ quantity }: { quantity: number }) {
  return (
    <Card className="w-fit shadow-none border-muted">
      <CardContent className="flex items-center gap-2 px-4 py-1">
        <span className="text-xs sm:text-sm text-muted-foreground">
          Total Sold
        </span>
        <span className="text-sm sm:text-base font-semibold">{quantity}</span>
      </CardContent>
    </Card>
  );
}
