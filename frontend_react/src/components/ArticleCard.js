import React, { useState } from 'react';

// PUBLIC_INTERFACE
export default function ArticleCard({ article }) {
  /** Expandable article summary card with link to original. */
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="card article">
      <h3>{article.title}</h3>
      <div className="meta">
        {new Date(article.date).toLocaleDateString()} • {article.source} • {article.category}
      </div>
      <div className={'summary ' + (expanded ? '' : 'summary-collapsed')}>
        {article.summary}
      </div>
      <div className="actions">
        <a className="btn btn-primary" href={article.url} target="_blank" rel="noreferrer">Read Source</a>
        <button className="btn" onClick={() => setExpanded(s => !s)}>
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
    </div>
  );
}
