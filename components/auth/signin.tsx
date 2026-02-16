"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import CommonForm from "../common/forms";
import type { LoginFormDataType } from "@/types/auth-type";
import { useLoginUserMutation } from "@/store/auth-slice/index";
import { signInFormControls } from "@/config/form-controls";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const SignIn: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormDataType>({
    username: "",
    password: "",
  });

  const [loginUser, { isLoading, isSuccess, isError, error }] =
    useLoginUserMutation();
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  useEffect(() => {
    if (isSuccess) {
      router.push("/");
    }
  }, [isSuccess, router]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await loginUser(formData).unwrap();
      setFormData({
        username: "",
        password: "",
      });
      toast.success("Sign in Successful");
    } catch (error: any) {
      if (error?.data && typeof error.data === "object") {
        const errors: { [key: string]: string } = {};

        for (const key in error.data) {
          if (Array.isArray(error.data[key])) {
            // Take the first error message for each field
            errors[key] = error.data[key][0];
          } else if (typeof error.data[key] === "string") {
            errors[key] = error.data[key];
          }
        }

        setFieldErrors(errors);
      }
      toast.error("Sign in Failed");
    }
  };
  return (
    <>
      <CommonForm
        formControls={signInFormControls}
        formData={formData}
        buttonText={isLoading ? "Loading..." : "Sign in"}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </>
  );
};

export default SignIn;
