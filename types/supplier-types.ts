export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: number;
  address: string;
  created_at: string;
  updated_at: string;
}

// For POST /suppliers — omit read-only fields
export type CreateSupplierPayload = Omit<
  Supplier,
  "id" | "created_at" | "updated_at"
>;

// For PATCH /suppliers/:id — all fields optional
export type UpdateSupplierPayload = Partial<CreateSupplierPayload>;

// LimitOffsetPagination response wrapper
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type PaginatedSupplierResponse = PaginatedResponse<Supplier>;

export interface SupplierQueryParams {
  limit?: number;
  offset?: number;
  ordering?: keyof Supplier | `-${keyof Supplier}`;

  name?: string;
  email?: string;
}
