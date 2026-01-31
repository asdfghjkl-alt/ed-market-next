"use client";

import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useState } from "react";
import { AxiosError } from "axios";
import InputField from "@/components/ui/inputs/InputField";
import api from "@/lib/axios";
import { CategoryFormData, ICategory } from "@/database/category.model";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const categorySchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Please enter a name",
  }),
});

export default function EditCategoryForm({
  category,
}: {
  category: ICategory;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: joiResolver(categorySchema),
    mode: "onTouched",
    defaultValues: {
      name: category.name,
    },
  });

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(data: CategoryFormData) {
    try {
      setIsSubmitting(true);
      const res = await api.put(`/categories/${category._id}`, data);
      toast.success(res.data.message);
      router.push("/categories/manage");
    } catch (e) {
      setIsSubmitting(false);
      if (e instanceof AxiosError) {
        toast.error(e.response?.data.message);
      } else {
        toast.error("Unexpected error occurred");
      }
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm transition-shadow duration-300 hover:shadow-md">
        <h3>Edit a category</h3>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <InputField
            name="name"
            label="Category Name"
            placeholder="Name"
            register={register}
            error={errors.name}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-edit w-full"
          >
            {isSubmitting ? "Editing..." : "Edit Category"}
          </button>
        </form>
      </div>
    </div>
  );
}
