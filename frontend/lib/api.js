const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

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

export async function adminLogin(payload) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Credenciais invalidas");
  return res.json();
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
