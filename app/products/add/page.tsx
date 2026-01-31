import Category, { ICategory } from "@/database/category.model";
import connectToDatabase from "@/lib/mongodb";
import ProductForm from "@/components/products/ProductForm";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function AddProducts() {
  await connectToDatabase();

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "seller") {
    return notFound();
  }

  const categories = await Category.find();
  const passedCategories = categories.map(
    (category: ICategory) => category.name,
  );

  return <ProductForm categories={passedCategories} />;
}
