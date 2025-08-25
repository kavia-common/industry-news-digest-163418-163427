import React, { useEffect, useMemo, useState } from 'react';
import SummaryTile from '../components/SummaryTile';
import ArticleCard from '../components/ArticleCard';
import ProtectedNote from '../components/ProtectedNote';
import { apiListArticles, apiGetPreferences, apiUpdatePreferences } from '../services/api';

// PUBLIC_INTERFACE
export default function Dashboard() {
  /** Daily summary dashboard with tiles, category filtering, and articles. */
  const [category, setCategory] = useState('All');
  const [q, setQ] = useState('');
  const [articles, setArticles] = useState([]);
  const [prefs, setPrefs] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { (async () => { setPrefs(await apiGetPreferences()); })(); }, []);
  useEffect(() => { (async () => {
    setLoading(true);
    try {
      const res = await apiListArticles({ q, category });
      setArticles(res.items || []);
    } finally {
      setLoading(false);
    }
  })(); }, [q, category]);

  const counts = useMemo(() => {
    const total = articles.length;
    const risk = articles.filter(a => a.category === 'Risk').length;
    const comp = articles.filter(a => a.category === 'Compliance').length;
    const qa = articles.filter(a => a.category === 'Quality').length;
    return { total, risk, comp, qa };
  }, [articles]);

  async function toggleTopic(topic) {
    const topics = new Set(prefs?.topics || []);
    if (topics.has(topic)) topics.delete(topic); else topics.add(topic);
    const next = { ...(prefs || {}), topics: Array.from(topics) };
    setPrefs(next);
    await apiUpdatePreferences(next);
  }

  return (
    <>
      <div className="tiles">
        <SummaryTile title="Total Headlines" value={counts.total} delta={4} />
        <SummaryTile title="Risk" value={counts.risk} accent="secondary" delta={-2} />
        <SummaryTile title="Compliance" value={counts.comp} accent="accent" delta={8} />
        <SummaryTile title="Quality" value={counts.qa} delta={1} />
      </div>

      <div className="main-area">
        <section>
          {loading && <div className="card" style={{ padding: 16 }}>Loading articles…</div>}
          {!loading && articles.map(a => <ArticleCard key={a.id} article={a} />)}
          {!loading && articles.length === 0 && (
            <div className="card" style={{ padding: 16 }}>No articles found.</div>
          )}
        </section>
        <aside className="aside">
          <div className="card prefs">
            <h3 style={{ marginTop: 0 }}>Quick Preferences</h3>
            <div>
              {['Risk', 'Compliance', 'Quality', 'M&A', 'Independence', 'New Launches'].map(t => {
                const active = prefs?.topics?.includes(t);
                return (
                  <span key={t} className={'pill ' + (active ? 'active' : '')} onClick={() => toggleTopic(t)}>
                    {active ? '✅' : '➕'} {t}
                  </span>
                );
              })}
            </div>
            <ProtectedNote>
              Manage detailed notification settings in Preferences.
            </ProtectedNote>
          </div>

          <div className="card" style={{ padding: 16 }}>
            <h3 style={{ marginTop: 0 }}>Filter</h3>
            <div style={{ marginBottom: 8 }}>
              <label>Category</label>
              <select className="select" value={category} onChange={e => setCategory(e.target.value)}>
                {['All', 'Risk', 'Compliance', 'Quality', 'M&A', 'Independence', 'New Launches'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Search</label>
              <input className="input" placeholder="Keywords" value={q} onChange={e => setQ(e.target.value)} />
            </div>
          </div>

          <div className="card" style={{ padding: 16 }}>
            <h3 style={{ marginTop: 0 }}>Today’s Note</h3>
            <div className="footer-note">
              This is a curated digest. Click a headline to view the source article.
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
