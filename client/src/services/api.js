const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

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
