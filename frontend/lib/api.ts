export async function fetchApi<T>(path: string, query?: Record<string, string | undefined>): Promise<T> {
  const rawBase = (import.meta.env.VITE_CLIENT_TARGET as string | undefined)?.trim();
  const base = rawBase && rawBase.length > 0 ? rawBase : window.location.origin;
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  const url = new URL(path.replace(/^\//, ""), normalizedBase);

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value) {
      url.searchParams.set(key, value);
    }
  }

  const response = await fetch(url.toString(), { credentials: "include" });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
