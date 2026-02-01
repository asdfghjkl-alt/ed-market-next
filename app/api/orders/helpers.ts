import { ICartItem } from "@/database/order.model";
import Product, { IProduct } from "@/database/product.model";

export async function filterCart(cart: ICartItem[]) {
  const cartProductIds = cart.map((item: ICartItem) => item.product);

  // Finds all valid products that are in the cart
  const validProducts = await Product.find({
    _id: { $in: cartProductIds },
  }).select("_id");

  const validIdSet = new Set(
    validProducts.map((p: IProduct) => p._id.toString()),
  );

  // Filters out items not recorded in the database
  const filteredCart = cart.filter((item: ICartItem) =>
    validIdSet.has(item.product),
  );

  return filteredCart;
}
