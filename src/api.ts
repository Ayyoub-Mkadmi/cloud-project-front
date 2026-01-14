const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function checkBackendConnection() {
  const res = await fetch(`${API_BASE}/api/health`);
  if (!res.ok) throw new Error('Backend is not responding');
  return res.json();
}

export async function fetchGames() {
  const res = await fetch(`${API_BASE}/api/games`);
  if (!res.ok) throw new Error('Failed to fetch games');
  return res.json();
}

export async function createGame(formData: FormData) {
  const res = await fetch(`${API_BASE}/api/games`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to create game');
  }
  return res.json();
}
