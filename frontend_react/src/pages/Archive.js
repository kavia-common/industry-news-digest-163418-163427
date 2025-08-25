import React, { useEffect, useState } from 'react';
import { apiListArticles } from '../services/api';
import ArticleCard from '../components/ArticleCard';

// PUBLIC_INTERFACE
export default function Archive() {
  /** Archived news search and browsing. */
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('All');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  async function search() {
    setLoading(true);
    try {
      const res = await apiListArticles({ q, category });
      setItems(res.items || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { search(); }, []);

  return (
    <div>
      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <h2 style={{ marginTop: 0 }}>Archive</h2>
        <div className="grid" style={{ gridTemplateColumns: '2fr 1fr auto', gap: 8 }}>
          <input className="input" placeholder="Search keywords…" value={q} onChange={e => setQ(e.target.value)} />
          <select className="select" value={category} onChange={e => setCategory(e.target.value)}>
            {['All', 'Risk', 'Compliance', 'Quality', 'M&A', 'Independence', 'New Launches'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={search}>Search</button>
        </div>
      </div>
      {loading && <div className="card" style={{ padding: 16 }}>Searching…</div>}
      {!loading && items.map(a => <ArticleCard key={a.id} article={a} />)}
      {!loading && items.length === 0 && <div className="card" style={{ padding: 16 }}>No results.</div>}
    </div>
  );
}
