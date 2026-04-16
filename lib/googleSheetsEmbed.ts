/**
 * Build a Google Sheets URL suitable for iframe preview from a normal edit/share link.
 */
const SHEETS_ID_RE = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;

export function spreadsheetIdFromGoogleSheetsUrl(url: string): string | null {
  const m = url.trim().match(SHEETS_ID_RE);
  return m ? m[1] : null;
}

export function googleSheetsPreviewEmbedUrl(url: string): string | null {
  const id = spreadsheetIdFromGoogleSheetsUrl(url);
  if (!id) return null;
  return `https://docs.google.com/spreadsheets/d/${id}/preview`;
}
