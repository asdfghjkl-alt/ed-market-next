import { MetadataRoute } from "next";
import ConnectToDatabase from "@/lib/mongodb";
import Product from "@/database/product.model";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;

  await ConnectToDatabase();

  const products = await Product.find({}).select("_id updatedAt");

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/products/${product._id}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...productUrls,
  ];
}
