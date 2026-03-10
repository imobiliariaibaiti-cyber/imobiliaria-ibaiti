const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.imobiliariaibaiti.com";

const toQuery = (params) => {
  const query = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });
  return query.toString();
};

export async function getProperties(params = {}) {
  try {
    const query = toQuery(params);
    const res = await fetch(`${API_URL}/properties${query ? `?${query}` : ""}`, {
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }

    return res.json();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("getProperties failed:", error.message);
    }
    return [];
  }
}

export async function getPropertyById(id) {
  const res = await fetch(`${API_URL}/properties/${id}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Imovel nao encontrado");
  return res.json();
}

export const getTravelTimes = (id) => fetch(`${API_URL}/properties/${id}/travel-times`, { cache: "no-store" }).then((r) => r.json());
export const getCitySummary = (city) =>
  fetch(`${API_URL}/cities/summary?city=${encodeURIComponent(city)}`, { cache: "no-store" }).then((r) => r.json());
export const getComments = (id) => fetch(`${API_URL}/properties/${id}/comments`, { cache: "no-store" }).then((r) => r.json());
export const postComment = (id, payload) =>
  fetch(`${API_URL}/properties/${id}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).then((r) => r.json());

export async function adminLogin(payload) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Credenciais invalidas");
  return res.json();
}

export async function clientRegister(payload) {
  const res = await fetch(`${API_URL}/client/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Nao foi possivel criar a conta.");
  return data;
}

export async function clientLogin(payload) {
  const res = await fetch(`${API_URL}/client/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Credenciais invalidas.");
  return data;
}

export async function adminRequest(path, token, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Erro na requisicao");
  }

  if (res.status === 204) return null;
  return res.json();
}

export async function clientRequest(path, token, options = {}) {
  const headers = {
    Authorization: `Bearer ${token}`,
    ...(options.headers || {})
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Erro na requisicao do cliente");
  }

  if (res.status === 204) return null;
  return res.json();
}

export async function uploadImages(files, token) {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  const res = await fetch(`${API_URL}/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Erro ao subir imagens");
  }

  return res.json();
}

export async function uploadClientImages(files, token) {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  const res = await fetch(`${API_URL}/client/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Erro ao subir imagens do cliente");
  }

  return res.json();
}
