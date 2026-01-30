import Category from "@/database/category.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const categories = await Category.find();
  return NextResponse.json({
    message: "Successfully retrieved categories",
    categories,
  });
}
