import Category from "@/database/category.model";
import Product from "@/database/product.model";
import connectToDatabase from "@/lib/mongodb";
import User from "@/database/user.model";
import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "@/lib/api-handler";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { processProductImages, validateImages } from "./helpers";

export async function GET(req: NextRequest) {
  await connectToDatabase();
  const categoryName = (await req.nextUrl.searchParams).get("category");
  let filter = {};

  // Modifies filter based on if the user has inputted a category search
  if (categoryName) {
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return NextResponse.json(
        {
          message: "Category does not exist",
        },
        { status: 404 },
      );
    }
    filter = { category: category._id };
  }

  // Retrieves all products with filtering
  const products = await Product.find(filter)
    .populate({ path: "category", model: Category })
    .populate({ path: "seller", select: "email", model: User });

  return NextResponse.json({
    message: "Successfully retrieved products",
    products,
  });
}

export const POST = apiHandler(async (req: NextRequest) => {
  await connectToDatabase();
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "seller") {
    return NextResponse.json(
      { message: "Page does not exist" },
      { status: 404 },
    );
  }

  const formData = await req.formData();
  const productData = Object.fromEntries(formData.entries());

  const files = formData.getAll("images") as File[];

  const validateRes = validateImages(files, 0, 0);

  if (validateRes !== true) {
    return NextResponse.json({ message: validateRes.message }, { status: 400 });
  }

  const images = await processProductImages(files);

  const newProduct = await Product.create({
    ...productData,
    seller: session.user.id,
    images,
  });

  await newProduct.save();

  return NextResponse.json({
    message: "Successfully added new product",
    product: newProduct,
  });
});
