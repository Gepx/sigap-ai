import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://pijak-sigap-ai.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account/", "/app/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
