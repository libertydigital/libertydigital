// Pure helpers used by the safe HTML-free blog Markdown renderer.
export function safeArticleHref(value: string): string | null {
  if (/^\/(?!\/)[a-zA-Z0-9/_#.?&=%+~-]*$/.test(value) && !value.includes("\\")) return value;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || !url.hostname || url.username || url.password) return null;
    return url.toString();
  } catch { return null; }
}
export type ArticleHero = {src:string;alt:string;body:string};
const heroPattern = /^!\[([^\]\r\n]{8,180})\]\((\/images\/blog\/[a-z0-9/-]+\.svg)\)\s*/;
export function extractArticleHero(body:string):ArticleHero|null {
  const matched=body.match(heroPattern);
  if(!matched)return null;
  return {src:matched[2],alt:matched[1],body:body.slice(matched[0].length).trim()};
}
