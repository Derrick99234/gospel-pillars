'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

const STATUS = {
  pending:   { label: 'Pending',   bg: '#fef3c7', color: '#92400e', dot: '#f59e0b' },
  confirmed: { label: 'Confirmed', bg: '#d1fae5', color: '#065f46', dot: '#10b981' },
  cancelled: { label: 'Cancelled', bg: '#fee2e2', color: '#991b1b', dot: '#ef4444' },
};

function StatusBadge({ value }) {
  const s = STATUS[value] || STATUS.pending;
  return (
    <span style={{ background: s.bg, color: s.color, display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.dot, display: 'inline-block' }} />
      {s.label}
    </span>
  );
}

function BookingCard({ b, onDelete, onStatus }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="ark-bcard">
      <div className="ark-bcard-top" onClick={() => setExpanded(e => !e)}>
        <div className="ark-bcard-left">
          <div className="ark-bcard-avatar">{b.name.charAt(0).toUpperCase()}</div>
          <div>
            <p className="ark-bcard-name">{b.name}</p>
            <p className="ark-bcard-room">{b.room_type}</p>
          </div>
        </div>
        <div className="ark-bcard-right">
          <StatusBadge value={b.status} />
          <span className="ark-bcard-chevron">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {expanded && (
        <div className="ark-bcard-body">
          <div className="ark-bcard-grid">
            <div className="ark-bcard-field">
              <span className="ark-bcard-label">Email</span>
              <span>{b.email}</span>
            </div>
            <div className="ark-bcard-field">
              <span className="ark-bcard-label">Phone</span>
              <span>{b.phone}</span>
            </div>
            <div className="ark-bcard-field">
              <span className="ark-bcard-label">Check-in</span>
              <span>{b.check_in}</span>
            </div>
            <div className="ark-bcard-field">
              <span className="ark-bcard-label">Check-out</span>
              <span>{b.check_out}</span>
            </div>
            <div className="ark-bcard-field">
              <span className="ark-bcard-label">Guests</span>
              <span>{b.guests}</span>
            </div>
            <div className="ark-bcard-field">
              <span className="ark-bcard-label">Submitted</span>
              <span>{new Date(b.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            {b.message && (
              <div className="ark-bcard-field ark-bcard-field--full">
                <span className="ark-bcard-label">Message</span>
                <span>{b.message}</span>
              </div>
            )}
          </div>

          <div className="ark-bcard-actions">
            <select
              className="ark-bcard-status-select"
              value={b.status}
              onChange={e => onStatus(b.id, e.target.value)}
            >
              <option value="pending">Mark Pending</option>
              <option value="confirmed">Mark Confirmed</option>
              <option value="cancelled">Mark Cancelled</option>
            </select>
            <button className="ark-bcard-delete" onClick={() => onDelete(b.id)}>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ArkGardensAdmin() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState('cards'); // cards | table

  async function handleLogin(e) {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError('');
    const res = await fetch('/api/ark-bookings', { headers: { 'x-admin-token': password } });
    if (res.ok) { setToken(password); }
    else { setLoginError('Incorrect password.'); }
    setLoggingIn(false);
  }

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/ark-bookings', { headers: { 'x-admin-token': token } });
    const data = await res.json();
    if (data.success) setBookings(data.bookings);
    setLoading(false);
  }, [token]);

  useEffect(() => { if (token) fetchBookings(); }, [token, fetchBookings]);

  async function deleteBooking(id) {
    if (!confirm('Delete this booking? This cannot be undone.')) return;
    await fetch(`/api/ark-bookings/${id}`, { method: 'DELETE', headers: { 'x-admin-token': token } });
    setBookings(b => b.filter(x => x.id !== id));
  }

  async function updateStatus(id, status) {
    const res = await fetch(`/api/ark-bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.success) setBookings(b => b.map(x => x.id === id ? { ...x, status } : x));
  }

  const counts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  // ── LOGIN ──────────────────────────────────────────────────────
  if (!token) {
    return (
      <main className="ark-adm-login-page">
        <div className="ark-adm-login-card">
          <Image src="/arkgardens/ark-gardens-logo.jpg" alt="Ark Gardens" width={100} height={100} style={{ objectFit: 'contain' }} priority />
          <h1 className="ark-adm-login-heading">Admin Portal</h1>
          <p className="ark-adm-login-sub">Ark Gardens · Bookings Management</p>
          <form className="ark-adm-login-form" onSubmit={handleLogin}>
            <div className="ark-adm-input-wrap">
              <span className="ark-adm-input-icon">🔒</span>
              <input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoFocus
              />
            </div>
            {loginError && <p className="ark-adm-login-error">{loginError}</p>}
            <button type="submit" className="ark-adm-login-btn" disabled={loggingIn}>
              {loggingIn ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  // ── DASHBOARD ─────────────────────────────────────────────────
  return (
    <main className="ark-adm-dash">

      {/* Top bar */}
      <header className="ark-adm-header">
        <div className="ark-adm-header-brand">
          <Image src="/arkgardens/ark-gardens-logo.jpg" alt="Ark Gardens" width={40} height={40} style={{ objectFit: 'contain' }} />
          <div>
            <p className="ark-adm-header-title">Bookings</p>
            <p className="ark-adm-header-sub">Ark Gardens Admin</p>
          </div>
        </div>
        <div className="ark-adm-header-actions">
          <button className="ark-adm-icon-btn" onClick={fetchBookings} title="Refresh">↻</button>
          <button className="ark-adm-signout" onClick={() => setToken('')}>Sign out</button>
        </div>
      </header>

      {/* Stats */}
      <div className="ark-adm-stats">
        {[
          { key: 'all',       label: 'Total',     color: '#d4af37' },
          { key: 'pending',   label: 'Pending',   color: '#f59e0b' },
          { key: 'confirmed', label: 'Confirmed', color: '#10b981' },
          { key: 'cancelled', label: 'Cancelled', color: '#ef4444' },
        ].map(({ key, label, color }) => (
          <button key={key} className={`ark-adm-stat${filter === key ? ' ark-adm-stat--active' : ''}`}
            style={filter === key ? { borderColor: color } : {}}
            onClick={() => setFilter(key)}
          >
            <span className="ark-adm-stat-num" style={filter === key ? { color } : {}}>{counts[key]}</span>
            <span className="ark-adm-stat-label">{label}</span>
          </button>
        ))}
      </div>

      {/* View toggle */}
      <div className="ark-adm-toolbar">
        <p className="ark-adm-toolbar-count">{filtered.length} booking{filtered.length !== 1 ? 's' : ''}</p>
        <div className="ark-adm-view-toggle">
          <button className={view === 'cards' ? 'active' : ''} onClick={() => setView('cards')}>Cards</button>
          <button className={view === 'table' ? 'active' : ''} onClick={() => setView('table')}>Table</button>
        </div>
      </div>

      {/* Content */}
      <div className="ark-adm-content">
        {loading ? (
          <div className="ark-adm-empty">Loading bookings…</div>
        ) : filtered.length === 0 ? (
          <div className="ark-adm-empty">No {filter === 'all' ? '' : filter} bookings yet.</div>
        ) : view === 'cards' ? (
          <div className="ark-adm-cards">
            {filtered.map(b => (
              <BookingCard key={b.id} b={b} onDelete={deleteBooking} onStatus={updateStatus} />
            ))}
          </div>
        ) : (
          <div className="ark-adm-table-scroll">
            <table className="ark-adm-table">
              <thead>
                <tr>
                  <th>Name</th><th>Contact</th><th>Room / Space</th>
                  <th>Dates</th><th>Guests</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => (
                  <tr key={b.id}>
                    <td>
                      <strong>{b.name}</strong>
                      <span className="ark-cell-sub">{new Date(b.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </td>
                    <td>
                      {b.email}
                      <span className="ark-cell-sub">{b.phone}</span>
                    </td>
                    <td>{b.room_type}</td>
                    <td>
                      {b.check_in}
                      <span className="ark-cell-sub">→ {b.check_out}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>{b.guests}</td>
                    <td>
                      <select className="ark-bcard-status-select" value={b.status}
                        onChange={e => updateStatus(b.id, e.target.value)}>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <button className="ark-bcard-delete" onClick={() => deleteBooking(b.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
