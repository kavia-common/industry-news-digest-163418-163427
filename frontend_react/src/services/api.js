/**
 * API client for the Industry News Digest frontend.
 * Uses environment variable REACT_APP_API_BASE for backend URL.
 * Falls back to local mocks if backend is unavailable.
 */

const API_BASE = process.env.REACT_APP_API_BASE || '';

async function request(path, options = {}) {
  const url = API_BASE ? `${API_BASE}${path}` : path;
  try {
    if (!API_BASE) throw new Error('No backend configured, use mock');
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      credentials: 'include',
      ...options,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `HTTP ${res.status}`);
    }
    if (res.status === 204) return null;
    return res.json();
  } catch (e) {
    // Fallback to mock handlers
    return mockHandler(path, options, e);
  }
}

// Mock datasets
let mockUser = null;
let mockPreferences = {
  topics: ['Risk', 'Compliance', 'Quality'],
  frequency: 'daily',
  email: '',
  subscribed: false,
};
const mockArticles = Array.from({ length: 16 }).map((_, i) => {
  const cats = ['Risk', 'Compliance', 'Quality', 'M&A', 'Independence', 'New Launches'];
  const cat = cats[i % cats.length];
  return {
    id: String(i + 1),
    title: `[${cat}] Headline ${i + 1} - Key regulatory development`,
    source: 'Example Newswire',
    url: 'https://example.com/article',
    date: new Date(Date.now() - i * 86400000).toISOString(),
    category: cat,
    summary:
      'Concise summary of the article highlighting implications for accounting firms, risk, and compliance considerations.',
    tags: [cat, 'Accounting'],
  };
});

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function mockHandler(path, options) {
  await delay(200); // Simulate latency
  if (path.startsWith('/auth/login') && options.method === 'POST') {
    const body = JSON.parse(options.body || '{}');
    mockUser = { id: 'u1', email: body.email };
    return { user: mockUser, token: 'mock-token' };
  }
  if (path.startsWith('/auth/register') && options.method === 'POST') {
    const body = JSON.parse(options.body || '{}');
    mockUser = { id: 'u1', email: body.email };
    return { user: mockUser, token: 'mock-token' };
  }
  if (path.startsWith('/auth/me')) {
    return { user: mockUser };
  }
  if (path.startsWith('/auth/logout')) {
    mockUser = null;
    return { ok: true };
  }
  if (path.startsWith('/articles')) {
    const url = new URL(path, 'http://localhost');
    const q = url.searchParams.get('q') || '';
    const cat = url.searchParams.get('category') || '';
    const filtered = mockArticles.filter(
      (a) =>
        (!q || a.title.toLowerCase().includes(q.toLowerCase())) &&
        (!cat || cat === 'All' || a.category === cat)
    );
    return { items: filtered };
  }
  if (path.startsWith('/preferences') && options.method === 'GET') {
    return mockPreferences;
  }
  if (path.startsWith('/preferences') && options.method === 'PUT') {
    const body = JSON.parse(options.body || '{}');
    mockPreferences = { ...mockPreferences, ...body };
    return mockPreferences;
  }
  if (path.startsWith('/subscription') && options.method === 'PUT') {
    const body = JSON.parse(options.body || '{}');
    mockPreferences = { ...mockPreferences, ...body };
    return { ok: true };
  }
  return { ok: true };
}

// PUBLIC_INTERFACE
export async function apiLogin(email, password) {
  /** Login user with email/password; returns {user, token}. */
  return request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}

// PUBLIC_INTERFACE
export async function apiRegister(email, password) {
  /** Register user; returns {user, token}. */
  return request('/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) });
}

// PUBLIC_INTERFACE
export async function apiMe() {
  /** Get current user session. */
  return request('/auth/me', { method: 'GET' });
}

// PUBLIC_INTERFACE
export async function apiLogout() {
  /** Logout user. */
  return request('/auth/logout', { method: 'POST' });
}

// PUBLIC_INTERFACE
export async function apiListArticles({ q = '', category = '' } = {}) {
  /** List articles with optional query and category filter; returns {items}. */
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (category) params.set('category', category);
  return request(`/articles?${params.toString()}`, { method: 'GET' });
}

// PUBLIC_INTERFACE
export async function apiGetPreferences() {
  /** Get user notification preferences. */
  return request('/preferences', { method: 'GET' });
}

// PUBLIC_INTERFACE
export async function apiUpdatePreferences(data) {
  /** Update user notification preferences. */
  return request('/preferences', { method: 'PUT', body: JSON.stringify(data) });
}

// PUBLIC_INTERFACE
export async function apiUpdateSubscription(data) {
  /** Update email subscription settings. */
  return request('/subscription', { method: 'PUT', body: JSON.stringify(data) });
}
