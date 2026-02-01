import Category from "@/database/category.model";
import Product from "@/database/product.model";
import connectToDatabase from "@/lib/mongodb";
import User from "@/database/user.model";
import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "@/lib/api-handler";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { processProductImages, validateImages } from "./helpers";
import { IRole } from "@/types/auth";

export const POST = apiHandler(async (req: NextRequest) => {
  await connectToDatabase();
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return NextResponse.json({ message: "Page not found" }, { status: 404 });
  }

  const foundUser = await User.findById(session.user.id);

  if (!foundUser || foundUser.role !== IRole.seller) {
    return NextResponse.json({ message: "Page not found" }, { status: 404 });
  }

  const formData = await req.formData();
  const productData = Object.fromEntries(formData.entries());

  const files = formData.getAll("images") as File[];

  const validateRes = validateImages(files, 0, 0);

  if (validateRes !== true) {
    return NextResponse.json({ message: validateRes.message }, { status: 400 });
  }

  const realCategory = await Category.findOne({
    name: formData.get("category"),
  });
  // Checks that category exists in the database
  if (!realCategory) {
    return NextResponse.json(
      { message: "Category does not exist" },
      { status: 404 },
    );
  }

  const images = await processProductImages(files);

  const newProduct = await Product.create({
    ...productData,
    category: realCategory._id,
    seller: session.user.id,
    images,
  });

  return NextResponse.json({
    message: "Successfully added new product",
    product: newProduct,
  });
});
