import connectToDatabase from "@/lib/mongodb";
import Order, { IOrder } from "@/database/order.model";
import OrderDetails from "@/components/orders/OrderDetails";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import User from "@/database/user.model";

export default async function ManageOrders() {
  await connectToDatabase();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    return notFound();
  }
  let orders = await Order.find().populate({
    path: "user",
    model: User,
  });
  orders = JSON.parse(JSON.stringify(orders));

  return orders.length === 0 ? (
    <div className="flex h-screen items-center justify-center">
      <p className="text-center text-xl font-bold">No orders found</p>
    </div>
  ) : (
    <>
      <h1 className="m-5 text-center">Manage Orders</h1>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-4">
        {orders.map((order: IOrder) => (
          <OrderDetails isManaging={true} order={order} key={order._id} />
        ))}
      </div>
    </>
  );
}
