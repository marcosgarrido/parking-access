let onUnauthorized: (() => void) | null = null;
let handlingUnauthorized = false;

export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler;
}

export async function apiFetch(input: RequestInfo, init: RequestInit = {}) {
  const method = (init.method || "GET").toUpperCase();
  const headers = new Headers(init.headers);

  if (method !== "GET") {
    const csrfToken = document.cookie
      .split("; ")
      .find((c) => c.startsWith("csrf="))
      ?.split("=")[1];

    if (csrfToken) headers.set("X-CSRF-Token", decodeURIComponent(csrfToken));

    if (
      init.body &&
      !(init.body instanceof FormData) &&
      !headers.has("Content-Type")
    ) {
      headers.set("Content-Type", "application/json");
    }
  }

  const res = await fetch(input, { ...init, credentials: "include", headers });

  if (res.ok) handlingUnauthorized = false;

  if (res.status === 204) return null;

  const data = await res.json().catch((err) => {
    console.error(
      "Fallo al parsear respuesta del servidor:",
      err,
      res.status,
      res.url,
    );

    return {
      message: "No se pudo conectar con el servidor. Inténtalo de nuevo.",
    };
  });

  if (!res.ok) {
    if (res.status === 401 && !handlingUnauthorized) {
      handlingUnauthorized = true;
      onUnauthorized?.();
    }

    const err = new Error(data?.message || `HTTP ${res.status}`) as Error & {
      status?: number;
      data?: unknown;
    };

    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}
