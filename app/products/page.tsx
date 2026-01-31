import Product, { IProduct } from "@/database/product.model";
import ProductCard from "@/components/products/ProductCard";
import connectToDatabase from "@/lib/mongodb";
import Category from "@/database/category.model";
import User from "@/database/user.model";

export default async function ProductsView({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await connectToDatabase();

  const categoryName = (await searchParams).category;
  let filter = {};

  // Modifies filter based on if the user has inputted a category search
  if (categoryName) {
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return (
        <div className="flex h-screen items-center justify-center">
          <p className="text-center text-xl font-bold">No products found</p>
        </div>
      );
    }
    filter = { category: category._id };
  }

  // Retrieves all products with filtering
  const products = await Product.find(filter)
    .populate({ path: "category", model: Category })
    .populate({ path: "seller", select: "email", model: User });

  return products.length === 0 ? (
    <div className="flex h-screen items-center justify-center">
      <p className="text-center text-xl font-bold">No products found</p>
    </div>
  ) : (
    <div className="m-6 text-center">
      <h1>{categoryName || "All"} Products</h1>
      <div className="grid grid-cols-1 gap-2 p-4 md:grid-cols-3 lg:grid-cols-5">
        {products.map((product: IProduct) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
