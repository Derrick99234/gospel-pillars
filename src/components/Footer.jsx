import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="site-footer" id="footer">
      <div className="footer-inner">
        <div className="footer-top">
          {/* Brand info */}
          <div>
            <div className="footer-brand-title">
              <Image
                src="/logo.png"
                alt="Gospel Pillars"
                width={36}
                height={36}
                style={{ objectFit: 'contain' }}
              />
              <span>Gospel Pillars Int&apos;l Church</span>
            </div>
            <p className="footer-brand-desc">
              Raising a vibrant people of faith, power, love, and spiritual maturity through the Word
              and the prophetic ministry of Prophet Isaiah Macwealth.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <a
                href="https://www.youtube.com/@gospelpillarsinternational"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#ffffff', background: '#1e2238', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', textDecoration: 'none' }}
              >
                YouTube Live
              </a>
              <a
                href="https://gospelpillars.org/give/"
                style={{ color: '#ffffff', background: '#d4af37', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}
              >
                Give Online
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-column-title">Quick Links</h4>
            <ul className="footer-links-list">
              <li><a href="https://gospelpillars.org/" className="footer-link">Home</a></li>
              <li><a href="https://gospelpillars.org/about-isaiah-macwealth/" className="footer-link">Prophet Isaiah Macwealth</a></li>
              <li><a href="https://gospelpillars.org/gospel-pillars-church/" className="footer-link">About Church</a></li>
              <li><a href="https://gospelpillars.org/blog/" className="footer-link">Blog & Devotionals</a></li>
              <li><a href="https://gospelpillars.org/give/" className="footer-link">Online Giving</a></li>
              <li><a href="https://gospelpillars.org/contact/" className="footer-link">Contact Us</a></li>
            </ul>
          </div>

          {/* Outlets Global Regions */}
          <div>
            <h4 className="footer-column-title">Global Regions</h4>
            <ul className="footer-links-list">
              <li><a href="#outlets" className="footer-link">Church Locations Lagos</a></li>
              <li><a href="#outlets" className="footer-link">Nigeria State Branches</a></li>
              <li><a href="#outlets" className="footer-link">United Kingdom Branches</a></li>
              <li><a href="#outlets" className="footer-link">North & South America</a></li>
              <li><a href="#outlets" className="footer-link">Asia & Europe Outlets</a></li>
              <li><a href="#outlets" className="footer-link">Africa Outlets & Campus</a></li>
            </ul>
          </div>

          {/* Central Worship Centre */}
          <div>
            <h4 className="footer-column-title">Ark of Light</h4>
            <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '12px' }}>
              Ark of Light for All Nations<br />
              11 Kudirat Abiola Way, Ikeja, Lagos, Nigeria.
            </p>
            <p style={{ fontSize: '13px', color: '#cbd5e1' }}>
              Enquiries: +234 906 460 0560
            </p>
          </div>
        </div>

        {/* Bottom Legal / Copyright */}
        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            Copyright {new Date().getFullYear()} - Gospel Pillars Int&apos;l Church. All rights reserved.
          </p>
          <div>
            <a
              href="https://gospelpillars.org/privacy-policy"
              className="footer-legal-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
