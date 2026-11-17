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
        {/* Subtle curved background overlay */}
        <div className="hebron-hero-backdrop" aria-hidden="true">
          <svg className="hebron-wave-svg" viewBox="0 0 1440 600" fill="none" preserveAspectRatio="none">
            <path
              d="M-100 500 C 300 580, 700 350, 1100 480 C 1300 540, 1500 420, 1600 380 L 1600 600 L -100 600 Z"
              fill="rgba(255, 255, 255, 0.08)"
            />
            <path
              d="M700 0 C 950 120, 1200 80, 1550 250 L 1550 0 Z"
              fill="rgba(255, 255, 255, 0.05)"
            />
          </svg>
        </div>

        {/* Half-showing Heart watermark on bottom-left */}
        <div className="hebron-heart-watermark" aria-hidden="true">
            <svg width="240" height="240" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              {/* Elegant looping line heart */}
              <path d="M50 82 C22 62 10 44 10 28 C10 16 20 8 32 8 C40 8 47 13 50 19 C53 13 60 8 68 8 C80 8 90 16 90 28 C90 44 78 62 50 82 Z" />
              <path d="M50 48 C42 36 34 38 34 46 C34 54 44 60 50 68 C56 60 66 54 66 46 C66 38 58 36 50 48 Z" strokeWidth="1.4" opacity="0.7" />
            </svg>
        </div>

        {/* Center Container: Text on Left, Photos on Right */}
        <div className="hebron-hero-inner">
          {/* TEXT — LEFT */}
          <div className="hebron-hero-text">
            {/* Subtle decorative arc behind text */}
            <div className="hebron-text-arc" aria-hidden="true" />
            <span className="hebron-hero-eyebrow">THE HEBRON</span>
            <h1 className="hebron-hero-title">
              Gospel Pillars<br />Church Lekki
            </h1>
            <p className="hebron-hero-sub">Lagos Headquarters</p>
          </div>

          {/* PHOTOS — RIGHT (2 staggered columns with white frames) */}
          <div className="hebron-hero-photos">
            {/* Column 1 */}
            <div className="hebron-photo-col hebron-col-left">
              <div className="hebron-photo-frame">
                <div className="hebron-photo-img-wrap">
                  <Image
                    src="/hebron/panel-discussion-stage.jpg"
                    alt="Gospel Pillars Lekki service"
                    fill
                    sizes="(max-width: 768px) 100vw, 260px"
                    style={{ objectFit: 'cover' }}
                    priority
                  />
                </div>
              </div>

              <div className="hebron-photo-frame">
                <div className="hebron-photo-img-wrap">
                  <Image
                    src="/hebron/congregation-midweek-aerial.jpg"
                    alt="Auditorium congregation at The Hebron"
                    fill
                    sizes="(max-width: 768px) 100vw, 260px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>

            {/* Column 2 (Offset / Staggered) */}
            <div className="hebron-photo-col hebron-col-right">
              <div className="hebron-photo-frame">
                <div className="hebron-photo-img-wrap">
                  <Image
                    src="/hebron/congregation-revival-seated.jpg"
                    alt="Congregation in service at The Hebron"
                    fill
                    sizes="(max-width: 768px) 100vw, 260px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>

              <div className="hebron-photo-frame">
                <div className="hebron-photo-img-wrap">
                  <Image
                    src="/hebron/members-arriving-couple.jpg"
                    alt="Members arriving at The Hebron"
                    fill
                    sizes="(max-width: 768px) 100vw, 260px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
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
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
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
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
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
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
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

      {/* ── GALLERY ──────────────────────────────────────────── */}
      <section className="hebron-gallery">
        <div className="hebron-gallery-inner">
          <span className="hebron-about-eyebrow" style={{ color: '#e55353', display: 'block', textAlign: 'center', marginBottom: '8px' }}>GALLERY</span>
          <h2 className="hebron-services-title" style={{ color: 'var(--primary-navy)', textAlign: 'center', marginBottom: '32px' }}>Life at The Hebron</h2>
          <div className="hebron-gallery-grid">
            {[
              { src: '/hebron/congregation-revival-aerial.jpg', alt: 'Full congregation revival service' },
              { src: '/hebron/congregation-taking-notes.jpg', alt: 'Members taking notes during service' },
              { src: '/hebron/congregation-worship.jpg', alt: 'Congregation in worship' },
              { src: '/hebron/praise-team-worship.jpg', alt: 'Praise team leading worship' },
              { src: '/hebron/choir-worship-stage.jpg', alt: 'Choir leading worship on stage' },
              { src: '/hebron/auditorium-hosting-spirit.jpg', alt: 'Auditorium during service' },
              { src: '/hebron/prophet-macwealth-stage.jpg', alt: 'Prophet Macwealth on stage' },
              { src: '/hebron/congregation-wednesday-service.jpg', alt: 'Wednesday service congregation' },
              { src: '/hebron/members-arriving-green-dress.jpg', alt: 'Members arriving for service' },
              { src: '/hebron/members-greeting-handshake.jpg', alt: 'Members fellowshipping' },
              { src: '/hebron/children-church-1a.jpg', alt: 'Children church session 1' },
              { src: '/hebron/children-church-2a.jpg', alt: 'Children church session 2' },
            ].map((img, i) => (
              <div key={i} className="hebron-gallery-item">
                <Image src={img.src} alt={img.alt} fill style={{ objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
