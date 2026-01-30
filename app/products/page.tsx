import { IProduct } from "@/database/product.model";
import api from "@/lib/axios";
import ProductCard from "@/components/products/ProductCard";

export default async function ProductsView({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const currentSearchParams = await searchParams;

  const { data } = await api.get("/products", {
    params: { category: currentSearchParams?.category },
  });
  const products = data.products;
  const category = currentSearchParams?.category;

  return products.length === 0 ? (
    <div className="flex h-screen items-center justify-center">
      <p className="text-center text-xl font-bold">No products found</p>
    </div>
  ) : (
    <div className="m-6 text-center">
      <h1>{category || "All"} Products</h1>
      <div className="grid grid-cols-1 gap-2 p-4 md:grid-cols-3 lg:grid-cols-5">
        {products.map((product: IProduct) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
