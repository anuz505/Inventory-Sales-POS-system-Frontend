// formControls.ts

import {
  RegisterFormDataType,
  LoginFormDataType,
  ForgotPasswordFormDataType,
  ResetPasswordFormDataType,
} from "@/types/auth-type";
import { FormControl } from "@/types/form-types";

// Sign In Form Controls
export const signInFormControls: FormControl<LoginFormDataType>[] = [
  {
    name: "username",
    label: "Username",
    placeholder: "Enter your username",
    componentType: "input",
    type: "text",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

// Sign Up Form Controls
export const signUpFormControls: FormControl<RegisterFormDataType>[] = [
  {
    name: "username",
    label: "Username",
    placeholder: "Enter your username",
    componentType: "input",
    type: "text",
  },
  {
    name: "first_name",
    label: "First Name",
    placeholder: "Enter your first name",
    componentType: "input",
    type: "text",
  },
  {
    name: "last_name",
    label: "Last Name",
    placeholder: "Enter your last name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
  {
    name: "phone_number",
    label: "Phone Number",
    placeholder: "Enter your phone number",
    componentType: "input",
    type: "tel",
  },
  {
    name: "role",
    label: "Role",
    placeholder: "Select a role",
    componentType: "select",
    options: [
      { id: "staff", label: "Staff" },
      { id: "admin", label: "Admin" },
      { id: "manager", label: "Manager" },
    ],
  },
];

// Forgot Password Form Controls (Step 1 - Email)
export const forgotPasswordFormControls: FormControl<ForgotPasswordFormDataType>[] =
  [
    {
      name: "email",
      label: "Email",
      placeholder: "Enter your registered email",
      componentType: "input",
      type: "email",
    },
  ];

// Reset Password Form Controls (Step 2 - OTP + New Password)
export const resetPasswordFormControls: FormControl<ResetPasswordFormDataType>[] =
  [
    {
      name: "otp",
      label: "OTP",
      placeholder: "Enter the 6-digit OTP",
      componentType: "input",
      type: "text",
    },
    {
      name: "new_password",
      label: "New Password",
      placeholder: "Enter your new password",
      componentType: "input",
      type: "password",
    },
  ];
