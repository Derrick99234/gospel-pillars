import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Image from 'next/image';
import HebronGallery from '../../components/HebronGallery';

export const metadata = {
  title: 'The Hebron – Gospel Pillars Church Lekki | Lagos HQ',
  description:
    'Gospel Pillars Church Lekki – The Hebron is the Lagos Headquarters of Gospel Pillars International Churches, located at 180 Freedom Way, Lekki Phase 1, Lagos.',
  openGraph: {
    title: 'The Hebron – Gospel Pillars Church Lekki',
    description:
      'The Lagos Headquarters of Gospel Pillars International Churches. Vibrant, non-denominational, multicultural – over 100 branches across five continents.',
    url: 'https://gospelpillars.org/thehebron',
    siteName: "Gospel Pillars Int'l Church",
  },
};

export default function TheHebronPage() {
  return (
    <main className="hebron-page">
      <Header />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="hebron-hero">
        {/* Full Building Background Image */}
        <div className="hebron-hero-bg-wrap" aria-hidden="true">
          <Image
            src="/hebron/The Hebron Gospel Pillars Church.webp"
            alt="The Hebron Gospel Pillars Church Lekki building"
            fill
            priority
            quality={95}
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
            className="hebron-hero-bg-img"
          />
          <div className="hebron-hero-overlay" />
        </div>

        {/* Content Container */}
        <div className="hebron-hero-inner">
          <div className="hebron-hero-text">
            <h1 className="hebron-hero-title">
              Gospel Pillars<br />Church Lekki
            </h1>
            <p className="hebron-hero-sub">Lagos Headquarters</p>
            <div className="hebron-hero-accent-line" aria-hidden="true" />
            <p className="hebron-hero-address">180 Freedom Way, Lekki Phase 1, Lagos, Nigeria</p>

            <div className="hebron-hero-actions">
              <a href="#services" className="hebron-btn-primary">
                Join Us This Sunday
              </a>
              <a href="#services" className="hebron-btn-secondary">
                Service Times: 8am &amp; 9:30am
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────────── */}
      <section className="hebron-about">
        <div className="hebron-about-header">
          <span className="hebron-about-eyebrow">ABOUT</span>
          <h2 className="hebron-about-title">THE HEBRON</h2>
          <div className="hebron-about-accent" aria-hidden="true" />
        </div>

        <div className="hebron-about-card">
          <div className="hebron-about-img-wrap">
            <Image
              src="/hebron/The Hebron Gospel Pillars Church.webp"
              alt="The Hebron Gospel Pillars Church"
              fill
              sizes="(max-width: 768px) 100vw, 320px"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="hebron-about-text">
            <p>
              Gospel Pillars Church Lekki – <strong>The Hebron</strong>, is the Headquarters of Gospel Pillars Churches in Lagos, Nigeria.
            </p>
          </div>
        </div>
      </section>

      {/* ── INFO GRID ────────────────────────────────────────── */}
      <section className="hebron-info-grid">

        {/* Location */}
        <div className="hebron-info-card">
          <div className="hebron-info-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <h3 className="hebron-info-label">Location</h3>
          <p className="hebron-info-body">
            The Hebron is situated at 180 Freedom Way, after Renee Supermarket, Off Admiralty Way, Lekki Phase 1, Lagos, Nigeria.
          </p>
          <a
            href="https://maps.google.com/?q=180+Freedom+Way+Lekki+Phase+1+Lagos"
            target="_blank"
            rel="noopener noreferrer"
            className="hebron-directions-btn"
          >
            Get Directions ↗
          </a>
        </div>

        {/* Founding & Role */}
        <div className="hebron-info-card">
          <div className="hebron-info-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <h3 className="hebron-info-label">Founding &amp; Role</h3>
          <p className="hebron-info-body">
            Founded in <strong>March 2026</strong>, it is lead Church of the twelve Gospel Pillars Churches in Lagos, (including Gospel Pillars Church Ikeja that meets in the H4 Auditorium of the Ark of Light for all Nations). The Hebron is positioned as a major worship and revival center serving the Lekki, Victoria Island, Ikoyi and wider Lagos Island communities.
          </p>
        </div>

        {/* Leadership */}
        <div className="hebron-info-card">
          <div className="hebron-info-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div>
          <h3 className="hebron-info-label">Leadership</h3>
          <p className="hebron-info-body">
            The Church is led by <strong>Prophet Isaiah Macwealth</strong> and <strong>Prophetess Lily Anita</strong> and a network of pastors, elders, deacons and a vibrant workforce that are driven by a passion for Jesus.
          </p>
        </div>

      </section>

      {/* ── SERVICE TIMES ────────────────────────────────────── */}
      <section className="hebron-services">
        <div className="hebron-services-inner">
          <span className="hebron-about-eyebrow" style={{ color: '#e55353' }}>WEEKLY SERVICES &amp; EXPERIENCE</span>
          <h2 className="hebron-services-title">Worship &amp; Service Times</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '1.05rem', margin: '-18px auto 36px', textAlign: 'center', maxWidth: '640px', lineHeight: 1.6 }}>
            Every week, The Hebron hosts Midweek and Sunday Services as follows:
          </p>

          {/* Sunday Services */}
          <div className="hebron-service-block">
            <h3 className="hebron-service-group-title">Sundays (Weekly Services)</h3>
            <div className="hebron-service-cards">
              <div className="hebron-service-item">
                <span className="hebron-service-num">01</span>
                <div>
                  <p className="hebron-service-name">First Service</p>
                  <p className="hebron-service-time">8:00 AM</p>
                </div>
              </div>
              <div className="hebron-service-divider" aria-hidden="true" />
              <div className="hebron-service-item">
                <span className="hebron-service-num">02</span>
                <div>
                  <p className="hebron-service-name">Second Service</p>
                  <p className="hebron-service-time">9:30 AM</p>
                </div>
              </div>
              <div className="hebron-service-divider" aria-hidden="true" />
              <div className="hebron-service-item hebron-service-item--special">
                <span className="hebron-service-num">03</span>
                <div>
                  <p className="hebron-service-name">Third Service</p>
                  <p className="hebron-service-time">11:00 AM</p>
                  <p className="hebron-service-note">Specialized Services on First Sunday of each month</p>
                </div>
              </div>
            </div>
          </div>

          {/* Midweek Service */}
          <div className="hebron-service-block" style={{ marginTop: '28px' }}>
            <h3 className="hebron-service-group-title">Midweek Service</h3>
            <div className="hebron-service-cards hebron-service-cards--midweek">
              <div className="hebron-service-item hebron-service-item--midweek">
                <div>
                  <p className="hebron-service-name">Wednesdays</p>
                  <p className="hebron-service-time">7:00 PM</p>
                  <p className="hebron-service-note" style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '6px' }}>
                    A powerful evening encounter in deep revelation of the Word, prayer, and spiritual impartation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="hebron-services-desc" style={{ marginTop: '36px' }}>
            All weekly services are designed to facilitate meaningful encounters with God through deep revelation of the word, worship, prayer, fellowship and spiritual impartation.
          </p>
        </div>
      </section>

      {/* ── GALLERY ──────────────────────────────────────────── */}
      <HebronGallery />

      <Footer />
    </main>
  );
}
