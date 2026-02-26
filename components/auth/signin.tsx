"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import CommonForm from "../common/forms";
import type { LoginFormDataType } from "@/types/auth-type";
import { useLoginUserMutation } from "@/store/auth-slice/index";
import { signInFormControls } from "@/config/auth-form-controls";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import usePublicRoute from "@/hooks/PublicRoute";
const SignIn: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormDataType>({
    username: "",
    password: "",
  });
  const { loading } = usePublicRoute();

  const [loginUser, { isLoading, isSuccess, error }] = useLoginUserMutation();
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  useEffect(() => {
    if (isSuccess) {
      router.push("/");
    }
  }, [isSuccess, router]);

  useEffect(() => {
    const Error = error as any;
    if (Error?.data && typeof Error.data === "object") {
      const errors: { [key: string]: string } = {};
      for (const key in Error.data) {
        if (Array.isArray(Error.data[key])) {
          errors[key] = Error.data[key][0];
        } else if (typeof Error.data[key] === "string") {
          errors[key] = Error.data[key];
        }
      }
      setFieldErrors(errors);
      console.log("fieldErrors", errors);
      toast.error("Sign in Failed");
    }
  }, [error]);
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
      console.error("something went wrong with Sign in");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <CommonForm
        formControls={signInFormControls}
        formData={formData}
        buttonText={isLoading ? "Loading..." : "Sign in"}
        setFormData={setFormData}
        onSubmit={onSubmit}
        errors={fieldErrors}
      />
    </>
  );
};

export default SignIn;
