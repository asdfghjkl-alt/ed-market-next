import Product, { IImage } from "@/database/product.model";
import { NextRequest, NextResponse } from "next/server";
import Category from "@/database/category.model";
import User from "@/database/user.model";
import { notFound } from "next/navigation";
import connectToDatabase from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { apiHandler } from "@/lib/api-handler";
import { processProductImages, validateImages } from "../helpers";
import { IRole } from "@/types/auth";

export const PUT = apiHandler(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await connectToDatabase();
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return NextResponse.json(
        { message: "Page does not exist" },
        { status: 404 },
      );
    }

    const foundUser = await User.findById(session.user.id);

    if (
      !foundUser ||
      (foundUser.role !== IRole.seller && foundUser.role !== IRole.admin)
    ) {
      return NextResponse.json({ message: "Page not found" }, { status: 404 });
    }

    const { id } = await params;
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { message: "Product with specified id does not exist" },
        { status: 404 },
      );
    }

    if (
      !product.seller.equals(session.user.id) &&
      foundUser.role !== IRole.admin
    ) {
      return NextResponse.json(
        { message: "You are not authorized to update this product" },
        { status: 401 },
      );
    }

    const formData = await req.formData();
    const productData = Object.fromEntries(formData.entries());

    const files = formData.getAll("images") as File[];

    const foundCategory = await Category.findOne({
      name: productData.category,
    });

    if (!foundCategory) {
      return NextResponse.json(
        { message: "Category does not exist" },
        { status: 404 },
      );
    }

    // Gets initial file sizes and num of files by found product
    const initNoFiles = product.images.length;
    const initFileSizes = product.images.reduce(
      (acc: number, file: IImage) => acc + file.size,
      0,
    );
    const validateRes = validateImages(files, initNoFiles, initFileSizes);

    if (validateRes !== true) {
      return NextResponse.json(
        { message: validateRes.message },
        { status: 400 },
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, {
      name: productData.name,
      quantity: productData.quantity,
      unit: productData.unit,
      price: productData.price,
      description: productData.description,
      category: foundCategory._id,
    });
    const uploadedImages = await processProductImages(files);
    updatedProduct.images.push(...uploadedImages);
    await updatedProduct.save();

    return NextResponse.json({
      message: "Successfully updated product",
      product: updatedProduct,
    });
  },
);

export const DELETE = apiHandler(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await connectToDatabase();
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return NextResponse.json(
        { message: "Page does not exist" },
        { status: 404 },
      );
    }

    const foundUser = await User.findById(session.user.id);

    if (
      !foundUser ||
      (foundUser.role !== IRole.seller && foundUser.role !== IRole.admin)
    ) {
      return NextResponse.json({ message: "Page not found" }, { status: 404 });
    }

    const { id } = await params;
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { message: "Product with specified id does not exist" },
        { status: 404 },
      );
    }

    if (
      !product.seller.equals(session.user.id) &&
      foundUser.role !== IRole.admin
    ) {
      return NextResponse.json(
        { message: "You are not authorized to delete this product" },
        { status: 401 },
      );
    }

    await Product.findByIdAndDelete(id);
    return NextResponse.json({
      message: "Successfully deleted product",
      product,
    });
  },
);
