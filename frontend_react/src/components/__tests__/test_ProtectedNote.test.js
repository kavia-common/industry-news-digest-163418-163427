import { render, screen } from '@testing-library/react';
import ProtectedNote from '../../components/ProtectedNote';

test('ProtectedNote renders children content', () => {
  render(<ProtectedNote>Manage detailed notification settings in Preferences.</ProtectedNote>);
  expect(screen.getByText(/Manage detailed notification settings/)).toBeInTheDocument();
});
