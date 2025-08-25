import React, { useEffect, useState } from 'react';
import { apiGetPreferences, apiUpdatePreferences } from '../services/api';

// PUBLIC_INTERFACE
export default function Preferences() {
  /** Manage notification topics and email frequency. */
  const [form, setForm] = useState({ topics: [], frequency: 'daily' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { (async () => {
    const prefs = await apiGetPreferences();
    setForm(prefs);
  })(); }, []);

  function toggleTopic(topic) {
    const topics = new Set(form.topics || []);
    if (topics.has(topic)) topics.delete(topic); else topics.add(topic);
    setForm({ ...form, topics: Array.from(topics) });
  }

  async function save() {
    setSaving(true);
    try {
      await apiUpdatePreferences(form);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card" style={{ padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>Notification Preferences</h2>
      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8, color: 'var(--muted)' }}>Topics</div>
        {['Risk', 'Compliance', 'Quality', 'M&A', 'Independence', 'New Launches'].map(t => {
          const active = form.topics?.includes(t);
          return (
            <span key={t} className={'pill ' + (active ? 'active' : '')} onClick={() => toggleTopic(t)}>
              {active ? '✅' : '➕'} {t}
            </span>
          );
        })}
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8, color: 'var(--muted)' }}>Email Frequency</div>
        <select
          className="select"
          value={form.frequency}
          onChange={e => setForm({ ...form, frequency: e.target.value })}
        >
          <option value="daily">Daily</option>
          <option value="weekday">Weekdays</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>
      <button className="btn btn-primary" onClick={save} disabled={saving}>
        {saving ? 'Saving…' : 'Save Preferences'}
      </button>
    </div>
  );
}
