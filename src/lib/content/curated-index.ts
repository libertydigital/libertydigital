import {curatedPosts, type CuratedPost} from "./curated-posts";
import {additionalCuratedPosts} from "./curated-posts-extra";
export type {CuratedPost};
export const ALL_CURATED_POSTS: CuratedPost[] = [...curatedPosts, ...additionalCuratedPosts];
export const CURATED_POSTS_BY_SLUG = new Map(ALL_CURATED_POSTS.map(p=>[p.slug,p]));
export function findCuratedPost(slug:string) {return CURATED_POSTS_BY_SLUG.get(slug);}
