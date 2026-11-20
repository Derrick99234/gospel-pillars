'use client';

import { useState } from 'react';

const ROOM_TYPES = [
  'Conference Room',
  'Standard Lodge',
  'Serviced Apartment',
];

const EMPTY = {
  name: '', email: '', phone: '',
  check_in: '', check_out: '',
  room_type: '', guests: 1, message: '',
};

export default function ArkGardensBooking() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/ark-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Submission failed.');
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  }

  function handleClose() {
    setOpen(false);
    setTimeout(() => { setStatus('idle'); setForm(EMPTY); setErrorMsg(''); }, 300);
  }

  return (
    <>
      <button className="ark-book-btn" onClick={() => setOpen(true)}>
        Book Now
      </button>

      {open && (
        <div className="ark-modal-backdrop" onClick={handleClose}>
          <div className="ark-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">

            <button className="ark-modal-close" onClick={handleClose} aria-label="Close">✕</button>

            {status === 'success' ? (
              <div className="ark-modal-success">
                <div className="ark-success-icon">✓</div>
                <h3>Booking Request Sent!</h3>
                <p>Thank you, <strong>{form.name}</strong>. We've received your enquiry and will be in touch shortly.</p>
                <button className="ark-book-btn" onClick={handleClose}>Close</button>
              </div>
            ) : (
              <>
                <div className="ark-modal-header">
                  <span className="ark-modal-eyebrow">ARK GARDENS</span>
                  <h2 className="ark-modal-title">Make a Booking</h2>
                  <p className="ark-modal-sub">Fill in your details and we'll confirm your reservation.</p>
                </div>

                <form className="ark-booking-form" onSubmit={handleSubmit}>
                  <div className="ark-form-row">
                    <div className="ark-form-field">
                      <label>Full Name *</label>
                      <input type="text" required placeholder="e.g. John Adeyemi"
                        value={form.name} onChange={e => set('name', e.target.value)} />
                    </div>
                    <div className="ark-form-field">
                      <label>Phone Number *</label>
                      <input type="tel" required placeholder="+234 800 000 0000"
                        value={form.phone} onChange={e => set('phone', e.target.value)} />
                    </div>
                  </div>

                  <div className="ark-form-field">
                    <label>Email Address *</label>
                    <input type="email" required placeholder="you@example.com"
                      value={form.email} onChange={e => set('email', e.target.value)} />
                  </div>

                  <div className="ark-form-row">
                    <div className="ark-form-field">
                      <label>Check-in Date *</label>
                      <input type="date" required
                        min={new Date().toISOString().split('T')[0]}
                        value={form.check_in} onChange={e => set('check_in', e.target.value)} />
                    </div>
                    <div className="ark-form-field">
                      <label>Check-out Date *</label>
                      <input type="date" required
                        min={form.check_in || new Date().toISOString().split('T')[0]}
                        value={form.check_out} onChange={e => set('check_out', e.target.value)} />
                    </div>
                  </div>

                  <div className="ark-form-row">
                    <div className="ark-form-field">
                      <label>Room / Space Type *</label>
                      <select required value={form.room_type} onChange={e => set('room_type', e.target.value)}>
                        <option value="">Select type…</option>
                        {ROOM_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div className="ark-form-field">
                      <label>Number of Guests</label>
                      <input type="number" min="1" max="200"
                        value={form.guests} onChange={e => set('guests', e.target.value)} />
                    </div>
                  </div>

                  <div className="ark-form-field">
                    <label>Additional Requests</label>
                    <textarea rows={3} placeholder="Any special requirements or questions…"
                      value={form.message} onChange={e => set('message', e.target.value)} />
                  </div>

                  {status === 'error' && (
                    <p className="ark-form-error">{errorMsg}</p>
                  )}

                  <button type="submit" className="ark-form-submit" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Sending…' : 'Submit Booking Request'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
