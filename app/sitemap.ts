import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://truetaxcost.com";

  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/compare`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/social-security`, changeFrequency: "weekly", priority: 0.8 },
  ];
}
