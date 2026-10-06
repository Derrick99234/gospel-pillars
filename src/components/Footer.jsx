'use client';

import { ChevronUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="exact-site-footer">
      <div className="exact-footer-inner">
        <p className="exact-footer-text">
          Copyright {new Date().getFullYear()} - Gospel Pillars Int&apos;l Church -{' '}
          <a
            href="https://gospelpillars.org/privacy-policy"
            className="exact-footer-privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
        </p>

        <button
          onClick={scrollToTop}
          className="exact-scroll-top-btn"
          title="Scroll to top"
          aria-label="Scroll to top"
          type="button"
        >
          <ChevronUp size={16} />
        </button>
      </div>
    </footer>
  );
}
