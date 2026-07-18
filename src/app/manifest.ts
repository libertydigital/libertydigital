import type { MetadataRoute } from "next";

import { absoluteUrl, SITE_NAME } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} Services`,
    short_name: "Liberty Digital",
    description:
      "Document preparation and digital consulting support for Nigerians in Rome, Italy.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4eee5",
    theme_color: "#112031",
    icons: [
      {
        src: absoluteUrl("/icon.png"),
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: absoluteUrl("/assets/icons/apple-touch-icon-v2.png"),
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
