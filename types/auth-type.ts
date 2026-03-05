// export const initialState: AuthState = {
//   isAuthenticated: false,
//   isLoading: true,
//   user: null,
//   token: null,
//   error: null,
// };
// export interface AuthState {
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   user: User | null;
//   token: string | null;
//   error: string | null;
// }
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
export interface AuthCheckResponse {
  authenticated: boolean;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
    is_superuser: boolean;
    date_joined: string;
  };
}

export interface ForgotPasswordFormDataType {
  email: string;
}

export interface ResetPasswordFormDataType {
  otp: string;
  new_password: string;
}
