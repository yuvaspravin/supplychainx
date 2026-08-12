// Remove trailing slashes dynamically to prevent 404s
const RAW_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://supplychainx-469a.onrender.com/api";
const API_BASE = RAW_URL.replace(/\/+$/, "");

export async function fetchGraphData() {
  const response = await fetch(`${API_BASE}/graph`);
  if (!response.ok) {
    throw new Error(`Failed to load graph data (${response.status})`);
  }
  return response.json();
}

export async function fetchBlastRadius(companyId) {
  const response = await fetch(
    `${API_BASE}/blast-radius/${encodeURIComponent(companyId)}`,
  );
  if (!response.ok) {
    throw new Error(`Failed to calculate blast radius for ${companyId}`);
  }
  return response.json();
}
