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
      // toast.error("Registration Failed");
      // console.error("Something went wrong");
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
