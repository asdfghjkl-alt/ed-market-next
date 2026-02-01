import { Schema, Types, model, models } from "mongoose";
import { IProduct, ProductSchema } from "@/database/product.model";
import User, { IUser } from "@/database/user.model";

export interface IOrder {
  _id: string;
  cart: {
    product: IProduct;
    quantity: number;
  }[];
  date: Date;
  user: string | IUser;
  completionDate?: Date;
  completed: boolean;
}

export interface ICartItem {
  product: string;
  quantity: number;
}

export interface ICartItemFrontend {
  product: IProduct;
  quantity: number;
}

const orderSchema = new Schema({
  cart: [
    {
      _id: { _id: false },
      product: {
        type: ProductSchema,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, min: 1, required: true },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  user: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
    validate: {
      // Custom validation software to check that associated user is valid
      validator: async function (value: Types.ObjectId) {
        const isValid = await User.exists({ _id: value });
        if (isValid) {
          return true;
        }
        return false;
      },
      message: "User id does not exist",
    },
  },
  completionDate: {
    type: Date,
  },
  completed: {
    type: Boolean,
    required: true,
  },
});

// Avoid recompilation in hot-reload
const Order = models.Order || model<IOrder>("Order", orderSchema);

export default Order;
