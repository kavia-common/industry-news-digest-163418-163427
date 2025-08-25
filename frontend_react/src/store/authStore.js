import { create } from 'zustand';
import { apiLogin, apiRegister, apiLogout, apiMe } from '../services/api';

// PUBLIC_INTERFACE
const useAuthStore = create((set, get) => ({
  /** Authentication store managing user session and actions. */
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  async bootstrap() {
    // Try to restore from localStorage
    const cached = localStorage.getItem('ind-auth');
    if (cached) {
      const data = JSON.parse(cached);
      set({ user: data.user, token: data.token, isAuthenticated: true });
      return;
    }
    try {
      set({ loading: true });
      const res = await apiMe();
      if (res?.user) {
        set({ user: res.user, isAuthenticated: true });
      }
    } finally {
      set({ loading: false });
    }
  },
  async login(email, password) {
    set({ loading: true });
    try {
      const res = await apiLogin(email, password);
      set({ user: res.user, token: res.token, isAuthenticated: true });
      localStorage.setItem('ind-auth', JSON.stringify({ user: res.user, token: res.token }));
      return res;
    } finally {
      set({ loading: false });
    }
  },
  async register(email, password) {
    set({ loading: true });
    try {
      const res = await apiRegister(email, password);
      set({ user: res.user, token: res.token, isAuthenticated: true });
      localStorage.setItem('ind-auth', JSON.stringify({ user: res.user, token: res.token }));
      return res;
    } finally {
      set({ loading: false });
    }
  },
  async logout() {
    await apiLogout();
    localStorage.removeItem('ind-auth');
    set({ user: null, token: null, isAuthenticated: false });
  }
}));

export default useAuthStore;
