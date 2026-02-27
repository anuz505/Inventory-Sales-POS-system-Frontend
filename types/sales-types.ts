import { SalesItemType } from "./sales-item-type";

export interface Sale {
  id: string;
  items: SalesItemType[];
  customer_name: string;
  staff_name: string;
  invoice_number: string;

  subtotal: string;
  discount_amount: string;
  total_amount: string;

  payment_method: "upi" | "card" | "cash" | "wallet" | "net_banking";
  payment_status: "pending" | "completed" | "refunded";

  notes: string;
  created_at: string;
  updated_at: string;

  customer: string;
  user: number;
}

export interface NewSaleType {
  items: {
    product: string;
    quantity: number;
  }[];
  discount_amount: number;
  payment_method: "upi" | "card" | "cash" | "wallet" | "net_banking";
  payment_status: "pending" | "completed" | "refunded";

  notes: string;
  customer: string;
}

export interface PaginatedSalesResponse {
  count: number;
  next: string;
  previous: string;
  results: Sale[];
}

export interface SalesParamsTypes {
  invoice_numver?: string;
  created_after?: string;
  created_before?: string;
  min_discount?: number;
  max_discount?: number;
  min_total?: number;
  max_total?: number;
  product?: string;
  limit?: string;
  offset?: string;
}
