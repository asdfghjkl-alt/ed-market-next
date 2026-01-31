import Category from "@/database/category.model";
import { apiHandler } from "@/lib/api-handler";
import { auth } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import { IRole } from "@/types/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = apiHandler(async (req: NextRequest) => {
  await connectToDatabase();
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== IRole.admin) {
    return NextResponse.json({ message: "Page not found" }, { status: 404 });
  }

  const { name } = await req.json();
  const category = await Category.create({ name });
  await category.save();

  return NextResponse.json({
    message: "Category created successfully",
    category,
  });
});
