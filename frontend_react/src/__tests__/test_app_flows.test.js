import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from '../App';
import useAuthStore from '../store/authStore';

// Helper to clear auth state between tests
function resetAuth() {
  const { setState } = useAuthStore;
  setState({ user: null, token: null, isAuthenticated: false, loading: false }, true);
  localStorage.clear();
}

describe('App integration flows', () => {
  beforeEach(() => {
    resetAuth();
  });

  test('unauthenticated user sees Login when visiting /', async () => {
    render(<App />);
    // App loads at "/" -> RequireAuth -> redirect to /login within Layout
    expect(await screen.findByText(/Welcome back/i)).toBeInTheDocument();
    // Sidebar brand still renders due to Layout always rendering
    expect(screen.getByText(/Industry News Digest/)).toBeInTheDocument();
  }, 15000);

  test('login flow leads to dashboard tiles and articles', async () => {
    render(<App />);
    // on login page
    const email = await screen.findByLabelText(/Email/i);
    const password = screen.getByLabelText(/Password/i);
    fireEvent.change(email, { target: { value: 'user@firm.com' } });
    fireEvent.change(password, { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    // After mock latency, dashboard should render
    await waitFor(() => expect(screen.getByText(/Total Headlines/i)).toBeInTheDocument(), { timeout: 10000 });

    // Articles present or "No articles found" handled
    expect(screen.getByText(/Risk/i)).toBeInTheDocument();
  }, 20000);

  test('navigate to Preferences and update settings', async () => {
    // log in first via store to skip UI
    resetAuth();
    useAuthStore.setState({ isAuthenticated: true, user: { email: 'u@firm.com' } });
    render(<App />);

    // Click Preferences in sidebar
    fireEvent.click(screen.getByText('Preferences'));
    // Preferences page title
    const title = await screen.findByText(/Notification Preferences/i);
    expect(title).toBeInTheDocument();

    // Toggle a topic (e.g., M&A)
    const ma = screen.getByText(/M&A/);
    fireEvent.click(ma);
    // Save
    fireEvent.click(screen.getByRole('button', { name: /Save Preferences/i }));
    // No visible toast; just ensure button exists and not disabled after save
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Save Preferences/i })).not.toBeDisabled();
    });
  }, 20000);

  test('navigate to Archive and perform a search', async () => {
    resetAuth();
    useAuthStore.setState({ isAuthenticated: true, user: { email: 'u@firm.com' } });
    render(<App />);

    fireEvent.click(screen.getByText('Archive'));
    expect(await screen.findByText('Archive')).toBeInTheDocument();

    const input = screen.getByPlaceholderText(/Search keywords/);
    fireEvent.change(input, { target: { value: 'Headline 1' } });
    fireEvent.click(screen.getByRole('button', { name: /Search/i }));

    await waitFor(() => {
      expect(screen.queryByText('Searching…')).not.toBeInTheDocument();
    }, { timeout: 10000 });

    // Should show results or at least not show "No results" if match exists
    const noRes = screen.queryByText(/No results/i);
    const anyCard = screen.queryByText(/Headline 1/);
    expect(noRes && !anyCard ? false : true).toBe(true);
  }, 20000);

  test('navigate to Email Subscription and update', async () => {
    resetAuth();
    useAuthStore.setState({ isAuthenticated: true, user: { email: 'u@firm.com' } });
    render(<App />);

    fireEvent.click(screen.getByText('Email Subscription'));
    expect(await screen.findByText('Email Subscription')).toBeInTheDocument();

    const emailInput = screen.getByPlaceholderText('you@firm.com');
    fireEvent.change(emailInput, { target: { value: 'digest@firm.com' } });
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    const saveBtn = screen.getByRole('button', { name: /Save Settings/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Save Settings/i })).not.toBeDisabled();
    }, { timeout: 10000 });
  }, 20000);

  test('article detail route shows not found for unknown id', async () => {
    resetAuth();
    useAuthStore.setState({ isAuthenticated: true, user: { email: 'u@firm.com' } });
    // Navigate by updating location: render App then push link manually by anchor
    render(<App />);
    // Click brand then navigate via history by creating a link to /article/unknown
    const anchor = document.createElement('a');
    anchor.href = '/article/unknown';
    anchor.setAttribute('data-testid', 'go-article');
    document.body.appendChild(anchor);
    fireEvent.click(screen.getByTestId('go-article'));

    // Depending on router behavior under test environment, we may remain on page.
    // Instead, assert dashboard loads then switch by pushing state:
    window.history.pushState({}, '', '/article/unknown');
    // re-render to ensure route processes
    render(<App />);
    expect(await screen.findByText(/Article not found/i, {}, { timeout: 10000 })).toBeInTheDocument();
  }, 20000);
});
