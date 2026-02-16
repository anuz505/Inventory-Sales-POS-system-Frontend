export const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  token: null,
  error: null,
};
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
  error: string | null;
}
export interface User {
  id: number;
  email: string;
  username: string;
}
export interface RegisterFormDataType {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: "Staff" | "Admin" | "Manager";
  phone_number: number | null;
}
export interface LoginFormDataType {
  username: string;
  password: string;
}

export interface AuthResponse {
  tokens: {
    access: string;
    refresh: string;
  };
  user: User;
}

export interface ErrorResponse {
  detail: string;
}
