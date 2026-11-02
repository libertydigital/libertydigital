export type VideoFormat = "EXPLAINER" | "TIPS" | "UPDATE";
export type VideoScene = {
  caption: string;
  visual: "hook" | "checklist" | "warning" | "document" | "cta";
  seconds: number;
};
export type Storyboard = {
  hook: string;
  script: string;
  scenes: VideoScene[];
  durationSeconds: number;
};
export type ArticleInput = { title: string; excerpt: string; body: string };
export const DOCUMENT_NOTICE = "Official requirements may change. Confirm current instructions with the relevant authority.";

export function slugify(value: string): string {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}
export function extractSentences(markdown: string): string[] {
  return markdown.replace(/<[^>]*>/g, " ").replace(/\[[^\]]+\]\([^)]*\)/g, " ")
    .replace(/[#*_>`]/g, " ").replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/).map((part) => part.trim())
    .filter((part) => part.length >= 20).slice(0, 12);
}
export function validateScenes(value: unknown): VideoScene[] {
  if (!Array.isArray(value) || value.length < 2 || value.length > 8) {
    throw new Error("Storyboard needs 2–8 scenes.");
  }
  const visuals = new Set(["hook", "checklist", "warning", "document", "cta"]);
  const scenes: VideoScene[] = value.map((scene: unknown) => {
    if (!scene || typeof scene !== "object") throw new Error("Invalid scene.");
    const data = scene as Record<string, unknown>;
    if (typeof data.caption !== "string" || !data.caption.trim() || data.caption.length > 200 ||
        typeof data.visual !== "string" || !visuals.has(data.visual) ||
        !Number.isInteger(data.seconds) || (data.seconds as number) < 2 || (data.seconds as number) > 20) {
      throw new Error("Invalid scene caption, visual or duration.");
    }
    return {caption: data.caption.trim(), visual: data.visual as VideoScene["visual"], seconds: data.seconds as number};
  });
  const total = scenes.reduce((sum, scene) => sum + scene.seconds, 0);
  if (total < 15 || total > 60) throw new Error("Total video duration must be 15–60 seconds.");
  return scenes;
}
export function createStoryboard(article: ArticleInput, format: VideoFormat = "EXPLAINER"): Storyboard {
  const title = article.title.trim();
  if (!title) throw new Error("Article title is required.");
  const sentences = extractSentences(article.body);
  const points = [...new Set(sentences)].slice(0, 3);
  while (points.length < 3) points.push(article.excerpt.trim() || "Check the current requirements before proceeding.");
  const hook = format === "TIPS"
    ? "3 things to check: " + title.replace(/[.!?]+$/, "")
    : format === "UPDATE"
      ? "Before you act, check this: " + title.replace(/[.!?]+$/, "")
      : title.replace(/[.!?]+$/, "") + "? Start here.";
  const scenes: VideoScene[] = validateScenes([
    {caption: hook.slice(0, 200), visual: "hook", seconds: 5},
    {caption: points[0].slice(0, 200), visual: "document", seconds: 7},
    {caption: points[1].slice(0, 200), visual: format === "TIPS" ? "checklist" : "warning", seconds: 7},
    {caption: points[2].slice(0, 200), visual: "checklist", seconds: 7},
    {caption: "Need document-preparation support in Italy? Contact Liberty Digital. Verify official requirements.", visual: "cta", seconds: 6},
  ]);
  return {
    hook,
    scenes,
    script: scenes.map((scene) => scene.caption).join("\n\n"),
    durationSeconds: scenes.reduce((sum, scene) => sum + scene.seconds, 0),
  };
}
export function mayQueue(status: string): boolean { return status === "APPROVED"; }
export function mayPublishDistribution(videoStatus: string): boolean { return videoStatus === "READY"; }
