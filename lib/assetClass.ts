/** Karma asset classes that use the Asset A / D IC ruleset in this app (late-fee defaults, rev-share recap comparison, etc.). */
export function isAssetAOrD(assetClass: string): boolean {
  const c = assetClass.trim();
  return c === "A" || c === "D" || c === "Asset A" || c === "Asset D";
}

export function isAssetD(assetClass: string): boolean {
  const c = assetClass.trim();
  return c === "D" || c === "Asset D";
}

const norm = (s: string) => s.replace(/\s+/g, " ").trim();

/** Asset B (B_MOD): B-I / B-PO invoice & PO financing ruleset. */
export function isAssetB(assetClass: string): boolean {
  const c = norm(assetClass).toUpperCase();
  return c.startsWith("B -") || c.startsWith("B-") || c.includes("B-I") || c.includes("B-PO");
}

export function isAssetBI(assetClass: string): boolean {
  if (!isAssetB(assetClass)) return false;
  const c = norm(assetClass).toUpperCase();
  if (c.includes("PO") || c.includes("INVOICE")) return false;
  return c.includes("B-I") || /B\s*-\s*I\b/i.test(assetClass);
}

export function isAssetBPO(assetClass: string): boolean {
  if (!isAssetB(assetClass)) return false;
  const c = norm(assetClass).toUpperCase();
  return c.includes("PO") || c.includes("INVOICE") || /B\s*-\s*PO/i.test(assetClass);
}

/** Returns true for B-Invoice assets (e.g. "B - Invoice"). Distinct from the "B-I" shorthand handled by isAssetBI. */
export function isAssetBInvoice(assetClass: string): boolean {
  if (!isAssetB(assetClass)) return false;
  const c = norm(assetClass).toUpperCase();
  return c.includes("INVOICE");
}
