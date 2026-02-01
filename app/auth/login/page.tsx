"use client";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Link from "next/link";
import Joi from "joi";
import type { LoginFormData } from "@/types/auth";
import { useState } from "react";
import InputField from "@/components/ui/inputs/InputField";
import { redirect, useRouter } from "next/navigation";
import { signIn, useSession } from "@/lib/auth-client";
import { useEffect } from "react";
import toast from "react-hot-toast";

const loginSchema = Joi.object({
  email: Joi.string().required().email().messages({
    "string.empty": "Email cannot be blank",
    "string.email": "Please enter in a valid email address",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password cannot be blank",
  }),
});

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace("/");
    }
  }, [session, router]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: joiResolver(loginSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  });

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  async function onSubmit(data: LoginFormData) {
    setIsLoggingIn(true);

    const { data: retrieved, error } = await signIn.email(data);
    if (error) {
      toast.error(error.message || "Something went wrong");
      setIsLoggingIn(false);
      reset();
    } else {
      redirect("/");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12">
      <h1 className="my-8 text-5xl">EdMarket</h1>
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm transition-shadow duration-300 hover:shadow-md">
        <h3>Login to EdMarket</h3>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <InputField
            name="email"
            placeholder="Email"
            label="Email"
            register={register}
            error={errors.email}
          />
          <InputField
            name="password"
            placeholder="Password"
            type="password"
            label="Password"
            register={register}
            error={errors.password}
          />
          <button
            type="submit"
            disabled={isLoggingIn}
            className="btn btn-submit w-full"
          >
            {isLoggingIn ? "Logging in..." : "Login"}
          </button>
          <p className="mt-2">
            Do not have an EdMarket Account?{" "}
            <Link
              href="/auth/register"
              className="text-blue-600 decoration-blue-500 decoration-solid hover:text-blue-400 hover:underline"
            >
              Create an EdMarket Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
