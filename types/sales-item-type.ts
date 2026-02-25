export type SalesItemType = {
  id: string;
  quantity: number;
  unit_price: number;
  discount_amount: number;
  subtotal: number;
  created_at: string;
  sale: string;
  product: string;
};

export type SalesItemResponseType = {
  id: string;
  customer_name: string;
  staff_name: string;
  items: SalesItemType[];
  invoice_number: string;
  payment_status: string;
  user: number;
  total_amount: number;
  created_at: string;
}[];
