import { getAttributionData } from '@/lib/attribution';

export async function submitNetlifyForm(
  formName: string,
  data: Record<string, string | number>
): Promise<void> {
  const body = new URLSearchParams({ 'form-name': formName });

  const payload = { ...data, ...getAttributionData() };

  Object.entries(payload).forEach(([key, value]) => {
    body.append(key, String(value));
  });

  const response = await fetch('/forms.html', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error(`Netlify Forms respondeu com status ${response.status}`);
  }
}
