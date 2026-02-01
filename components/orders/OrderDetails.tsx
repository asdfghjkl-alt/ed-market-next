import type { IOrder } from "@/database/order.model";
import OrderItem from "./OrderItem";
import { IUser } from "@/database/user.model";
import DeliverBtn from "./DeliverBtn";

export default function OrderDetails({
  order,
  isManaging = false,
}: {
  order: IOrder;
  isManaging?: boolean;
}) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-solid border-gray-400 p-3 text-center">
      <h1 className="text-2xl font-bold">Order Details</h1>
      {order.cart.map((item) => (
        <OrderItem key={item.product._id} item={item} />
      ))}
      <p className="text-bold m-2 border-t-4 text-right text-2xl">
        Total Cost: $
        {order.cart
          .reduce((acc, item) => acc + item.product.price * item.quantity, 0)
          .toFixed(2)}
      </p>
      <p
        className={`text-right font-semibold ${order.completed ? "text-green-500" : "text-red-400"}`}
      >
        {order.completed ? (
          <>
            Delivered{" "}
            <span className="text-black">
              on{" "}
              {new Date(order.completionDate as Date).toLocaleString(
                undefined,
                {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                },
              )}
            </span>
          </>
        ) : (
          <>Undelivered</>
        )}
      </p>
      <p className="text-right">
        Ordered on{" "}
        {new Date(order.date).toLocaleString(undefined, {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        })}
      </p>
      <p className="text-right mb-2">Ordered by {(order.user as IUser).name}</p>
      {isManaging && <DeliverBtn order={order} />}
    </div>
  );
}
