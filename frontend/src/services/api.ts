// frontend/src/services/api.ts

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { method?: HttpMethod } = {}
): Promise<T> {
  const tokenRaw = localStorage.getItem("lockin_auth");
  let token: string | undefined;

  if (tokenRaw) {
    try {
      const parsed = JSON.parse(tokenRaw);
      token = parsed.token;
    } catch {
      token = undefined;
    }
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    (headers as any)["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // Nếu bị lỗi network (server không chạy, sai URL,...)
  // fetch sẽ throw luôn – mình để catch ở nơi gọi.
  if (!res.ok) {
    const text = await res.text();
    // cố gắng trả message backend, nếu không có thì trả HTTP code
    const message = text || `HTTP ${res.status} ${res.statusText}`;
    throw new Error(message);
  }

  // login/register có thể trả JSON, nên parse
  return (await res.json()) as T;
}
