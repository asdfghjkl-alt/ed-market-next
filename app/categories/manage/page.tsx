import AddCategoryForm from "@/components/categories/AddCategoryForm";
import CategoryManageView from "@/components/categories/CategoryManageView";
import Category, { ICategory } from "@/database/category.model";
import { auth } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

export default async function ManageCategories() {
  await connectToDatabase();
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    return notFound();
  }

  let categories = await Category.find();
  categories = JSON.parse(JSON.stringify(categories));

  return (
    <>
      <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
        <AddCategoryForm />
        <h2 className="ml-2">Manage Categories</h2>
      </div>
      <div className="flex flex-col gap-4 p-4">
        <div className="hidden rounded-md bg-gray-100 p-4 font-bold text-gray-700 md:grid md:grid-cols-4 md:gap-4 md:text-center">
          <div className="col-span-2">Name</div>
          <div className="col-span-2">Actions</div>
        </div>

        <div className="flex flex-col gap-4">
          {categories.map((category: ICategory) => (
            <CategoryManageView key={category._id} category={category} />
          ))}
        </div>
      </div>
    </>
  );
}
