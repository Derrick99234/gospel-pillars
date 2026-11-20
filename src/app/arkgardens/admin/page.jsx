'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

const STATUS_COLORS = {
  pending:   { bg: '#fef9c3', color: '#854d0e' },
  confirmed: { bg: '#dcfce7', color: '#166534' },
  cancelled: { bg: '#fee2e2', color: '#991b1b' },
};

export default function ArkGardensAdmin() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  async function handleLogin(e) {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError('');

    const res = await fetch('/api/ark-bookings', {
      headers: { 'x-admin-token': password },
    });

    if (res.ok) {
      setToken(password);
    } else {
      setLoginError('Incorrect password.');
    }
    setLoggingIn(false);
  }

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError('');
    const res = await fetch('/api/ark-bookings', {
      headers: { 'x-admin-token': token },
    });
    const data = await res.json();
    if (data.success) setBookings(data.bookings);
    else setError('Failed to load bookings.');
    setLoading(false);
  }, [token]);

  useEffect(() => {
    if (token) fetchBookings();
  }, [token, fetchBookings]);

  async function deleteBooking(id) {
    if (!confirm('Delete this booking?')) return;
    await fetch(`/api/ark-bookings/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': token },
    });
    setBookings(b => b.filter(x => x.id !== id));
  }

  async function updateStatus(id, status) {
    const res = await fetch(`/api/ark-bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.success) {
      setBookings(b => b.map(x => x.id === id ? { ...x, status } : x));
    }
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  if (!token) {
    return (
      <main className="ark-admin-page">
        <div className="ark-admin-login-wrap">
          <Image src="/arkgardens/ark-gardens-logo.jpg" alt="Ark Gardens" width={140} height={140} style={{ objectFit: 'contain' }} />
          <h1 className="ark-admin-login-title">Bookings Admin</h1>
          <form className="ark-admin-login-form" onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoFocus
            />
            {loginError && <p className="ark-admin-error">{loginError}</p>}
            <button type="submit" disabled={loggingIn}>
              {loggingIn ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="ark-admin-page ark-admin-dash">
      {/* Header */}
      <div className="ark-admin-topbar">
        <div className="ark-admin-topbar-left">
          <Image src="/arkgardens/ark-gardens-logo.jpg" alt="Ark Gardens" width={48} height={48} style={{ objectFit: 'contain' }} />
          <div>
            <h1 className="ark-admin-dash-title">Bookings</h1>
            <p className="ark-admin-dash-sub">Ark Gardens · {bookings.length} total</p>
          </div>
        </div>
        <div className="ark-admin-topbar-right">
          <button className="ark-admin-refresh" onClick={fetchBookings}>↻ Refresh</button>
          <button className="ark-admin-logout" onClick={() => setToken('')}>Sign Out</button>
        </div>
      </div>

      {/* Stats */}
      <div className="ark-admin-stats">
        {['all', 'pending', 'confirmed', 'cancelled'].map(s => (
          <button
            key={s}
            className={`ark-admin-stat${filter === s ? ' active' : ''}`}
            onClick={() => setFilter(s)}
          >
            <span className="ark-stat-num">
              {s === 'all' ? bookings.length : bookings.filter(b => b.status === s).length}
            </span>
            <span className="ark-stat-label">{s.charAt(0).toUpperCase() + s.slice(1)}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <p className="ark-admin-info">Loading bookings…</p>
      ) : error ? (
        <p className="ark-admin-error">{error}</p>
      ) : filtered.length === 0 ? (
        <p className="ark-admin-info">No bookings yet.</p>
      ) : (
        <div className="ark-admin-table-wrap">
          <table className="ark-admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Room / Space</th>
                <th>Dates</th>
                <th>Guests</th>
                <th>Message</th>
                <th>Status</th>
                <th>Actions</th>
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
                    <span>{b.email}</span>
                    <span className="ark-cell-sub">{b.phone}</span>
                  </td>
                  <td>{b.room_type}</td>
                  <td>
                    <span>{b.check_in}</span>
                    <span className="ark-cell-sub">→ {b.check_out}</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>{b.guests}</td>
                  <td className="ark-cell-message">{b.message || '—'}</td>
                  <td>
                    <select
                      className="ark-status-select"
                      value={b.status}
                      style={STATUS_COLORS[b.status] || {}}
                      onChange={e => updateStatus(b.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <button className="ark-delete-btn" onClick={() => deleteBooking(b.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
