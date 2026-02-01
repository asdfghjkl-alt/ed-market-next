"use client";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Link from "next/link";
import Joi from "joi";
import type { RegisterFormData } from "@/types/auth";
import { useState } from "react";
import InputField from "@/components/ui/inputs/InputField";
import { redirect, useRouter } from "next/navigation";
import { signUp, useSession } from "@/lib/auth-client";
import { useEffect } from "react";
import toast from "react-hot-toast";

const registerSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({ "string.empty": "Username cannot be blank." }),
  password: Joi.string().required().messages({
    "string.empty": "Password cannot be blank",
  }),
  email: Joi.string().required().email().messages({
    "string.empty": "Email cannot be blank",
    "string.email": "Please enter in a valid email address",
  }),
});

export default function Register() {
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
  } = useForm<RegisterFormData>({
    resolver: joiResolver(registerSchema),
    mode: "onTouched",
    defaultValues: { name: "", password: "", email: "" },
  });
  const [isRegistering, setIsRegistering] = useState(false);

  async function onSubmit(data: RegisterFormData) {
    setIsRegistering(true);

    const { error } = await signUp.email(data);

    if (error) {
      toast.error(error.message || "Something went wrong");
      setIsRegistering(false);
      reset();
    } else {
      redirect("/");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12">
      <p className="my-8 text-5xl font-bold">EdMarket</p>
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm transition-shadow duration-300 hover:shadow-md">
        <h2>Register an account for EdMarket</h2>
        <p>
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-blue-600 decoration-blue-500 decoration-solid hover:text-blue-400 hover:underline"
          >
            Login
          </Link>
        </p>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <InputField
            name="email"
            placeholder="Email"
            label="Email"
            register={register}
            error={errors.email}
          />
          <InputField
            name="name"
            placeholder="Name"
            label="Name"
            register={register}
            error={errors.name}
          />
          <hr className="m-1 text-red-100" />
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
            disabled={isRegistering}
            className="btn btn-submit w-full"
          >
            {isRegistering ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
