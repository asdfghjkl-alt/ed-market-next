import connectToDatabase from "@/lib/mongodb";
import Product, { PassedProductData } from "@/database/product.model";
import User from "@/database/user.model";
import { notFound } from "next/navigation";
import ProductForm from "@/components/products/ProductForm";
import Category, { ICategory } from "@/database/category.model";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function EditProduct({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let passedCategories: string[];
  let serializedProduct: PassedProductData;

  await connectToDatabase();
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "seller") {
      return notFound();
    }

    const product = await Product.findById(id)
      .populate({
        path: "seller",
        model: User,
        select: "email",
      })
      .populate({
        path: "category",
        model: Category,
      });

    if (!product) {
      return notFound();
    }

    if (!product.seller._id.equals(session.user.id)) {
      return notFound();
    }

    serializedProduct = {
      _id: product._id.toString(),
      name: product.name,
      quantity: product.quantity,
      unit: product.unit,
      price: product.price,
      category: product.category.name,
      description: product.description,
      images: JSON.parse(JSON.stringify(product.images)),
    };

    const categories = await Category.find();
    passedCategories = categories.map((category: ICategory) => category.name);
  } catch (error) {
    console.error(error);
    return notFound();
  }

  return (
    <ProductForm product={serializedProduct} categories={passedCategories} />
  );
}
