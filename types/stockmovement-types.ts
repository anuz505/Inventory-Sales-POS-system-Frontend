export type MovementType = "IN" | "OUT";
export type MovementReason = "PURCHASE" | "SALE" | "RETURN" | "ADJUSTMENT" | "TRANSFER";

export interface StockMovement {
  id: string;
  product: string;
  product_name: string;
  quantity: number;
  movement_type: MovementType;
  reason: MovementReason;
  user: number;
  username: string;
  notes: string;
  created_at: string;
}

export interface PaginatedStockMovementResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: StockMovement[];
}

export interface StockMovementParamsTypes {
  product_name?: string;
  movement_type?: MovementType | "";
  reason?: MovementReason | "";
  username?: string;
  created_after?: string;
  created_before?: string;
  offset?: string;
}
