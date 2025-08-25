import {
  apiLogin,
  apiRegister,
  apiLogout,
  apiMe,
  apiListArticles,
  apiGetPreferences,
  apiUpdatePreferences,
  apiUpdateSubscription,
} from '../../services/api';

describe('api services (mock fallback)', () => {
  test('login/register/me/logout flow', async () => {
    const reg = await apiRegister('a@b.com', 'pw');
    expect(reg.user.email).toBe('a@b.com');
    expect(reg.token).toBeTruthy();

    const me1 = await apiMe();
    expect(me1.user).toBeTruthy();

    await apiLogout();
    const me2 = await apiMe();
    // After logout, mock returns { user: null }
    expect(me2.user).toBeNull();

    const l = await apiLogin('c@d.com', 'pw');
    expect(l.user.email).toBe('c@d.com');
  }, 10000);

  test('list articles filters by q and category', async () => {
    const all = await apiListArticles();
    expect(Array.isArray(all.items)).toBe(true);
    expect(all.items.length).toBeGreaterThan(0);

    const filteredCat = await apiListArticles({ category: 'Risk' });
    expect(filteredCat.items.every(a => a.category === 'Risk')).toBe(true);

    const firstTitle = all.items[0].title.split(' ')[0]; // e.g., [Risk]
    const filteredQ = await apiListArticles({ q: 'Headline 1' });
    expect(filteredQ.items.some(a => a.title.includes('Headline 1'))).toBe(true);
  }, 10000);

  test('preferences get and update', async () => {
    const prefs = await apiGetPreferences();
    expect(prefs.topics).toBeDefined();
    const updated = await apiUpdatePreferences({ frequency: 'weekly' });
    expect(updated.frequency).toBe('weekly');
  }, 10000);

  test('subscription update', async () => {
    const res = await apiUpdateSubscription({ email: 'user@firm.com', subscribed: true });
    expect(res.ok).toBe(true);
    const prefs = await apiGetPreferences();
    expect(prefs.email).toBe('user@firm.com');
    expect(prefs.subscribed).toBe(true);
  }, 10000);
});
