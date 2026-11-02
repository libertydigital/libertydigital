import { z } from "zod";
import { slugify } from "./storyboard";

export const articleSchema = z.object({
  title: z.string().trim().min(8).max(150),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(80),
  excerpt: z.string().trim().min(20).max(350),
  metaDescription: z.string().trim().min(20).max(160),
  body: z.string().trim().min(100).max(50000),
  serviceSlug: z.string().trim().max(100).optional(),
});
export function parseArticle(form: FormData) {
  return articleSchema.parse({
    title: String(form.get("title") ?? ""),
    slug: slugify(String(form.get("slug") ?? form.get("title") ?? "")),
    excerpt: String(form.get("excerpt") ?? ""),
    metaDescription: String(form.get("metaDescription") ?? ""),
    body: String(form.get("body") ?? ""),
    serviceSlug: String(form.get("serviceSlug") ?? ""),
  });
}
export function parseVideoFormat(value: unknown): "EXPLAINER" | "TIPS" | "UPDATE" {
  if (value === "EXPLAINER" || value === "TIPS" || value === "UPDATE") return value;
  throw new Error("Unsupported video format.");
}
