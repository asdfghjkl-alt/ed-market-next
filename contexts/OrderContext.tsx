"use client";

import { createContext, useContext } from "react";
import { ICartItemFrontend } from "@/database/order.model";
import { IProduct } from "@/database/product.model";

export interface OrderContextType {
  cart: ICartItemFrontend[];
  addItem: (product: IProduct) => void;
  removeOneItem: (product: IProduct) => void;
  removeAllItem: (product: IProduct) => void;
  resetCart: () => void;
}

export const OrderContext = createContext<OrderContextType | undefined>(
  undefined,
);

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
