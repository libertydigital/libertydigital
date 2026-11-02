import "server-only";
import { createStoryboard, validateScenes, type ArticleInput, type VideoFormat, type Storyboard } from "./storyboard";

export async function draftVideoStoryboard(article: ArticleInput, format: VideoFormat): Promise<Storyboard> {
  const fallback = createStoryboard(article, format);
  const key = process.env.OPENAI_API_KEY;
  if (!key) return fallback;
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.CONTENT_AI_MODEL || "gpt-4.1-mini",
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
          {role: "system", content: "Produce a 15-60 second vertical video storyboard as JSON with hook (string), scenes (array of {caption, visual, seconds}). Valid visual choices: hook, checklist, warning, document, cta. 3-6 scenes. Use factual information ONLY from the provided source. No claims of government affiliation, issuance, guaranteed approval or processing time. Finish with a CTA for independent Liberty Digital document-preparation support and advise checking current authority rules. No private details."},
          {role: "user", content: JSON.stringify({format, article})},
        ],
      }),
      signal: AbortSignal.timeout(20000),
      cache: "no-store",
    });
    if (!response.ok) throw new Error("AI provider unavailable.");
    const payload = await response.json();
    const parsed = JSON.parse(payload.choices?.[0]?.message?.content || "{}");
    const scenes = validateScenes(parsed.scenes);
    if (typeof parsed.hook !== "string" || !parsed.hook.trim()) throw new Error("Missing hook.");
    const disclaimer = "Confirm current requirements with the relevant official authority.";
    if (!scenes.some(scene => /official|authority|requirement/i.test(scene.caption))) {
      const last = scenes[scenes.length - 1];
      last.caption = (last.caption + " " + disclaimer).slice(0, 200);
    }
    return {
      hook: parsed.hook.slice(0, 200),
      scenes,
      script: scenes.map(scene => scene.caption).join("\n\n"),
      durationSeconds: scenes.reduce((sum, scene) => sum + scene.seconds, 0),
    };
  } catch {
    return fallback;
  }
}
