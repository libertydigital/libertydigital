import {curatedPosts, type CuratedPost} from "./curated-posts";
import {additionalCuratedPosts} from "./curated-posts-extra";
import {eventCuratedPosts} from "./curated-posts-events";
export type {CuratedPost};
export const ALL_CURATED_POSTS: CuratedPost[] = [...curatedPosts, ...additionalCuratedPosts, ...eventCuratedPosts];
export const CURATED_POSTS_BY_SLUG = new Map(ALL_CURATED_POSTS.map(p=>[p.slug,p]));
export function findCuratedPost(slug:string) {return CURATED_POSTS_BY_SLUG.get(slug);}
