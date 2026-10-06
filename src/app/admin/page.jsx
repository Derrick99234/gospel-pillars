'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Shield,
  Check,
  X,
  Plus,
  Key,
  Users,
  Clock,
  ArrowLeft,
  LogOut,
  AlertCircle,
  Eye,
  EyeOff,
  Building,
  RefreshCw,
  FileCheck
} from 'lucide-react';

export default function AdminPortal() {
  const [session, setSession] = useState(null);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Admin Dashboard State
  const [activeTab, setActiveTab] = useState('submissions'); // 'submissions' | 'sections'
  const [submissions, setSubmissions] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [reviewNotes, setReviewNotes] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  // New Section Modal State
  const [showNewSectionModal, setShowNewSectionModal] = useState(false);
  const [newSectionData, setNewSectionData] = useState({
    name: '',
    display_name: '',
    manager_name: '',
    manager_username: '',
    manager_password: '',
  });
  const [creatingSection, setCreatingSection] = useState(false);

  // Edit Section Modal State
  const [editingSection, setEditingSection] = useState(null);
  const [editSecData, setEditSecData] = useState({
    display_name: '',
    manager_name: '',
    manager_username: '',
    manager_password: '',
  });
  const [updatingSection, setUpdatingSection] = useState(false);
  const [showPassword, setShowPassword] = useState({});

  // Show Toast
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Restore session
  useEffect(() => {
    const saved = localStorage.getItem('gp_admin_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.role === 'super_admin') {
          setSession(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Fetch Submissions
  const fetchSubmissions = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/submissions');
      const data = await res.json();
      if (data.success) {
        setSubmissions(data.submissions || []);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Fetch Sections
  const fetchSections = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/sections');
      const data = await res.json();
      if (data.success) {
        setSections(data.sections || []);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchSubmissions(), fetchSections()]);
    setLoading(false);
  }, [fetchSubmissions, fetchSections]);

  useEffect(() => {
    if (session) {
      refreshAll();
    }
  }, [session, refreshAll]);

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

      if (data.success && data.user.role === 'super_admin') {
        setSession(data.user);
        localStorage.setItem('gp_admin_session', JSON.stringify(data.user));
      } else {
        setLoginError(data.message || 'Access denied. Super Admin credentials required.');
      }
    } catch {
      setLoginError('Error connecting to authentication service.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem('gp_admin_session');
  };

  // Approve / Reject Submission
  const handleReviewSubmission = async (submissionId, action) => {
    const actionLabel = action === 'approve' ? 'Approve & Publish Live' : 'Reject';
    const confirmed = window.confirm(`Are you sure you want to ${actionLabel} this submission?`);
    if (!confirmed) return;

    setActionLoadingId(submissionId);
    try {
      const res = await fetch('/api/admin/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission_id: submissionId,
          action,
          notes: reviewNotes[submissionId] || '',
          admin_name: session.name || 'Super Admin',
        }),
      });
      const data = await res.json();

      if (data.success) {
        showToast(data.message);
        await refreshAll();
      } else {
        alert(data.message || 'Action failed');
      }
    } catch {
      alert('Error updating submission');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Create Section
  const handleCreateSection = async (e) => {
    e.preventDefault();
    setCreatingSection(true);

    try {
      const res = await fetch('/api/admin/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSectionData),
      });
      const data = await res.json();

      if (data.success) {
        showToast(data.message);
        setShowNewSectionModal(false);
        setNewSectionData({
          name: '',
          display_name: '',
          manager_name: '',
          manager_username: '',
          manager_password: '',
        });
        await fetchSections();
      } else {
        alert(data.message || 'Failed to create section');
      }
    } catch {
      alert('Error creating section');
    } finally {
      setCreatingSection(false);
    }
  };

  // Update Section
  const handleUpdateSection = async (e) => {
    e.preventDefault();
    if (!editingSection) return;

    setUpdatingSection(true);
    try {
      const res = await fetch('/api/admin/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingSection.id,
          ...editSecData,
        }),
      });
      const data = await res.json();

      if (data.success) {
        showToast('Section credentials updated successfully!');
        setEditingSection(null);
        await fetchSections();
      } else {
        alert(data.message || 'Failed to update section');
      }
    } catch {
      alert('Error updating section');
    } finally {
      setUpdatingSection(false);
    }
  };

  const pendingSubmissions = submissions.filter((s) => s.status === 'pending');
  const pastSubmissions = submissions.filter((s) => s.status !== 'pending');

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
          <span
            className="portal-badge"
            style={{ background: '#312e81', color: '#e0e7ff' }}
          >
            Super Admin Control Center
          </span>
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
                <Shield size={13} style={{ display: 'inline', marginRight: '4px' }} />
                {session.name}
              </span>
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

      {/* Main Container */}
      <main className="portal-container">
        {!session ? (
          /* Admin Sign In */
          <div className="portal-login-card">
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Shield size={36} color="#312e81" style={{ margin: '0 auto 8px' }} />
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>
                Super Admin Sign In
              </h2>
              <p style={{ fontSize: '13.5px', color: '#64748b', marginTop: '4px' }}>
                Review pending location updates, manage sections, and generate logins.
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
                <label className="portal-label">Admin Username</label>
                <input
                  type="text"
                  className="portal-input"
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
                  placeholder="adminpassword"
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
                {loggingIn ? 'Authenticating...' : 'Sign In as Super Admin'}
              </button>
            </form>

            <div
              style={{
                marginTop: '20px',
                paddingTop: '14px',
                borderTop: '1px solid #e2e8f0',
                fontSize: '12px',
                color: '#64748b',
                textAlign: 'center',
              }}
            >
              Default credentials: <strong>admin</strong> / <strong>adminpassword</strong>
            </div>
          </div>
        ) : (
          /* Admin Dashboard */
          <div>
            {/* Navigation Tabs Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                marginBottom: '24px',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '12px',
              }}
            >
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('submissions')}
                  style={{
                    background: activeTab === 'submissions' ? '#0c0e1e' : 'transparent',
                    color: activeTab === 'submissions' ? '#ffffff' : '#475569',
                    border: '1px solid',
                    borderColor: activeTab === 'submissions' ? '#0c0e1e' : '#cbd5e1',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    fontSize: '13.5px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <FileCheck size={16} />
                  <span>Pending Approvals</span>
                  {pendingSubmissions.length > 0 && (
                    <span
                      style={{
                        background: '#dc2626',
                        color: '#ffffff',
                        fontSize: '11px',
                        padding: '1px 6px',
                        borderRadius: '999px',
                        fontWeight: '700',
                      }}
                    >
                      {pendingSubmissions.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('sections')}
                  style={{
                    background: activeTab === 'sections' ? '#0c0e1e' : 'transparent',
                    color: activeTab === 'sections' ? '#ffffff' : '#475569',
                    border: '1px solid',
                    borderColor: activeTab === 'sections' ? '#0c0e1e' : '#cbd5e1',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    fontSize: '13.5px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Users size={16} />
                  <span>Manage Sections & Logins ({sections.length})</span>
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  onClick={refreshAll}
                  className="portal-btn-secondary"
                  title="Refresh data"
                >
                  <RefreshCw size={13} />
                  <span>Refresh</span>
                </button>

                {activeTab === 'sections' && (
                  <button
                    type="button"
                    onClick={() => setShowNewSectionModal(true)}
                    className="portal-btn-primary"
                  >
                    <Plus size={15} />
                    <span>Add New Section & Login</span>
                  </button>
                )}
              </div>
            </div>

            {/* TAB 1: SUBMISSIONS & APPROVALS */}
            {activeTab === 'submissions' && (
              <div>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                    Loading pending submissions...
                  </div>
                ) : pendingSubmissions.length === 0 ? (
                  <div
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '60px 20px',
                      textAlign: 'center',
                      color: '#64748b',
                    }}
                  >
                    <Check
                      size={40}
                      color="#16a34a"
                      style={{ margin: '0 auto 12px' }}
                    />
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
                      All caught up! No pending submissions.
                    </h3>
                    <p style={{ fontSize: '14px', marginTop: '4px' }}>
                      When a Section Manager edits their locations and submits for approval,
                      they will appear here with full change diffs for your review.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {pendingSubmissions.map((sub) => (
                      <div
                        key={sub.id}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          padding: '24px',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                        }}
                      >
                        {/* Header of submission */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '12px',
                            borderBottom: '1px solid #e2e8f0',
                            paddingBottom: '16px',
                            marginBottom: '16px',
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
                                {sub.display_name} Submission
                              </h3>
                              <span
                                style={{
                                  background: '#fef3c7',
                                  color: '#b45309',
                                  fontSize: '11px',
                                  fontWeight: '700',
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  textTransform: 'uppercase',
                                }}
                              >
                                Pending Review
                              </span>
                            </div>
                            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                              Submitted by <strong>{sub.submitted_by}</strong> on{' '}
                              {new Date(sub.submitted_at).toLocaleDateString()} at{' '}
                              {new Date(sub.submitted_at).toLocaleTimeString()} •{' '}
                              <strong>{sub.changes?.length || 0}</strong> location(s) modified
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                              type="button"
                              onClick={() => handleReviewSubmission(sub.id, 'reject')}
                              disabled={actionLoadingId === sub.id}
                              className="portal-btn-danger"
                            >
                              <X size={14} />
                              <span>Reject</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReviewSubmission(sub.id, 'approve')}
                              disabled={actionLoadingId === sub.id}
                              className="portal-btn-primary"
                              style={{ padding: '8px 18px' }}
                            >
                              <Check size={15} />
                              <span>
                                {actionLoadingId === sub.id
                                  ? 'Processing...'
                                  : 'Approve & Publish Live'}
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* Changes Diff List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#334155' }}>
                            Requested Changes:
                          </h4>

                          {sub.changes?.map((ch, idx) => (
                            <div key={idx} className="portal-diff-box">
                              <h5
                                style={{
                                  fontSize: '15px',
                                  fontWeight: '700',
                                  color: '#0f172a',
                                  marginBottom: '10px',
                                }}
                              >
                                {ch.outlet_name}
                              </h5>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <div
                                  className="portal-diff-row"
                                  style={{
                                    fontWeight: '600',
                                    color: '#64748b',
                                    borderBottom: '2px solid #e2e8f0',
                                    paddingBottom: '4px',
                                  }}
                                >
                                  <span>Field</span>
                                  <span>Current Live Value</span>
                                  <span>Submitted New Value</span>
                                </div>

                                {ch.diff_fields && ch.diff_fields.length > 0 ? (
                                  ch.diff_fields.map((df, dIdx) => (
                                    <div key={dIdx} className="portal-diff-row">
                                      <span
                                        style={{
                                          fontWeight: '600',
                                          color: '#475569',
                                          textTransform: 'capitalize',
                                        }}
                                      >
                                        {df.field.replace(/_/g, ' ')}
                                      </span>
                                      <span
                                        style={{
                                          color: '#64748b',
                                          textDecoration: 'line-through',
                                          background: '#fef2f2',
                                          padding: '2px 6px',
                                          borderRadius: '3px',
                                        }}
                                      >
                                        {Array.isArray(df.old_value)
                                          ? df.old_value.join(', ') || '(none)'
                                          : df.old_value || '(empty)'}
                                      </span>
                                      <span
                                        style={{
                                          color: '#16a34a',
                                          fontWeight: '600',
                                          background: '#f0fdf4',
                                          padding: '2px 6px',
                                          borderRadius: '3px',
                                        }}
                                      >
                                        {Array.isArray(df.new_value)
                                          ? df.new_value.join(', ') || '(none)'
                                          : df.new_value || '(empty)'}
                                      </span>
                                    </div>
                                  ))
                                ) : (
                                  <div style={{ fontSize: '13px', color: '#64748b', padding: '6px 0' }}>
                                    Full location record updated
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Review Notes Input */}
                        <div style={{ marginTop: '16px' }}>
                          <input
                            type="text"
                            placeholder="Optional admin note (e.g. Verified by Secretariat)..."
                            className="portal-input"
                            value={reviewNotes[sub.id] || ''}
                            onChange={(e) =>
                              setReviewNotes({
                                ...reviewNotes,
                                [sub.id]: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Past Approvals / Rejections History */}
                {pastSubmissions.length > 0 && (
                  <div style={{ marginTop: '48px' }}>
                    <h3
                      style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#475569',
                        marginBottom: '16px',
                      }}
                    >
                      Past Submissions Archive ({pastSubmissions.length})
                    </h3>
                    <div
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        overflow: 'hidden',
                      }}
                    >
                      {pastSubmissions.map((ps) => (
                        <div
                          key={ps.id}
                          style={{
                            padding: '14px 20px',
                            borderBottom: '1px solid #f1f5f9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '12px',
                            fontSize: '13.5px',
                          }}
                        >
                          <div>
                            <strong>{ps.display_name}</strong> •{' '}
                            <span style={{ color: '#64748b' }}>
                              {ps.changes?.length || 0} location(s)
                            </span>{' '}
                            • Submitter: {ps.submitted_by}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span
                              style={{
                                background: ps.status === 'approved' ? '#dcfce7' : '#fee2e2',
                                color: ps.status === 'approved' ? '#15803d' : '#991b1b',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '11.5px',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                              }}
                            >
                              {ps.status}
                            </span>
                            <span style={{ color: '#94a3b8', fontSize: '12px' }}>
                              {new Date(ps.reviewed_at || ps.submitted_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: SECTIONS & MANAGER LOGINS */}
            {activeTab === 'sections' && (
              <div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                    gap: '18px',
                  }}
                >
                  {sections.map((sec) => (
                    <div
                      key={sec.id}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '10px',
                          }}
                        >
                          <h4 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a' }}>
                            {sec.display_name}
                          </h4>
                          <span
                            style={{
                              fontSize: '12px',
                              background: '#f1f5f9',
                              color: '#334155',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontWeight: '600',
                            }}
                          >
                            {sec.outletCount || 0} Locations
                          </span>
                        </div>

                        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '14px' }}>
                          {sec.name}
                        </p>

                        <div
                          style={{
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            padding: '12px',
                            fontSize: '13px',
                          }}
                        >
                          <div style={{ marginBottom: '6px' }}>
                            <span style={{ color: '#64748b' }}>Coordinator:</span>{' '}
                            <strong>{sec.manager?.name || 'Section Coordinator'}</strong>
                          </div>
                          <div style={{ marginBottom: '6px' }}>
                            <span style={{ color: '#64748b' }}>Login Username:</span>{' '}
                            <code style={{ background: '#e2e8f0', padding: '1px 5px', borderRadius: '3px' }}>
                              {sec.manager?.username}
                            </code>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#64748b' }}>Password:</span>{' '}
                            <code style={{ background: '#e2e8f0', padding: '1px 5px', borderRadius: '3px' }}>
                              {showPassword[sec.id] ? sec.manager?.password : '••••••••'}
                            </code>
                            <button
                              type="button"
                              onClick={() =>
                                setShowPassword({
                                  ...showPassword,
                                  [sec.id]: !showPassword[sec.id],
                                })
                              }
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#64748b',
                                display: 'inline-flex',
                              }}
                              title={showPassword[sec.id] ? 'Hide password' : 'Show password'}
                            >
                              {showPassword[sec.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSection(sec);
                            setEditSecData({
                              display_name: sec.display_name || '',
                              manager_name: sec.manager?.name || '',
                              manager_username: sec.manager?.username || '',
                              manager_password: sec.manager?.password || '',
                            });
                          }}
                          className="portal-btn-secondary"
                          style={{ width: '100%', justifyContent: 'center' }}
                        >
                          <Key size={13} />
                          <span>Edit Manager Credentials</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* CREATE NEW SECTION MODAL */}
      {showNewSectionModal && (
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
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
                Create New Section & Manager Login
              </h3>
              <button
                type="button"
                onClick={() => setShowNewSectionModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSection}>
              <div className="portal-form-group">
                <label className="portal-label">Section Full Heading Name *</label>
                <input
                  type="text"
                  className="portal-input"
                  placeholder="e.g. Australia and Oceania Branches"
                  value={newSectionData.name}
                  onChange={(e) =>
                    setNewSectionData({
                      ...newSectionData,
                      name: e.target.value,
                      display_name: newSectionData.display_name || e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="portal-form-group">
                <label className="portal-label">Display Name / Short Label *</label>
                <input
                  type="text"
                  className="portal-input"
                  placeholder="e.g. Australia & Oceania"
                  value={newSectionData.display_name}
                  onChange={(e) =>
                    setNewSectionData({
                      ...newSectionData,
                      display_name: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="portal-form-group">
                <label className="portal-label">Manager / Coordinator Name</label>
                <input
                  type="text"
                  className="portal-input"
                  placeholder="e.g. Pastor John Doe"
                  value={newSectionData.manager_name}
                  onChange={(e) =>
                    setNewSectionData({
                      ...newSectionData,
                      manager_name: e.target.value,
                    })
                  }
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
                  <label className="portal-label">Manager Username *</label>
                  <input
                    type="text"
                    className="portal-input"
                    placeholder="e.g. australia"
                    value={newSectionData.manager_username}
                    onChange={(e) =>
                      setNewSectionData({
                        ...newSectionData,
                        manager_username: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="portal-label">Password *</label>
                  <input
                    type="text"
                    className="portal-input"
                    placeholder="e.g. aussie123"
                    value={newSectionData.manager_password}
                    onChange={(e) =>
                      setNewSectionData({
                        ...newSectionData,
                        manager_password: e.target.value,
                      })
                    }
                    required
                  />
                </div>
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
                  onClick={() => setShowNewSectionModal(false)}
                  className="portal-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingSection}
                  className="portal-btn-primary"
                >
                  <Plus size={14} />
                  <span>{creatingSection ? 'Creating...' : 'Create Section & Login'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT SECTION MODAL */}
      {editingSection && (
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
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
                Edit Section Manager Credentials
              </h3>
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateSection}>
              <div className="portal-form-group">
                <label className="portal-label">Display Name</label>
                <input
                  type="text"
                  className="portal-input"
                  value={editSecData.display_name}
                  onChange={(e) =>
                    setEditSecData({ ...editSecData, display_name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="portal-form-group">
                <label className="portal-label">Coordinator Name</label>
                <input
                  type="text"
                  className="portal-input"
                  value={editSecData.manager_name}
                  onChange={(e) =>
                    setEditSecData({ ...editSecData, manager_name: e.target.value })
                  }
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
                  <label className="portal-label">Username</label>
                  <input
                    type="text"
                    className="portal-input"
                    value={editSecData.manager_username}
                    onChange={(e) =>
                      setEditSecData({
                        ...editSecData,
                        manager_username: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="portal-label">New Password</label>
                  <input
                    type="text"
                    className="portal-input"
                    value={editSecData.manager_password}
                    onChange={(e) =>
                      setEditSecData({
                        ...editSecData,
                        manager_password: e.target.value,
                      })
                    }
                    required
                  />
                </div>
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
                  onClick={() => setEditingSection(null)}
                  className="portal-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingSection}
                  className="portal-btn-primary"
                >
                  <Check size={14} />
                  <span>{updatingSection ? 'Saving...' : 'Update Credentials'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notice">
          <Check size={16} color="#4ade80" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
