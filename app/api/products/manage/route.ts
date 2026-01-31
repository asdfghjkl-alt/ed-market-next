import Product from "@/database/product.model";
import { apiHandler } from "@/lib/api-handler";
import { auth } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = apiHandler(async function (req: NextRequest) {
  await connectToDatabase();
  const session = await auth.api.getSession({ headers: await headers() });

  if (
    !session ||
    (session.user.role !== "seller" && session.user.role !== "admin")
  ) {
    return NextResponse.json(
      { message: "Page does not exist" },
      { status: 404 },
    );
  }

  if (session.user.role === "admin") {
    const products = await Product.find();
    return NextResponse.json({
      message: "Successfully retrieved products",
      products,
    });
  }

  const products = await Product.find({ seller: session.user.id });
  return NextResponse.json({
    message: "Successfully retrieved products",
    products,
  });
});
