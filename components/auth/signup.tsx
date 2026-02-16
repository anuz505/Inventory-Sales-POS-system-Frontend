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
  const [validationError, setValidationError] = useState<string>("");

  useEffect(() => {
    if (isSuccess) {
      router.push("/sign-in");
    }
  }, [isSuccess, router]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError("");

    if (formData.password.length < 8) {
      setValidationError("Password must be at least 8 characters long.");
      return;
    }

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
    } catch (error) {
      toast.error("Registration Failed");
      console.error("Something went wrong");
    }
  };

  const isButtonDisabled =
    !formData.email ||
    !formData.first_name ||
    !formData.last_name ||
    !formData.password ||
    !formData.role ||
    !formData.username;

  const getErrorMessages = (error: any) => {
    if (!error || !("data" in error)) return "An error occurred";
    const data = error.data;
    if (typeof data === "string") return data;

    const messages: string[] = [];
    for (const key in data) {
      if (Array.isArray(data[key])) {
        data[key].forEach((msg: string) => messages.push(`${key}: ${msg}`));
      }
    }
    // toast.error("Registration Failed");
    return messages.join(" | ");
  };

  const errorMessage = isError ? getErrorMessages(error) : "";

  return (
    <div className="rounded-lg border bg-white p-8 shadow-sm">
      {(isError || validationError) && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">
            {validationError || errorMessage}
          </p>
        </div>
      )}
      <CommonForm
        formControls={signUpFormControls}
        buttonText="Sign Up"
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isBtnDisabled={isButtonDisabled}
      />
    </div>
  );
};

export default SignUp;
