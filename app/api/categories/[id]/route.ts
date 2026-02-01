import Category from "@/database/category.model";
import Product from "@/database/product.model";
import User from "@/database/user.model";
import { apiHandler } from "@/lib/api-handler";
import { auth } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import { IRole } from "@/types/auth";
import { headers } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

export const DELETE = apiHandler(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await connectToDatabase();
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return NextResponse.json({ message: "Page not found" }, { status: 404 });
    }

    const foundUser = await User.findById(session.user.id);

    if (!foundUser || foundUser.role !== IRole.admin) {
      return NextResponse.json({ message: "Page not found" }, { status: 404 });
    }

    const { id } = await params;
    const productInCat = await Product.find({ category: id });

    if (productInCat.length > 0) {
      return NextResponse.json(
        {
          message: "Category has products, you cannot delete the category",
        },
        { status: 400 },
      );
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Successfully deleted category",
      category,
    });
  },
);

export const PUT = apiHandler(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await connectToDatabase();
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return NextResponse.json({ message: "Page not found" }, { status: 404 });
    }

    const foundUser = await User.findById(session.user.id);

    if (!foundUser || foundUser.role !== IRole.admin) {
      return NextResponse.json({ message: "Page not found" }, { status: 404 });
    }

    const { id } = await params;
    const { name } = await req.json();
    const category = await Category.findByIdAndUpdate(id, { name });

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Successfully updated category",
      category,
    });
  },
);
