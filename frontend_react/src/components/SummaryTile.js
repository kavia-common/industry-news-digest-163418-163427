import React from 'react';

// PUBLIC_INTERFACE
export default function SummaryTile({ title, value, delta, accent = 'primary' }) {
  /** Small summary KPI tile for dashboard. */
  const color = accent === 'accent' ? 'var(--accent)' : accent === 'secondary' ? 'var(--secondary)' : 'var(--primary)';
  return (
    <div className="card tile">
      <h4>{title}</h4>
      <div className="value">{value}</div>
      {delta !== undefined && (
        <div style={{ color, fontWeight: 700, marginTop: 4 }}>
          {delta > 0 ? `▲ ${delta}%` : delta < 0 ? `▼ ${Math.abs(delta)}%` : '—'}
        </div>
      )}
    </div>
  );
}
