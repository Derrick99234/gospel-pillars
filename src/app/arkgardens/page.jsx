import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Image from 'next/image';
import { Navigation, MapPin } from 'lucide-react';

export const metadata = {
  title: 'The Ark Gardens – Conference Centre & Lodging | Ikeja, Lagos',
  description:
    'The Ark Gardens is a contemporary Conference Centre and Lodging destination strategically located in the heart of Ikeja, Lagos, within the premises of Ark of Light for All Nations.',
  openGraph: {
    title: 'The Ark Gardens – Conference Centre & Lodging',
    description:
      'The Ark Gardens is a contemporary Conference Centre and Lodging destination strategically located in the heart of Ikeja, Lagos.',
    url: 'https://gospelpillars.org/arkgardens',
    siteName: "Gospel Pillars Int'l Church",
  },
};

export default function ArkGardensPage() {
  return (
    <main className="arkgardens-page">
      <Header />

      {/* ── HEADER TITLE ────────────────────────────────────── */}
      <section className="arkgardens-intro">
        <div className="arkgardens-simple-container">
          <span className="arkgardens-kicker">IKEJA, LAGOS</span>
          <h1 className="arkgardens-main-heading">The Ark Gardens</h1>
          <p className="arkgardens-tagline-text">
            Conference Centre &amp; Lodging &nbsp;·&nbsp; An Experience to Remember
          </p>
        </div>
      </section>

      {/* ── TWO PHOTOS (Shown once, side-by-side) ─────────────── */}
      <section className="arkgardens-photos-section">
        <div className="arkgardens-simple-container">
          <div className="arkgardens-two-photos">
            <div className="arkgardens-photo-box">
              <Image
                src="/arkgardens/ark-gardens-exterior.jpg"
                alt="The Ark Gardens exterior facility"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 550px"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="arkgardens-photo-box">
              <Image
                src="/arkgardens/ark-gardens-hall.jpg"
                alt="The Ark Gardens conference and banquet hall"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 550px"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT CONTENT (Exact provided text) ───────────────── */}
      <section className="arkgardens-content-section">
        <div className="arkgardens-simple-container arkgardens-text-container">
          <h2 className="arkgardens-subheading">About The Ark Gardens</h2>

          <div className="arkgardens-body-text">
            <p>
              The Ark Gardens is a contemporary Conference Centre and Lodging destination
              strategically located in the heart of Ikeja, Lagos, within the premises of
              Ark of Light for All Nations.
            </p>

            <p>
              Established to provide a welcoming and comfortable environment for conferences,
              accommodation and hospitality, The Ark Gardens houses a modern conference facility,
              multi-roomed serviced apartments and comfortable lodges to meet the diverse needs
              of guests and visitors from around the world.
            </p>

            <p>
              The Ark Gardens offers a convenient hospitality experience for visiting ministers,
              international delegates, conference participants, ministry partners, families and
              corporate guests.
            </p>

            <p>
              Situated at Plot 11C, Kudirat Abiola Way, Ikeja, Lagos, The Ark Gardens enjoys
              a strategic location that provides convenient access to the activities and facilities
              of Ark of Light for All Nations, as well as the wider Ikeja metropolis.
            </p>

            <p>
              With a commitment to comfort, convenience and quality hospitality, The Ark Gardens
              is more than a place to stay; it is a destination designed to facilitate meaningful
              engagements and create memorable experiences.
            </p>

            <p className="arkgardens-highlight-quote">
              The Ark Gardens – An Experience to Remember.
            </p>
          </div>

          {/* Location & Directions Button */}
          <div className="arkgardens-address-card">
            <div className="arkgardens-address-details">
              <div className="arkgardens-pin-row">
                <MapPin size={20} className="arkgardens-pin-icon" />
                <span className="arkgardens-address-title">Address</span>
              </div>
              <p className="arkgardens-address-full">
                Plot 11C, Kudirat Abiola Way, Ikeja, Lagos, Nigeria<br />
                <span className="arkgardens-address-sub">Within the premises of Ark of Light for All Nations</span>
              </p>
            </div>

            <a
              href="https://maps.google.com/?q=Plot+11C+Kudirat+Abiola+Way+Ikeja+Lagos"
              target="_blank"
              rel="noopener noreferrer"
              className="arkgardens-simple-btn"
            >
              <Navigation size={16} />
              <span>Get Directions</span>
            </a>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
