const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
const PRODUCTS_URL = `${API_URL}/api/products`;

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const error = new Error(body.message ?? "Ocurrió un error inesperado");
    error.fieldErrors = body.errors ?? {};
    throw error;
  }

  return response.status === 204 ? null : response.json();
}

export const getProducts = () => request(PRODUCTS_URL);

export const createProduct = (product) =>
  request(PRODUCTS_URL, { method: "POST", body: JSON.stringify(product) });

export const updateProduct = (id, product) =>
  request(`${PRODUCTS_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(product),
  });

export const deleteProduct = (id) =>
  request(`${PRODUCTS_URL}/${id}`, { method: "DELETE" });
