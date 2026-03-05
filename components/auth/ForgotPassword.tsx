"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import CommonForm from "../common/forms";
import type {
  ForgotPasswordFormDataType,
  ResetPasswordFormDataType,
} from "@/types/auth-type";
import {
  forgotPasswordFormControls,
  resetPasswordFormControls,
} from "@/config/auth-form-controls";
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "@/store/auth-slice/index";

const ForgotPassword: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");

  // Step 1 state
  const [forgotFormData, setForgotFormData] =
    useState<ForgotPasswordFormDataType>({ email: "" });
  const [forgotErrors, setForgotErrors] = useState<{ [key: string]: string }>(
    {},
  );

  // Step 2 state
  const [resetFormData, setResetFormData] = useState<ResetPasswordFormDataType>(
    { otp: "", new_password: "" },
  );
  const [resetErrors, setResetErrors] = useState<{ [key: string]: string }>({});

  const [forgotPassword, { isLoading: isForgotLoading, error: forgotError }] =
    useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResetLoading, error: resetError }] =
    useResetPasswordMutation();

  // Parse errors for step 1
  useEffect(() => {
    const err = forgotError as any;
    if (err?.data && typeof err.data === "object") {
      const errors: { [key: string]: string } = {};
      for (const key in err.data) {
        if (Array.isArray(err.data[key])) {
          errors[key] = err.data[key][0];
        } else if (typeof err.data[key] === "string") {
          errors[key] = err.data[key];
        }
      }
      setForgotErrors(errors);
      toast.error("Failed to send OTP");
    }
  }, [forgotError]);

  // Parse errors for step 2
  useEffect(() => {
    const err = resetError as any;
    if (err?.data && typeof err.data === "object") {
      const errors: { [key: string]: string } = {};
      for (const key in err.data) {
        if (Array.isArray(err.data[key])) {
          errors[key] = err.data[key][0];
        } else if (typeof err.data[key] === "string") {
          errors[key] = err.data[key];
        }
      }
      setResetErrors(errors);
      toast.error("Password reset failed");
    }
  }, [resetError]);

  const handleForgotSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setForgotErrors({});
    try {
      await forgotPassword(forgotFormData).unwrap();
      toast.success("OTP sent to your email");
      router.push(
        `/forgot-password?email=${encodeURIComponent(forgotFormData.email)}`,
      );
    } catch {
      // errors handled via useEffect above
    }
  };

  const handleResetSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResetErrors({});
    try {
      await resetPassword({
        ...resetFormData,
        email: emailParam as string,
      }).unwrap();
      toast.success("Password reset successfully");
      router.push("/sign-in");
    } catch {
      // errors handled via useEffect above
    }
  };

  // Step 2: OTP + new password
  if (emailParam) {
    return (
      <CommonForm
        formControls={resetPasswordFormControls}
        formData={resetFormData}
        buttonText={isResetLoading ? "Resetting..." : "Reset Password"}
        setFormData={setResetFormData}
        onSubmit={handleResetSubmit}
        errors={resetErrors}
      />
    );
  }

  // Step 1: Email input
  return (
    <CommonForm
      formControls={forgotPasswordFormControls}
      formData={forgotFormData}
      buttonText={isForgotLoading ? "Sending..." : "Send OTP"}
      setFormData={setForgotFormData}
      onSubmit={handleForgotSubmit}
      errors={forgotErrors}
    />
  );
};

export default ForgotPassword;
