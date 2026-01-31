import QuantityControl from "@/components/products/QuantityControl";
import Carousel from "@/components/ui/Carousel";
import { notFound } from "next/navigation";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/database/product.model";
import User from "@/database/user.model";

const unitsToDisplay: Record<string, number> = {
  g: 100,
  kg: 1,
  ml: 100,
  L: 1,
  each: 1,
};

export default async function ProductDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await connectToDatabase();
  try {
    let product = await Product.findById(id).populate({
      path: "seller",
      model: User,
      select: "email name",
    });

    if (!product) {
      return notFound();
    }

    product = JSON.parse(JSON.stringify(product));

    const displayUnit =
      product?.unit !== "each" ? product?.unit : ` ${product?.unit}`;

    return (
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2">
        <div className="row-span-2 flex flex-col p-3">
          <Carousel images={product.images} />
        </div>
        <div className="p-3">
          <h2 className="my-4">
            {product.name} | {product.quantity}
            {displayUnit}
          </h2>
          <h3 className="mb-4">${product.price.toFixed(2)}</h3>
          <p className="mb-4 text-sm text-gray-400">
            $
            {(
              (product.price / product.quantity) *
              unitsToDisplay[product.unit]
            ).toFixed(2)}{" "}
            / {unitsToDisplay[product.unit]}
            {displayUnit}
          </p>
          <QuantityControl
            className="sm:w-72 md:w-80 lg:w-96"
            product={product}
          />
          <div className="mr-20">
            <h2 className="mt-10 mb-4">Product Details</h2>
            <p className="whitespace-pre-line">{product.description}</p>
          </div>
          <div className="mr-20">
            <h2 className="mt-10 mb-4">Seller Details</h2>
            <p>Username: {product.seller.name}</p>
            <p>Email: {product.seller.email}</p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error(error);
    return notFound();
  }
}
