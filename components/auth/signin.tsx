"use client";
import React from "react";
import { useState } from "react";
import CommonForm from "../common/forms";
import type { LoginFormDataType } from "@/types/auth-type";
import { useLoginUserMutation } from "@/store/auth-slice/index";
import { signInFormControls } from "@/config/form-controls";
const SignIn: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormDataType>({
    username: "",
    password: "",
  });

  const [loginUser, { isLoading, isSuccess, isError, error }] =
    useLoginUserMutation();
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await loginUser(formData).unwrap();
    } catch (error) {
      console.error("Something went wrong");
      // TODO Toast
    }
  };
  return (
    <>
      <CommonForm
        formControls={signInFormControls}
        formData={formData}
        buttonText="Sign In"
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </>
  );
};

export default SignIn;
