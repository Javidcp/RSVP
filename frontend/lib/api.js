const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

export async function apiFetch(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;

  console.log("API REQUEST:", url);

  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  console.log("API STATUS:", response.status);

  const data = await response.json();

  if (!response.ok) {
    console.error("API ERROR:", data);

    throw new Error(
      data.message || "Something went wrong"
    );
  }

  return data;
}