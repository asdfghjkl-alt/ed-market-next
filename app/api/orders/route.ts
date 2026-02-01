import Order, { ICartItem } from "@/database/order.model";
import Product, { IProduct } from "@/database/product.model";
import { apiHandler } from "@/lib/api-handler";
import connectToDatabase from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { filterCart } from "./helpers";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import User from "@/database/user.model";

export const POST = apiHandler(async (req: NextRequest) => {
  await connectToDatabase();
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return NextResponse.json(
      { message: "Must be logged in to order" },
      { status: 401 },
    );
  }

  const foundUser = await User.findById(session.user.id);

  if (!foundUser) {
    return NextResponse.json(
      { message: "Must be logged in to order" },
      { status: 401 },
    );
  }

  const { cart } = await req.json();

  // Filters out items not recorded in the database
  const filteredCart = await filterCart(cart);

  if (filteredCart.length < 0) {
    return NextResponse.json(
      { message: "Must have at least 1 valid item in the cart" },
      { status: 400 },
    );
  }

  // Maps cart item ids to the actual product objects
  const sentCart = await Promise.all(
    filteredCart.map(async (item: ICartItem) => {
      const product = await Product.findById(item.product);
      return { product, quantity: item.quantity };
    }),
  );

  const order = await Order.create({
    user: foundUser._id,
    cart: sentCart,
    completed: false,
  });

  return NextResponse.json({
    message: "Order placed successfully",
    order,
  });
});
