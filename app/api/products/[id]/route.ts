import Product from "@/database/product.model";
import { NextRequest, NextResponse } from "next/server";
import Category from "@/database/category.model";
import User from "@/database/user.model";
import { notFound } from "next/navigation";
import connectToDatabase from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { processProductImages, validateImages } from "../helpers";
import { apiHandler } from "@/lib/api-handler";

export const GET = apiHandler(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await connectToDatabase();
    const { id } = await params;

    const product = await Product.findById(id)
      .populate({ path: "category", model: Category })
      .populate({ path: "seller", select: "email", model: User });

    if (!product) {
      return notFound();
    }

    return NextResponse.json({
      message: "Successfully retrieved product",
      product,
    });
  },
);
