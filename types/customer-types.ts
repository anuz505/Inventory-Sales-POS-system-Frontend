export interface Customer {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedCustomerResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Customer[];
}

export interface CustomerParamsTypes {
  name?: string;
  address?: string;
  email?: string;
  phone_number?: string;
  created_after?: string;
  created_before?: string;
  limit?: string;
  offset?: string;
}
