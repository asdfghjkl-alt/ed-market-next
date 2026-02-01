import { IProduct } from "@/database/product.model";
import Link from "next/link";
import QuantityControl from "./QuantityControl";
import Image from "next/image";

const unitsToDisplay: Record<string, number> = {
  g: 100,
  kg: 1,
  ml: 100,
  L: 1,
  each: 1,
};

export default function ProductCard({ product }: { product: IProduct }) {
  const displayUnit =
    product.unit !== "each" ? product.unit : ` ${product.unit}`;

  return (
    <div className="m-2 h-full rounded-xl border border-solid border-gray-300 text-left shadow-sm transition-shadow hover:shadow-lg">
      <div className="flex h-full flex-col gap-20 p-3">
        <Link href={`/products/${product._id}`}>
          <Image
            className="object-contain object-center"
            src={product.images[0].thumbnail as string}
            alt={product.name}
            width={256}
            height={256}
          />
          <p className="font-semibold">
            {product.name} | {product.quantity}
            {displayUnit}
          </p>
          <h3 className="text-xl font-bold">${product.price.toFixed(2)}</h3>
          <p className="text-sm">
            $
            {(
              (product.price / product.quantity) *
              unitsToDisplay[product.unit]
            ).toFixed(2)}{" "}
            / {unitsToDisplay[product.unit]}
            {displayUnit}
          </p>
        </Link>
        <QuantityControl product={product} />
      </div>
    </div>
  );
}
