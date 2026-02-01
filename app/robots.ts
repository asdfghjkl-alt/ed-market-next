import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/products/add",
        "/products/edit/",
        "/products/manage/",
        "/categories/",
        "/cart/",
        "/orders/",
        "/users/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
