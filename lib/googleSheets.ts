// lib/googleSheets.ts
import { google } from 'googleapis';

/**
 * Appends rows to a Google Sheet range.
 * Logs a warning and returns (without throwing) when env vars are missing.
 * Throws on API errors — callers must wrap in try/catch.
 */
export async function appendToSheet(
  range: string,
  values: (string | number)[][]
): Promise<void> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!spreadsheetId || !serviceAccountEmail || !privateKey) {
    console.warn('[googleSheets] env vars not configured — skipping sheet write');
    return;
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: serviceAccountEmail,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values },
  });
}
