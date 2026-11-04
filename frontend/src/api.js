let csrfToken = null;
let csrfHeader = "X-XSRF-TOKEN";

export async function refreshCsrf() {
  const response = await fetch("/api/csrf", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Could not get CSRF token");
  }

  const data = await response.json();

  csrfHeader = data.headerName;

  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="));

  csrfToken = cookie
    ? decodeURIComponent(cookie.substring("XSRF-TOKEN=".length))
    : null;

  if (!csrfToken) {
    throw new Error("CSRF cookie not found");
  }

  return data;
}

export async function apiRequest(url, options = {}) {
  const method = (options.method || "GET").toUpperCase();

  const needsCsrf = !["GET", "HEAD", "OPTIONS"].includes(method);

  if (needsCsrf && !csrfToken) {
    await refreshCsrf();
  }

  const headers = new Headers(options.headers);

  if (needsCsrf) {
    headers.set(csrfHeader, csrfToken);
  }

  return fetch(url, {
    ...options,
    method,
    headers,
    credentials: "include",
  });
}
