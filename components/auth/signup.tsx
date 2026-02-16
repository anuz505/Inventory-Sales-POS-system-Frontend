"use client";
import React, { useEffect, useState } from "react";
import CommonForm from "../common/forms";
import { useRegisterUserMutation } from "@/store/auth-slice/try";
import { signUpFormControls } from "@/config/form-controls";
import type { RegisterFormDataType } from "@/types/auth-type";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormDataType>({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "Staff",
    phone_number: null,
  });

  const router = useRouter();
  const [registerUser, { isLoading, isSuccess, isError, error }] =
    useRegisterUserMutation();
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  useEffect(() => {
    if (isSuccess) {
      router.push("/sign-in");
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
      toast.error("Registration Failed");
    }
  }, [error]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await registerUser(formData).unwrap();
      setFormData({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        role: "Staff",
        phone_number: null,
      });
      toast.success("Registration Successful");
    } catch {
      console.log("something went wrong with registration");
    }
  };

  const isButtonDisabled =
    !formData.email ||
    !formData.first_name ||
    !formData.last_name ||
    !formData.password ||
    !formData.role ||
    !formData.username;

  return (
    <div className="rounded-lg border bg-white p-8 shadow-sm">
      <CommonForm
        formControls={signUpFormControls}
        buttonText={isLoading ? "Loading..." : "Sign Up"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isBtnDisabled={isButtonDisabled}
        errors={fieldErrors}
      />
    </div>
  );
};

export default SignUp;
