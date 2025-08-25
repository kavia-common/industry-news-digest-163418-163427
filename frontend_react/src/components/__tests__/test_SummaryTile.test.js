import { render, screen } from '@testing-library/react';
import SummaryTile from '../../components/SummaryTile';

describe('SummaryTile', () => {
  test('renders title and value', () => {
    render(<SummaryTile title="Total Headlines" value={10} />);
    expect(screen.getByText('Total Headlines')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  test('renders positive delta indicator', () => {
    render(<SummaryTile title="Risk" value={5} delta={3} />);
    expect(screen.getByText(/▲ 3%/)).toBeInTheDocument();
  });

  test('renders negative delta indicator', () => {
    render(<SummaryTile title="Compliance" value={2} delta={-2} />);
    expect(screen.getByText(/▼ 2%/)).toBeInTheDocument();
  });

  test('renders neutral dash when delta is zero', () => {
    render(<SummaryTile title="Quality" value={0} delta={0} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });
});
