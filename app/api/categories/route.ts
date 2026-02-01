import Category from "@/database/category.model";
import User from "@/database/user.model";
import { apiHandler } from "@/lib/api-handler";
import { auth } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import { IRole } from "@/types/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = apiHandler(async (req: NextRequest) => {
  await connectToDatabase();
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return NextResponse.json({ message: "Page not found" }, { status: 404 });
  }

  const foundUser = await User.findById(session.user.id);

  if (!foundUser || foundUser.role !== IRole.admin) {
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
