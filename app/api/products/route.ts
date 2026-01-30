import Category from "@/database/category.model";
import Product from "@/database/product.model";
import connectToDatabase from "@/lib/mongodb";
import User from "@/database/user.model";
import { NextRequest, NextResponse } from "next/server";

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
