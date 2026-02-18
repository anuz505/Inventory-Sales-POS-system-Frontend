export interface ProductQueryParams {
  name?: string;
  sku?: string;
  description?: string;
  category?: string;
  supplier?: string;
  min_selling_price?: number;
  max_selling_price?: number;
  min_cost_price?: number;
  max_cost_price?: number;
  min_stock?: number;
  max_stock?: number;
  low_stock?: boolean;
  created_after?: string;
  created_before?: string;
  ordering?: string;
  limit?: string;
  offset?: string;
}

export interface ProductListResponse {
  count: number;
  next: string;
  previous: string;
  results: ProductType[];
}
export interface ProductType {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  category_name: string;
  supplier: string;
  supplier_name: string;
  cost_price: string;
  selling_price: string;
  stock_quantity: number;
  low_stock_limit: number;
  created_at: string;
  updated_at: string;
}
