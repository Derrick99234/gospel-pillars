'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Edit3,
  Send,
  LogOut,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowLeft,
  X,
  Save,
  Search,
  Building
} from 'lucide-react';

export default function SectionManagerPortal() {
  const [session, setSession] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Portal State
  const [sectionData, setSectionData] = useState(null);
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [draftCount, setDraftCount] = useState(0);
  const [pendingSubmission, setPendingSubmission] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Edit Modal State
  const [editingOutlet, setEditingOutlet] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    venue: '',
    address: '',
    city: '',
    state_or_province: '',
    country: '',
    phone_numbers: '',
    landmarks: '',
  });
  const [savingDraft, setSavingDraft] = useState(false);
  const [submittingApproval, setSubmittingApproval] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Show toast notification
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Restore session from localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem('gp_manager_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.role === 'section_manager') {
          setSession(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Fetch Section Outlets
  const fetchSectionOutlets = useCallback(async (sectionId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/manager/outlets?sectionId=${sectionId}`);
      const data = await res.json();
      if (data.success) {
        setSectionData(data.section);
        setOutlets(data.outlets || []);
        setDraftCount(data.draftCount || 0);
        setPendingSubmission(data.pendingSubmission || null);
      }
    } catch (err) {
      console.error('Error fetching section data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.section_id) {
      fetchSectionOutlets(session.section_id);
    }
  }, [session, fetchSectionOutlets]);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.success) {
        if (data.user.role === 'section_manager') {
          setSession(data.user);
          localStorage.setItem('gp_manager_session', JSON.stringify(data.user));
        } else if (data.user.role === 'super_admin') {
          // Redirect to admin
          window.location.href = '/admin';
        }
      } else {
        setLoginError(data.message || 'Invalid username or password');
      }
    } catch {
      setLoginError('An error occurred during login. Please try again.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem('gp_manager_session');
  };

  // Open Edit Modal
  const openEditModal = (outlet) => {
    setEditingOutlet(outlet);
    setEditFormData({
      name: outlet.name || '',
      venue: outlet.venue || '',
      address: outlet.address || '',
      city: outlet.city || '',
      state_or_province: outlet.state_or_province || '',
      country: outlet.country || '',
      phone_numbers: (outlet.phone_numbers || []).join(', '),
      landmarks: outlet.landmarks || '',
    });
  };

  // Save Draft
  const handleSaveDraft = async (e) => {
    e.preventDefault();
    if (!editingOutlet || !session) return;

    setSavingDraft(true);
    try {
      const phones = editFormData.phone_numbers
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);

      const payload = {
        sectionId: session.section_id,
        outletId: editingOutlet.id,
        updatedData: {
          name: editFormData.name.trim(),
          venue: editFormData.venue.trim() || null,
          address: editFormData.address.trim(),
          city: editFormData.city.trim(),
          state_or_province: editFormData.state_or_province.trim(),
          country: editFormData.country.trim(),
          phone_numbers: phones,
          landmarks: editFormData.landmarks.trim() || null,
        },
      };

      const res = await fetch('/api/manager/outlets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        showToast(`Saved draft changes for ${editFormData.name}`);
        setEditingOutlet(null);
        await fetchSectionOutlets(session.section_id);
      } else {
        alert(data.message || 'Failed to save draft');
      }
    } catch {
      alert('Error saving draft');
    } finally {
      setSavingDraft(false);
    }
  };

  // Submit All Section Drafts for Approval
  const handleSubmitForApproval = async () => {
    if (draftCount === 0) return;

    const confirmed = window.confirm(
      `Submit ${draftCount} edited location(s) to Super Admin for approval?`
    );
    if (!confirmed) return;

    setSubmittingApproval(true);
    try {
      const res = await fetch('/api/manager/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionId: session.section_id,
          submitterName: session.name,
        }),
      });
      const data = await res.json();

      if (data.success) {
        showToast('Changes submitted for Super Admin approval!');
        await fetchSectionOutlets(session.section_id);
      } else {
        alert(data.message || 'Submission failed');
      }
    } catch {
      alert('Error submitting for approval');
    } finally {
      setSubmittingApproval(false);
    }
  };

  // Filtered outlets by search query
  const displayedOutlets = outlets.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      item.name?.toLowerCase().includes(q) ||
      item.address?.toLowerCase().includes(q) ||
      item.city?.toLowerCase().includes(q) ||
      item.venue?.toLowerCase().includes(q)
    );
  });

  // Demo shortcut login helper
  const handleQuickDemoLogin = (u, p) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="portal-layout">
      {/* Top Header */}
      <header className="portal-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/" className="portal-brand">
            <Image
              src="/logo.png"
              alt="Gospel Pillars"
              width={34}
              height={34}
              style={{ objectFit: 'contain' }}
            />
            <span>Gospel Pillars</span>
          </Link>
          <span className="portal-badge">Section Manager Portal</span>
        </div>

        <div className="portal-actions">
          <Link
            href="/"
            style={{
              color: '#94a3b8',
              fontSize: '13px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <ArrowLeft size={14} /> Back to Website
          </Link>

          {session && (
            <>
              <span className="portal-user-tag">
                {session.display_name} • {session.name}
              </span>
              <button
                onClick={handleSubmitForApproval}
                disabled={draftCount === 0 || submittingApproval}
                className="portal-btn-primary"
                title={
                  draftCount > 0
                    ? `Submit ${draftCount} draft changes for Super Admin approval`
                    : 'No drafts to submit'
                }
              >
                <Send size={14} />
                <span>
                  {submittingApproval
                    ? 'Submitting...'
                    : `Submit for Approval (${draftCount})`}
                </span>
              </button>
              <button
                onClick={handleLogout}
                className="portal-btn-secondary"
                title="Log out"
              >
                <LogOut size={13} />
                <span>Log Out</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="portal-container">
        {!session ? (
          /* Login Card */
          <div className="portal-login-card">
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Building size={32} color="#0c0e1e" style={{ margin: '0 auto 8px' }} />
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>
                Section Manager Sign In
              </h2>
              <p style={{ fontSize: '13.5px', color: '#64748b', marginTop: '4px' }}>
                Sign in to manage and edit your region&apos;s church locations.
              </p>
            </div>

            {loginError && (
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                  padding: '10px 14px',
                  borderRadius: '4px',
                  fontSize: '13px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <AlertCircle size={16} />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="portal-form-group">
                <label className="portal-label">Section Username</label>
                <input
                  type="text"
                  className="portal-input"
                  placeholder="e.g. lagos, nigeria, uk"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="portal-form-group">
                <label className="portal-label">Password</label>
                <input
                  type="password"
                  className="portal-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loggingIn}
                style={{
                  width: '100%',
                  background: '#0c0e1e',
                  color: '#ffffff',
                  border: 'none',
                  padding: '11px',
                  borderRadius: '4px',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  marginTop: '8px',
                }}
              >
                {loggingIn ? 'Authenticating...' : 'Sign In to Portal'}
              </button>
            </form>

            {/* Quick Demo Credentials */}
            <div
              style={{
                marginTop: '24px',
                paddingTop: '16px',
                borderTop: '1px solid #e2e8f0',
                fontSize: '12px',
                color: '#64748b',
              }}
            >
              <span style={{ fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                Demo Credentials:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('lagos', 'lagos123')}
                  className="portal-btn-secondary"
                  style={{ fontSize: '11.5px', padding: '4px 8px' }}
                >
                  Lagos (lagos123)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('nigeria', 'nigeria123')}
                  className="portal-btn-secondary"
                  style={{ fontSize: '11.5px', padding: '4px 8px' }}
                >
                  Nigeria (nigeria123)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('uk', 'uk123')}
                  className="portal-btn-secondary"
                  style={{ fontSize: '11.5px', padding: '4px 8px' }}
                >
                  UK (uk123)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('americas', 'americas123')}
                  className="portal-btn-secondary"
                  style={{ fontSize: '11.5px', padding: '4px 8px' }}
                >
                  Americas (americas123)
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Manager One-Pager Dashboard */
          <div>
            {/* Hero / Overview Card */}
            <div className="portal-hero-card">
              <div>
                <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a' }}>
                  {sectionData?.name || session.display_name}
                </h1>
                <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
                  Section Manager: <strong>{session.name}</strong> • Total Locations:{' '}
                  <strong>{outlets.length}</strong>
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={handleSubmitForApproval}
                  disabled={draftCount === 0 || submittingApproval}
                  className="portal-btn-primary"
                  style={{ padding: '10px 18px', fontSize: '14px' }}
                >
                  <Send size={15} />
                  <span>
                    {submittingApproval
                      ? 'Submitting...'
                      : `Submit for Approval (${draftCount} Drafts)`}
                  </span>
                </button>
              </div>
            </div>

            {/* Pending Submission Banner (if awaiting super admin approval) */}
            {pendingSubmission && (
              <div className="portal-alert-pending">
                <Clock size={18} />
                <div>
                  <strong>Submission Pending Super Admin Approval:</strong> You submitted{' '}
                  {pendingSubmission.changes?.length || 0} location change(s) on{' '}
                  {new Date(pendingSubmission.submitted_at).toLocaleDateString()} at{' '}
                  {new Date(pendingSubmission.submitted_at).toLocaleTimeString()}. Changes will
                  go live on the website once approved.
                </div>
              </div>
            )}

            {/* Search within this section */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  padding: '6px 12px',
                  maxWidth: '360px',
                  width: '100%',
                }}
              >
                <Search size={16} color="#94a3b8" style={{ marginRight: '8px' }} />
                <input
                  type="text"
                  placeholder="Filter your section's locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    fontSize: '13.5px',
                    width: '100%',
                  }}
                />
              </div>

              <span style={{ fontSize: '13.5px', color: '#64748b' }}>
                Showing {displayedOutlets.length} of {outlets.length} locations
              </span>
            </div>

            {/* Outlets Grid - Simple Layout Matching Public One-Pager */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                Loading section outlets...
              </div>
            ) : (
              <div className="simple-cards-grid">
                {displayedOutlets.map((outlet) => (
                  <article
                    key={outlet.id}
                    className="simple-outlet-card"
                    style={{
                      borderColor: outlet.has_draft ? '#f59e0b' : '#e2e8f0',
                      background: outlet.has_draft ? '#fffdfa' : '#ffffff',
                    }}
                  >
                    <div className="simple-card-body">
                      {/* Draft Status Indicator */}
                      {outlet.has_draft && (
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11px',
                            fontWeight: '600',
                            color: '#b45309',
                            marginBottom: '6px',
                          }}
                        >
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: '#f59e0b',
                            }}
                          ></span>
                          Draft Modified (Ready to Submit)
                        </div>
                      )}

                      <h4 className="simple-outlet-name">{outlet.name}</h4>

                      {outlet.venue && (
                        <div className="simple-venue-text">{outlet.venue}</div>
                      )}

                      <div className="simple-address-row">
                        <MapPin size={16} className="simple-address-icon" />
                        <span>{outlet.address}</span>
                      </div>

                      {outlet.landmarks && (
                        <div className="simple-landmark-text">
                          <span>Landmark:</span> {outlet.landmarks}
                        </div>
                      )}
                    </div>

                    <div className="simple-card-footer">
                      {outlet.phone_numbers && outlet.phone_numbers.length > 0 ? (
                        <div className="simple-phones-row">
                          {outlet.phone_numbers.map((phone, pIdx) => (
                            <div key={pIdx} className="simple-phone-group">
                              <span className="simple-phone-link">
                                <Phone size={12} />
                                {phone}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                          No phone number configured
                        </span>
                      )}

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => openEditModal(outlet)}
                        className="portal-btn-secondary"
                        style={{
                          width: '100%',
                          justifyContent: 'center',
                          marginTop: '4px',
                        }}
                      >
                        <Edit3 size={13} />
                        <span>Edit Location Details</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Edit Outlet Modal */}
      {editingOutlet && (
        <div className="portal-modal-overlay">
          <div className="portal-modal-content">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
                paddingBottom: '12px',
                borderBottom: '1px solid #e2e8f0',
              }}
            >
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
                  Edit Location
                </h3>
                <span style={{ fontSize: '12.5px', color: '#64748b' }}>
                  {editingOutlet.region_category || session.display_name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setEditingOutlet(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveDraft}>
              <div className="portal-form-group">
                <label className="portal-label">Location / Branch Name *</label>
                <input
                  type="text"
                  className="portal-input"
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="portal-form-group">
                <label className="portal-label">Venue / Meeting Facility</label>
                <input
                  type="text"
                  className="portal-input"
                  placeholder="e.g. Ark of Light, Hall 2"
                  value={editFormData.venue}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, venue: e.target.value })
                  }
                />
              </div>

              <div className="portal-form-group">
                <label className="portal-label">Full Street Address *</label>
                <textarea
                  className="portal-textarea"
                  rows={2}
                  value={editFormData.address}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, address: e.target.value })
                  }
                  required
                />
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginBottom: '16px',
                }}
              >
                <div>
                  <label className="portal-label">City</label>
                  <input
                    type="text"
                    className="portal-input"
                    value={editFormData.city}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, city: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="portal-label">State / Province</label>
                  <input
                    type="text"
                    className="portal-input"
                    value={editFormData.state_or_province}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        state_or_province: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="portal-form-group">
                <label className="portal-label">Country</label>
                <input
                  type="text"
                  className="portal-input"
                  value={editFormData.country}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, country: e.target.value })
                  }
                />
              </div>

              <div className="portal-form-group">
                <label className="portal-label">
                  Phone Numbers (comma separated)
                </label>
                <input
                  type="text"
                  className="portal-input"
                  placeholder="+234 906 460 0560, +234 809 011 1194"
                  value={editFormData.phone_numbers}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      phone_numbers: e.target.value,
                    })
                  }
                />
              </div>

              <div className="portal-form-group">
                <label className="portal-label">Landmarks / Directions Note</label>
                <input
                  type="text"
                  className="portal-input"
                  placeholder="e.g. Beside Zenith Bank, opposite Total Filling Station"
                  value={editFormData.landmarks}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      landmarks: e.target.value,
                    })
                  }
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '10px',
                  marginTop: '24px',
                  paddingTop: '16px',
                  borderTop: '1px solid #e2e8f0',
                }}
              >
                <button
                  type="button"
                  onClick={() => setEditingOutlet(null)}
                  className="portal-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingDraft}
                  className="portal-btn-primary"
                >
                  <Save size={14} />
                  <span>{savingDraft ? 'Saving Draft...' : 'Save Draft Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notice">
          <CheckCircle size={16} color="#4ade80" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
