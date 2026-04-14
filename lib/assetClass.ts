/** Karma asset classes that use the Asset A / D IC ruleset in this app (late-fee defaults, rev-share recap comparison, etc.). */
export function isAssetAOrD(assetClass: string): boolean {
  const c = assetClass.trim();
  return c === "A" || c === "D" || c === "Asset A" || c === "Asset D";
}
