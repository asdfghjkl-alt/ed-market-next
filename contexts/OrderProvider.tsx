"use client";

import { useEffect, useState, type ReactNode } from "react";
import { OrderContext } from "./OrderContext";
import type { ICartItemFrontend } from "@/database/order.model";
import type { IProduct } from "@/database/product.model";

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<ICartItemFrontend[]>([]);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, []);

  useEffect(() => {
    // Immediately updates local storage cart to the cart in context
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  /**
   * Function to add an item to the cart
   * @param product The product to be added to the cart
   */
  const addItem = (product: IProduct) => {
    // Checks if item is already in cart
    if (cart.some((item) => item.product._id === product._id)) {
      // Updates the product cart to add 1 quantity
      setCart((prevCart) =>
        prevCart.map((item) => {
          if (item.product._id === product._id) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        }),
      );
    } else {
      // Initialises product to be in the cart
      setCart((prevCart) => [...prevCart, { product, quantity: 1 }]);
    }
  };

  /**
   * Function to decrement quantity an item from the cart
   * @param product Product to have decrement quantity
   */
  const removeOneItem = (product: IProduct) => {
    // Attempts to find item in cart
    const foundItem = cart.find((item) => item.product._id === product._id);
    if (!foundItem) {
      return;
    }

    if (foundItem.quantity <= 1) {
      // Removes the item from the cart
      removeAllItem(product);
    } else {
      // Reduces quantity by 1
      setCart((prevCart) =>
        prevCart.map((item) => {
          if (item.product._id === product._id) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        }),
      );
    }
  };

  /**
   * Function to remove an item from the cart
   * @param product Product to be removed from the cart
   */
  const removeAllItem = (product: IProduct) => {
    // Removes the item from the cart
    setCart((prevCart) =>
      prevCart.filter((item) => item.product._id !== product._id),
    );
  };

  const resetCart = () => {
    setCart([]);
  };

  return (
    <OrderContext.Provider
      value={{ cart, addItem, removeOneItem, removeAllItem, resetCart }}
    >
      {children}
    </OrderContext.Provider>
  );
};
