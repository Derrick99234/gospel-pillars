import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Image from 'next/image';

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
        <div className="hebron-hero-left">
          <span className="hebron-hero-eyebrow">THE HEBRON</span>
          <h1 className="hebron-hero-title">
            Gospel Pillars<br />Church Lekki
          </h1>
          <p className="hebron-hero-sub">Lagos Headquarters</p>
        </div>

        <div className="hebron-hero-right">
          <div className="hebron-photo-grid">
            <div className="hebron-photo hebron-photo-top">
              <div className="hebron-photo-placeholder" aria-label="Church service photo" />
            </div>
            <div className="hebron-photo hebron-photo-mid">
              <div className="hebron-photo-placeholder" aria-label="Congregation photo" />
            </div>
            <div className="hebron-photo hebron-photo-btm">
              <div className="hebron-photo-placeholder" aria-label="Pastoral photo" />
            </div>
          </div>
        </div>

        {/* decorative ring */}
        <div className="hebron-hero-ring" aria-hidden="true" />
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
            <div className="hebron-about-img-placeholder" aria-label="Prophet preaching" />
          </div>
          <div className="hebron-about-text">
            <p>
              Gospel Pillars Church Lekki – <strong>The Hebron</strong>, is the Lagos Headquarters
              of Gospel Pillars International Churches. It is a vibrant, non-denominational branch
              within a multifaceted, multicultural global church network that has over one hundred
              branches across five continents.
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
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <h3 className="hebron-info-label">Location</h3>
          <p className="hebron-info-body">
            180 Freedom Way, after Renee Supermarket,<br />
            Off Admiralty Way, Lekki Phase 1,<br />
            Lagos, Nigeria
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

        {/* Founding */}
        <div className="hebron-info-card">
          <div className="hebron-info-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <h3 className="hebron-info-label">Founded</h3>
          <p className="hebron-info-body">
            Founded in <strong>March 2026</strong> as one of eight new churches planted in one day
            by <strong>Prophet Isaiah Macwealth</strong>. Designated the Lagos Headquarters and
            positioned as a major worship and revival centre serving Lekki, Victoria Island,
            Ikoyi and wider Lagos Island communities.
          </p>
        </div>

        {/* Leadership */}
        <div className="hebron-info-card">
          <div className="hebron-info-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87"/>
              <path d="M16 3.13a4 4 0 010 7.75"/>
            </svg>
          </div>
          <h3 className="hebron-info-label">Leadership</h3>
          <p className="hebron-info-body">
            The Hebron has a presiding pastor who operates under the spiritual leadership of
            <strong> Prophet Isaiah Macwealth</strong>, Founder and Senior Pastor of Gospel
            Pillars International Churches.
          </p>
        </div>

      </section>

      {/* ── SERVICE TIMES ────────────────────────────────────── */}
      <section className="hebron-services">
        <div className="hebron-services-inner">
          <span className="hebron-about-eyebrow" style={{ color: '#e55353' }}>JOIN US</span>
          <h2 className="hebron-services-title">Sunday Services</h2>

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
                <p className="hebron-service-note">First Sunday of every month</p>
              </div>
            </div>
          </div>

          <p className="hebron-services-desc">
            All services are designed to facilitate meaningful encounters with God through deep
            revelation of the Word, worship, prayer, fellowship and spiritual impartation.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
