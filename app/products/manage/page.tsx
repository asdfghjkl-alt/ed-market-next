import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import connectToDatabase from "@/lib/mongodb";
import { notFound } from "next/navigation";
import Product, { IProduct } from "@/database/product.model";
import Link from "next/link";
import { ProductManageView } from "@/components/products/ProductManageView";
import Category from "@/database/category.model";

export default async function ManageProducts() {
  await connectToDatabase();
  const session = await auth.api.getSession({ headers: await headers() });

  if (
    !session ||
    (session.user.role !== "seller" && session.user.role !== "admin")
  ) {
    return notFound();
  }

  let products;

  if (session.user.role === "admin") {
    products = await Product.find().populate({
      path: "category",
      model: Category,
    });
  } else {
    products = await Product.find({ seller: session.user.id });
  }

  return (
    <div className="m-6">
      <div className="mb-4 grid grid-cols-2 items-center justify-between">
        <h2 className="w-full text-center">Manage Products</h2>
        <div className="flex flex-col items-center justify-center gap-2">
          {session.user.role === "admin" && (
            <Link
              href="/categories/manage"
              className="btn btn-manage w-full text-center"
            >
              Manage Product Categories
            </Link>
          )}
          {session.user.role === "seller" && (
            <Link
              href="/products/add"
              className="btn btn-submit w-full text-center"
            >
              Add New Product
            </Link>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="hidden rounded-md bg-gray-100 p-4 font-bold text-gray-700 md:grid md:grid-cols-12 md:gap-4 md:text-center">
          <div className="col-span-2">Image</div>
          <div className="col-span-2">Name</div>
          <div className="col-span-2">Quantity</div>
          <div className="col-span-1">Price</div>
          <div className="col-span-1">Category</div>
          <div className="col-span-2">Description</div>
          <div className="col-span-2">Actions</div>
        </div>

        {products.map((product: IProduct) => (
          <ProductManageView
            key={product._id}
            product={product}
            role={session.user.role as "seller" | "admin"}
          />
        ))}
      </div>
    </div>
  );
}
