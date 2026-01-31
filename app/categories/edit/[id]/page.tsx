import connectToDatabase from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { IRole } from "@/types/auth";
import Category from "@/database/category.model";
import EditCategoryForm from "@/components/categories/EditCategoryForm";

export default async function EditCategory({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connectToDatabase();

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== IRole.admin) {
    return notFound();
  }

  const { id } = await params;
  let category = await Category.findById(id);

  if (!category) {
    return notFound();
  }
  category = JSON.parse(JSON.stringify(category));

  return <EditCategoryForm category={category} />;
}
