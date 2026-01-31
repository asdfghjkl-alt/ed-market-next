"use client";

import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import InputField from "@/components/ui/inputs/InputField";
import api from "@/lib/axios";
import TextArea from "@/components/ui/inputs/TextArea";
import type {
  PassedProductData,
  ProductFormData,
} from "@/database/product.model";
import { ProductUnit } from "@/types/product";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";

const allowedUnits = ["g", "kg", "ml", "L", "each"] as ProductUnit[];

export default function ProductForm({
  categories,
  product,
}: {
  categories: string[];
  product?: PassedProductData;
}) {
  // Joi Schema to provide custom validation software
  const productSchema = Joi.object({
    name: Joi.string().required().messages({
      "string.empty": "Please enter a name",
    }),
    price: Joi.number().multiple(0.01).required().greater(0).messages({
      "number.multiple": "Price can only have 2 decimal places",
      "number.greater": "Price must be greater than 0",
      "number.base": "Please enter a quantity",
    }),
    quantity: Joi.number().multiple(0.001).required().greater(0).messages({
      "number.multiple": "Quantity can only have 3 decimal places",
      "number.greater": "Quantity must be greater than 0",
      "number.base": "Please enter a quantity",
    }),
    category: Joi.string().required().messages({
      "string.empty": "Please enter a category",
    }),
    images: product
      ? Joi.array()
      : Joi.array().min(1).required().messages({
          "array.min": "Please upload at least one image",
        }),
    unit: Joi.string()
      .valid(...allowedUnits)
      .required()
      .messages({
        "string.empty": "Please enter a unit",
        "any.only":
          "Unit must be one of the following: " + allowedUnits.join(", "),
      }),
    description: Joi.string().required().messages({
      "string.empty": "Please enter a description",
    }),
  });

  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: joiResolver(productSchema),
    mode: "onTouched",
    defaultValues: {
      name: product?.name || "",
      price: product?.price || 0,
      quantity: product?.quantity || 0,
      unit: product?.unit || allowedUnits[0],
      images: [],
      description: product?.description || "",
    },
  });

  useEffect(() => {
    register("images");
  }, [register]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(data: ProductFormData) {
    try {
      setIsSubmitting(true);
      // Creates FormData object to send to backend (multipart/form-data)
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price.toString());
      formData.append("quantity", data.quantity.toString());
      formData.append("unit", data.unit);
      formData.append("category", data.category);

      if (images && images.length > 0) {
        // Adds all images to the form data
        for (let i = 0; i < images.length; i++) {
          formData.append("images", images[i]);
        }
      }
      formData.append("description", data.description);

      if (product) {
        const res = await api.put(`/products/${product._id}`, formData);
        toast.success(res.data.message);
      } else {
        const res = await api.post("/products", formData);
        toast.success(res.data.message);
      }
      setIsSubmitting(false);
      router.push("/products/manage");
    } catch (e) {
      setIsSubmitting(false);
      if (e instanceof AxiosError) {
        toast.error(e.response?.data.message);
      } else {
        toast.error("Unexpected error occurred");
      }
    }
  }

  const images = watch("images");

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm transition-shadow duration-300 hover:shadow-md">
        <h3>{product ? "Edit product" : "Add a product"}</h3>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <InputField
            name="name"
            label="Product Name"
            placeholder="Name"
            register={register}
            error={errors.name}
          />
          <div className="flex flex-col gap-4 sm:flex-row">
            <InputField
              name="price"
              type="number"
              label="Price"
              placeholder="Price"
              register={register}
              error={errors.price}
              className="w-full"
            />
            <InputField
              name="quantity"
              type="number"
              label="Quantity"
              className="w-full"
              placeholder="Quantity"
              register={register}
              error={errors.quantity}
            />
            <div className="w-full text-left">
              <label htmlFor="unit" className="font-medium">
                Unit
              </label>
              <select
                id="unit"
                {...register("unit")}
                className="w-full rounded-xl border-2 border-gray-400 p-4"
              >
                {allowedUnits.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
              {errors.unit && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.unit.message}
                </p>
              )}
            </div>
          </div>
          <div className="text-left">
            <label htmlFor="category" className="font-medium">
              Category
            </label>
            <select
              id="category"
              {...register("category")}
              className="w-full rounded-xl border-2 border-gray-400 p-4"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-red-500">
                {errors.category.message}
              </p>
            )}
          </div>
          <div className="mb-4 text-left">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Existing Images
            </label>
            <div className="mb-4 grid grid-cols-3 gap-4">
              {product &&
                product.images.map((img, index) => (
                  <div key={index} className="relative inline-block">
                    <Image
                      src={img.thumbnail!}
                      alt={`Existing Image ${index}`}
                      width={100}
                      height={100}
                      className="h-24 w-full rounded border border-gray-200 object-cover"
                    />
                  </div>
                ))}
            </div>
            <label
              htmlFor="images"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Upload Images
            </label>
            <input
              type="file"
              multiple={true}
              name="images"
              id="images"
              accept="image/png, image/jpeg, image/webp, image/jpg"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                if (images.length + files.length > 5) {
                  e.target.value = "";
                  return setError("images", {
                    message: "You can send up to 5 images",
                  });
                }

                setValue("images", [...images, ...files], {
                  shouldValidate: true,
                });
                e.target.value = "";
              }}
              className="w-full rounded border border-gray-300 p-2"
            />
            <div className="mt-2 grid grid-cols-3 gap-4">
              {[...images].map((image, index) => (
                <div key={index} className="relative inline-block h-24 w-24">
                  <Image
                    fill
                    src={URL.createObjectURL(image)}
                    alt={`Image ${index}`}
                    className="rounded border border-gray-200 object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = [...images];
                      newImages.splice(index, 1);
                      setValue("images", newImages);
                    }}
                    className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-center text-xs leading-none text-red-500 shadow-sm transition-colors hover:bg-red-300"
                  >
                    <Image
                      width={10}
                      height={10}
                      src="/icons/close.png"
                      alt="Close"
                    />
                  </button>
                </div>
              ))}
            </div>
            {errors.images && (
              <p className="mt-1 text-xs text-red-500">
                {errors.images.message}
              </p>
            )}
          </div>
          <TextArea
            name="description"
            label="Description"
            placeholder="Description"
            register={register}
            error={errors.description}
            rows={3}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-submit w-full"
          >
            {product
              ? isSubmitting
                ? "Updating..."
                : "Update Product"
              : isSubmitting
                ? "Adding..."
                : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
