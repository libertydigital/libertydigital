import assets from "../../../media/approved-assets.json" with {type:"json"};

export type ApprovedMediaAsset = {
  id: string;
  title: string;
  path: string;
  kind: "photo" | "video";
  description: string;
  rightsNote: string;
};

/** Fixed catalog. An editor may select only checked-in site media, never an arbitrary remote URL. */
export const approvedMediaAssets = assets as unknown as ApprovedMediaAsset[];
export function getApprovedMediaAsset(id: unknown): ApprovedMediaAsset | undefined {
  if (typeof id !== "string") return undefined;
  return approvedMediaAssets.find(asset => asset.id === id);
}
export function publicMediaUrl(asset: ApprovedMediaAsset): string {
  return "/" + asset.path.replace(/^public\//, "").split("/").map(encodeURIComponent).join("/");
}
