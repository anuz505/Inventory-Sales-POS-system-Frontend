export interface TrendStats {
  this_period_total_sales?: number;
  this_period_total_profit_amount?: number;
  this_period_total_customers?: number;
  prev_period_total_sales?: number;
  prev_period_total_profit_amount?: number;
  prev_period_total_customers?: number;
  difference: number;
  percentage_change: number;
  trend: "increasing" | "decreasing" | "stable";
}
export interface DashboardTrendsResponse {
  sales_trend: TrendStats;
  profit_trend: TrendStats;
  customer_trend: TrendStats;
}

export type Period =
  | "this_month"
  | "last_three_months"
  | "this_year"
  | "today"
  | "custom";

export interface CashSalesRevenue {
  total: number | null;
  count: number;
}
export interface PaymentMethodRevenue {
  payment_method: PaymentMethod;
  total_sales: number;
}
export type PaymentMethod = "cash" | "wallet" | "net_banking" | "upi" | "card";
export interface TopSellingProduct {
  product__name: string;
  total_quantity: number;
  total_revenue: number;
}

export interface TopCustomer {
  customer__name: string;
  total_orders: number;
  total_spent: number;
}

export interface TopCategory {
  product__category__name: string;
  total_quantity: number;
  total_revenue: number;
}

export interface SalesStats {
  total_sales: number;
  cash_sales_revenue: CashSalesRevenue;
  total_profit_amount: number;
  highest_revenue_payment_method: PaymentMethodRevenue[];
  top_selling_products: TopSellingProduct[];
  top_customers: TopCustomer[];
  top_categories: TopCategory[];
}
export type MovementType = "IN" | "OUT";
export type MovementReason =
  | "RETURN"
  | "DAMAGED"
  | "SALE"
  | "PURCHASE"
  | "MANUAL";
export interface RefundSummary {
  movement_type: MovementType;
  reason: MovementReason;
  count: number;
}

export interface LowSupplyProduct {
  name: string;
  stock_quantity: number;
  low_stock_limit: number;
}

export interface InventoryStats {
  total_refunds: RefundSummary[];
  low_supply_products: LowSupplyProduct[];
  total_customers: number;
}

export interface DashboardResponse {
  this_period: {
    sales: SalesStats;
    inventory: InventoryStats;
  };
}
