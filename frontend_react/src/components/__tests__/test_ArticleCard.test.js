import { render, screen, fireEvent } from '@testing-library/react';
import ArticleCard from '../../components/ArticleCard';

const sample = {
  id: '1',
  title: '[Risk] Headline 1 - Key regulatory development',
  source: 'Example Newswire',
  url: 'https://example.com/article',
  date: new Date().toISOString(),
  category: 'Risk',
  summary: 'Concise summary of the article highlighting implications.',
};

describe('ArticleCard', () => {
  test('renders article basics', () => {
    render(<ArticleCard article={sample} />);
    expect(screen.getByText(/\[Risk\] Headline 1/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Read Source/i })).toHaveAttribute('href', sample.url);
  });

  test('toggle expand/collapse summary', () => {
    render(<ArticleCard article={sample} />);
    const button = screen.getByRole('button', { name: /Expand/i });
    fireEvent.click(button);
    expect(screen.getByRole('button', { name: /Collapse/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Collapse/i }));
    expect(screen.getByRole('button', { name: /Expand/i })).toBeInTheDocument();
  });
});
