"use client";

import { useState } from "react";
import api from "@/lib/axios";
import ProductCartView from "@/components/products/ProductCartView";
import { useOrder } from "@/contexts/OrderContext";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Cart() {
  const { cart } = useOrder();
  const { resetCart } = useOrder();

  const [isSubmittingCart, setIsSubmittingCart] = useState(false);

  const router = useRouter();

  const submitOrder = async () => {
    setIsSubmittingCart(true);

    try {
      // Only sends product ids with the cart
      const cartToSend = cart.map(({ product, quantity }) => {
        return { product: product._id, quantity };
      });

      const res = await api.post("/orders", { cart: cartToSend });
      resetCart();
      toast.success(res.data.message);
      router.push("/orders");
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(e.response?.data.message || e.message);
      } else {
        toast.error("Unexpected error occurred");
      }
    } finally {
      setIsSubmittingCart(false);
    }
  };

  return (
    <div className="m-6 text-center">
      <h1 className="m-5">Cart</h1>
      <div className="flex flex-col gap-4">
        <div className="hidden rounded-md bg-gray-100 p-4 font-bold text-gray-700 md:grid md:grid-cols-12 md:gap-4 md:text-center">
          <div className="col-span-3">Image</div>
          <div className="col-span-3">Name</div>
          <div className="col-span-2">Stock</div>
          <div className="col-span-2">Price</div>
          <div className="col-span-2">Units Purchased</div>
        </div>
        <div className="flex flex-col gap-4">
          {cart.map((cartItem) => (
            <ProductCartView
              key={cartItem.product._id}
              product={cartItem.product}
            />
          ))}
        </div>
      </div>
      {cart.length === 0 ? (
        <div className="my-5 rounded-xl border-2 border-solid border-gray-500 p-5">
          <h2>Cart is empty!</h2>
          <p>Please order at least 1 item to order.</p>
        </div>
      ) : (
        <div>
          <p className="my-3">
            Total Cost: $
            {cart
              .reduce(
                (acc, item) => acc + item.quantity * item.product.price,
                0,
              )
              .toFixed(2)}
          </p>
        </div>
      )}
      <button
        disabled={cart.length === 0 || isSubmittingCart}
        onClick={submitOrder}
        className="btn btn-submit w-full"
      >
        {isSubmittingCart ? "Processing order..." : "Proceed to Order"}
      </button>
    </div>
  );
}
