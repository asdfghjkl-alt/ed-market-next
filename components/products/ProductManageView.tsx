import { IProduct } from "@/database/product.model";
import Link from "next/link";
import { ProductDeleteBtn } from "./ProductDeleteBtn";

export const ProductManageView = ({
  product,
  role,
}: {
  product: IProduct;
  role: "seller" | "admin";
}) => {
  const displayUnit =
    product.unit !== "each" ? product.unit : ` ${product.unit}`;

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm transition-shadow hover:shadow-md md:grid md:grid-cols-12 md:items-center md:gap-4">
      <div className="flex justify-center md:col-span-2">
        <img
          className="h-24 w-24 rounded-md object-cover"
          src={product.images[0].url}
          alt={product.name}
        />
      </div>

      <div className="flex flex-col md:col-span-2">
        <span className="font-bold md:hidden">Name:</span>
        <span>{product.name}</span>
      </div>

      <div className="flex flex-col md:col-span-2">
        <span className="font-bold md:hidden">Quantity:</span>
        <span>
          {product.quantity}
          {displayUnit}
        </span>
      </div>

      <div className="flex flex-col md:col-span-1">
        <span className="font-bold md:hidden">Price:</span>
        <span>${product.price.toFixed(2)}</span>
      </div>

      <div className="flex flex-col md:col-span-1">
        <span className="font-bold md:hidden">Category:</span>
        <span>{product.category.name || "No Category"}</span>
      </div>

      <div className="flex flex-col md:col-span-2">
        <span className="font-bold md:hidden">Description:</span>
        <span className="max-w truncate md:w-full" title={product.description}>
          {product.description}
        </span>
      </div>
      <div className="mt-4 flex justify-center gap-2 md:col-span-2 md:mt-0">
        {role === "seller" && (
          <Link
            className="btn btn-edit px-4 py-2 text-sm"
            href={`/products/edit/${product._id}`}
          >
            Edit
          </Link>
        )}
        <ProductDeleteBtn productId={product._id.toString()} />
      </div>
    </div>
  );
};
