import { cloudinary } from "@/lib/cloudinary";
import { Schema, model, models } from "mongoose";
import Category, { ICategory } from "./category.model";
import { IUser } from "./user.model";
import { ProductUnit } from "@/types/product";

export interface IImage {
  url: string;
  filename: string;
  size: number;
  thumbnail?: string;
  main?: string;
  display?: string;
}

export interface IProduct {
  _id: string;
  name: string;
  quantity: number;
  unit: ProductUnit;
  price: number;
  images: IImage[];
  seller: IUser;
  category: ICategory;
  description: string;
}

export interface PassedProductData {
  _id: string;
  name: string;
  quantity: number;
  unit: ProductUnit;
  price: number;
  images: IImage[];
  category: string;
  description: string;
}

export interface ProductFormData {
  name: string;
  quantity: number;
  unit: ProductUnit;
  price: number;
  images: File[];
  category: string;
  description: string;
}

const imageSchema = new Schema(
  {
    _id: { _id: false },
    url: { type: String, required: true },
    filename: { type: String, required: true },
    size: { type: Number, required: true },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);
imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_300,h_300,c_pad");
});
imageSchema.virtual("main").get(function () {
  return this.url.replace("/upload", "/upload/w_1200,h_1200,c_pad");
});
imageSchema.virtual("display").get(function () {
  return this.url.replace("/upload", "/upload/w_500,h_500,c_pad");
});

export const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  unit: {
    type: String,
    required: true,
    enum: Object.values(ProductUnit),
    default: ProductUnit.g,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  images: {
    type: [imageSchema],
    required: true,
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
    validate: {
      // Custom validation software to check that associated category is valid
      validator: async function (value: Schema.Types.ObjectId) {
        const isValid = await Category.exists({ _id: value });
        if (isValid) {
          return true;
        }
        return false;
      },
      message: "Category id does not exist",
    },
  },
  description: {
    type: String,
    required: true,
  },
});

// Post middleware to delete images from Cloudinary when a product is deleted
ProductSchema.post("findOneAndDelete", async function (product) {
  for (const { filename } of product.images) {
    await cloudinary.uploader.destroy(filename);
  }
});

// Avoid recompilation in hot-reload
const Product = models.Product || model<IProduct>("Product", ProductSchema);

export default Product;
