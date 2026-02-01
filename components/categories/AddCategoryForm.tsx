"use client";

import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useState } from "react";
import type { CategoryFormData } from "@/database/category.model";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

const categorySchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Please enter a name",
  }),
});

export default function AddCategoryForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: joiResolver(categorySchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  /**
   * Function to submit the new category
   * @param data category data
   */
  async function onSubmit(data: CategoryFormData) {
    setIsSubmitting(true);
    try {
      // Attempts to add new category
      const response = await api.post("/categories", data);
      toast.success(response.data.message);
      reset();
      router.refresh();
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(e.response?.data.message || e.message);
      } else {
        toast.error("Unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex gap-4 p-4"
    >
      <div>
        <div className="text-left">
          <label className="font-medium" htmlFor="name">
            Category Name
          </label>
          <div className="flex gap-4">
            <input id="name" placeholder="Name" {...register("name")} />
            <button
              type="submit"
              className="btn btn-submit h-12 w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Category"}
            </button>
          </div>
        </div>
        <div className="text-red-500">
          {errors.name && <span>{errors.name.message}</span>}
        </div>
      </div>
    </form>
  );
}
