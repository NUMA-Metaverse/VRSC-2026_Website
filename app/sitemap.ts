import type { MetadataRoute } from "next";
import { fullImageUrl } from "@/lib/imageAssets";
import { SITE_LAST_MODIFIED, SITE_URL, siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 1,
      images: [
        siteUrl("/ogp.jpg"),
        siteUrl(fullImageUrl("/event-2026/hero.webp")),
      ],
    },
  ];
}
