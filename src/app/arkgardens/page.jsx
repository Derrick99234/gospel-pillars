import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Image from 'next/image';
import { Navigation, MapPin, Globe, ExternalLink } from 'lucide-react';
import ArkGardensBooking from '../../components/ArkGardensBooking';

export const metadata = {
  title: 'The Ark Gardens – The Forest of Lebanon | Ikeja, Lagos',
  description:
    'The Ark Gardens is an intimate Conference and Lodging Centre strategically located in the heart of Ikeja, Lagos, within the premises of the Ark of Light for All Nations.',
  openGraph: {
    title: 'The Ark Gardens – The Forest of Lebanon · Conference Centre and Lodgings',
    description:
      'The Ark Gardens is an intimate Conference and Lodging Centre strategically located in the heart of Ikeja, Lagos.',
    url: 'https://gospelpillars.org/arkgardens',
    siteName: "Gospel Pillars Int'l Church",
  },
};

export default function ArkGardensPage() {
  return (
    <main className="arkgardens-page">
      {/* ── ARK GARDENS LOGO HEADER ─────────────────────────── */}
      <header className="arkgardens-logo-header">
        <Image
          src="/arkgardens/ark-gardens-logo.jpg"
          alt="Ark Gardens – The Forest of Lebanon"
          width={110}
          height={110}
          style={{ objectFit: 'contain' }}
          priority
        />
      </header>

      {/* ── HEADER TITLE ────────────────────────────────────── */}
      <section className="arkgardens-intro">
        <div className="arkgardens-simple-container">
          <span className="arkgardens-kicker">IKEJA, LAGOS</span>
          <h1 className="arkgardens-main-heading">The Ark Gardens</h1>
          <p className="arkgardens-tagline-text">
            The Forest of Lebanon &nbsp;·&nbsp; Conference Centre and Lodgings
          </p>
        </div>
      </section>

      {/* ── TWO PHOTOS (Shown once, side-by-side) ─────────────── */}
      <section className="arkgardens-photos-section">
        <div className="arkgardens-simple-container">
          {/* <div className="arkgardens-two-photos"> */}
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
          {/* </div> */}
        </div>
      </section>

      {/* ── ABOUT CONTENT (Exact client text) ────────────────── */}
      <section className="arkgardens-content-section">
        <div className="arkgardens-simple-container arkgardens-text-container">
          <h2 className="arkgardens-subheading">About The Ark Gardens</h2>

          <div className="arkgardens-body-text">
            <p>
              The Ark Gardens is an intimate Conference and Lodging Centre strategically located in the heart of Ikeja, Lagos, within the premises of the Ark of Light for All Nations.
            </p>

            <p>
              Due to be opened on the 22nd of November 2026, the Ark Gardens provides a welcoming and comfortable environment for intimate conferences, accommodation and hospitality.
            </p>

            <p>
              The Ark Gardens houses a modern conference facility, multi-roomed serviced apartments and comfortable lodges to meet the diverse needs of guests and visitors from around the world.
            </p>

            <p>
              The Ark Gardens also offers a convenient hospitality experience for visiting ministers, international delegates, conference participants, ministry partners, families and corporate guests at the Ark of Light for all Nations.
            </p>
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
            <p>
              Situated at Plot 11C, Kudirat Abiola Way, Ikeja, Lagos, The Ark Gardens enjoys a strategic location that provides convenient access to the activities and facilities of Ark of Light for All Nations, as well as the wider Ikeja metropolis.
            </p>

            <p>
              The Ark Gardens is designed to host intimate Christian gatherings, birthdays, trainings and programmes designed for spiritual elevation and personal revival. It is a place for private prayer where ministers and families can have prayer retreats in an atmosphere that is spiritual and full of the Holy Ghost.
            </p>

            {/* Enquiries & Reservations */}
            {/* <div className="arkgardens-enquiries-box">
              <div className="arkgardens-enquiries-info">
                <span className="arkgardens-enquiries-label">Reservations &amp; Enquiries</span>
                <p className="arkgardens-enquiries-text">
                  For enquiries and reservations, please visit{' '}
                  <a
                    href="https://arkgardens.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="arkgardens-website-link"
                  >
                    https://arkgardens.org
                  </a>
                </p>
              </div>
              <a
                href="https://arkgardens.org"
                target="_blank"
                rel="noopener noreferrer"
                className="arkgardens-visit-btn"
              >
                <Globe size={16} />
                <span>Visit arkgardens.org</span>
                <ExternalLink size={14} />
              </a>
            </div> */}

            <p className="arkgardens-highlight-quote">
              Ark Gardens – The Forest of Lebanon.
              <span className="arkgardens-quote-sub">Conference Centre and Lodgings</span>
            </p>

            <div className="arkgardens-book-wrap">
              <ArkGardensBooking />
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
