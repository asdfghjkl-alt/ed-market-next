import Order from "@/database/order.model";
import { apiHandler } from "@/lib/api-handler";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const PUT = apiHandler(async function (
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ message: "Page not found" }, { status: 404 });
  }

  const { id } = await params;
  const { completed } = await request.json();

  let order;

  if (completed) {
    order = await Order.findByIdAndUpdate(id, {
      completed,
      completionDate: new Date(),
    });
  } else {
    order = await Order.findByIdAndUpdate(id, { completed });
  }

  if (!order) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({
    message: `Order marked as ${completed ? "delivered" : "undelivered"} successfully`,
    order,
  });
});
