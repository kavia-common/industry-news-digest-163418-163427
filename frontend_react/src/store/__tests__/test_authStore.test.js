import useAuthStore from '../../store/authStore';
import * as api from '../../services/api';
import { act } from '@testing-library/react';

jest.mock('../../services/api');

beforeEach(() => {
  // reset store state between tests
  const { getState, setState } = useAuthStore;
  act(() => setState({ user: null, token: null, isAuthenticated: false, loading: false }, true));
  // clear storage
  localStorage.clear();
  jest.resetAllMocks();
});

describe('authStore', () => {
  test('bootstrap loads from localStorage', async () => {
    localStorage.setItem('ind-auth', JSON.stringify({ user: { id: 'u1', email: 'x@y.com' }, token: 't' }));
    await act(async () => {
      await useAuthStore.getState().bootstrap();
    });
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().user.email).toBe('x@y.com');
  });

  test('bootstrap falls back to apiMe', async () => {
    api.apiMe.mockResolvedValue({ user: { id: 'u2', email: 'm@n.com' } });
    await act(async () => {
      await useAuthStore.getState().bootstrap();
    });
    expect(api.apiMe).toHaveBeenCalled();
    expect(useAuthStore.getState().user.email).toBe('m@n.com');
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  test('login sets state and persists to storage', async () => {
    api.apiLogin.mockResolvedValue({ user: { id: 'u3', email: 'a@b.com' }, token: 'tok' });
    await act(async () => {
      await useAuthStore.getState().login('a@b.com', 'pw');
    });
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(JSON.parse(localStorage.getItem('ind-auth')).user.email).toBe('a@b.com');
  });

  test('register sets state and persists', async () => {
    api.apiRegister.mockResolvedValue({ user: { id: 'u4', email: 'r@c.com' }, token: 'tok2' });
    await act(async () => {
      await useAuthStore.getState().register('r@c.com', 'pw');
    });
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(JSON.parse(localStorage.getItem('ind-auth')).user.email).toBe('r@c.com');
  });

  test('logout clears state and storage', async () => {
    api.apiLogout.mockResolvedValue({ ok: true });
    // set initial state
    await act(async () => {
      await useAuthStore.getState().login('seed@x.com', 'pw');
    });
    await act(async () => {
      await useAuthStore.getState().logout();
    });
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(localStorage.getItem('ind-auth')).toBeNull();
  });
});
