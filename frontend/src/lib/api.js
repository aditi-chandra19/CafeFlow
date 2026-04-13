const API_BASE = "http://localhost:5000";

function getAuthHeaders(extraHeaders = {}) {
  const token = localStorage.getItem("token");
  return {
    ...extraHeaders,
    ...(token ? { Authorization: token } : {}),
  };
}

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || data.error || "Request failed");
  }
  return data;
}

export async function apiGet(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: getAuthHeaders(options.headers),
  });
  return parseResponse(response);
}

export async function apiSend(path, method, body, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    ...options,
    headers: getAuthHeaders({
      "Content-Type": "application/json",
      ...(options.headers || {}),
    }),
    body: JSON.stringify(body),
  });
  return parseResponse(response);
}

export async function apiPost(path, body, options = {}) {
  return apiSend(path, "POST", body, options);
}

export async function apiPut(path, body, options = {}) {
  return apiSend(path, "PUT", body, options);
}
