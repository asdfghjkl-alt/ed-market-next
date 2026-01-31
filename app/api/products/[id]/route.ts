import Product from "@/database/product.model";
import { NextRequest, NextResponse } from "next/server";
import Category from "@/database/category.model";
import User from "@/database/user.model";
import { notFound } from "next/navigation";
import connectToDatabase from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
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
      session.user.role !== "admin"
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
