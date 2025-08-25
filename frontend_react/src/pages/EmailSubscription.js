import React, { useEffect, useState } from 'react';
import { apiGetPreferences, apiUpdateSubscription } from '../services/api';

// PUBLIC_INTERFACE
export default function EmailSubscription() {
  /** Manage user's email subscription address and status. */
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { (async () => {
    const prefs = await apiGetPreferences();
    setEmail(prefs.email || '');
    setSubscribed(!!prefs.subscribed);
  })(); }, []);

  async function save() {
    setSaving(true);
    try {
      await apiUpdateSubscription({ email, subscribed });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card" style={{ padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>Email Subscription</h2>
      <div style={{ marginBottom: 12 }}>
        <label>Email address</label>
        <input className="input" type="email" placeholder="you@firm.com" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>
          <input type="checkbox" checked={subscribed} onChange={e => setSubscribed(e.target.checked)} style={{ marginRight: 8 }} />
          Receive daily digest via email
        </label>
      </div>
      <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save Settings'}</button>
      <div className="footer-note" style={{ marginTop: 12 }}>
        You can unsubscribe anytime using the link in the email footer.
      </div>
    </div>
  );
}
