import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app and shows brand and login/register actions by default', async () => {
  render(<App />);
  expect(screen.getByText(/Industry News Digest/i)).toBeInTheDocument();
  // Layout should show Login/Register when not authenticated
  expect(await screen.findByText(/Welcome back/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Login/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Register/i })).toBeInTheDocument();
});
