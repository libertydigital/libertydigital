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
const realisticCoverSlugs=new Set([
  "nigerian-same-person-affidavit-italy",
  "nigerian-nulla-osta-marriage-italy-documents",
  "nigerian-child-passport-parental-consent-rome",
  "npc-birth-attestation-italy-family-reunion",
  "nigerian-family-income-documents-italy-scholarship",
]);
const editorialImagePattern=/^\/images\/blog\/[a-z0-9/-]+\.(?:svg|png|webp)$/;
const heroPattern=/^!\[([^\]\r\n]{8,180})\]\((\/images\/blog\/[a-z0-9/-]+\.(?:svg|png|webp))\)\s*/;

export function resolveEditorialImagePath(src:string):string|null {
  if(!editorialImagePattern.test(src))return null;
  if(src.endsWith(".svg")) {
    const slug=src.slice("/images/blog/".length,-".svg".length);
    if(realisticCoverSlugs.has(slug))return `/images/blog/${slug}.png`;
  }
  return src;
}

export function extractArticleHero(body:string):ArticleHero|null {
  const matched=body.match(heroPattern);
  if(!matched)return null;
  const src=resolveEditorialImagePath(matched[2]);
  if(!src)return null;
  return {src,alt:matched[1],body:body.slice(matched[0].length).trim()};
}
