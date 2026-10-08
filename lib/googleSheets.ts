// lib/googleSheets.ts
import { google } from 'googleapis';

function getConfig() {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!spreadsheetId || !serviceAccountEmail || !privateKey) {
    console.warn('[googleSheets] env vars not configured — skipping sheet write');
    return null;
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: serviceAccountEmail,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return { spreadsheetId, sheets: google.sheets({ version: 'v4', auth }) };
}

function columnLetter(columnNumber: number): string {
  let value = columnNumber;
  let result = '';

  while (value > 0) {
    const remainder = (value - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    value = Math.floor((value - 1) / 26);
  }

  return result;
}

/**
 * Appends rows to a Google Sheet range.
 * Logs a warning and returns (without throwing) when env vars are missing.
 * Throws on API errors — callers must wrap in try/catch.
 */
export async function appendToSheet(
  range: string,
  values: (string | number)[][]
): Promise<void> {
  const config = getConfig();
  if (!config) return;

  const { spreadsheetId, sheets } = config;
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values },
  });
}

/**
 * Creates a tab with a header row when it does not exist, then appends values.
 * Useful for new surveys that should work without manual spreadsheet setup.
 */
export async function appendToSheetWithHeader(
  sheetTitle: string,
  headers: string[],
  values: (string | number)[][]
): Promise<void> {
  const config = getConfig();
  if (!config) return;

  const { spreadsheetId, sheets } = config;
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: 'sheets.properties.title',
  });
  const exists = spreadsheet.data.sheets?.some(
    (sheet) => sheet.properties?.title === sheetTitle
  );
  const escapedTitle = sheetTitle.replace(/'/g, "''");
  const lastColumn = columnLetter(headers.length);

  if (!exists) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title: sheetTitle } } }],
      },
    });

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `'${escapedTitle}'!A1:${lastColumn}1`,
      valueInputOption: 'RAW',
      requestBody: { values: [headers] },
    });
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `'${escapedTitle}'!A:${lastColumn}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values },
  });
}
