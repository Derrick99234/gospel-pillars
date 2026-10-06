'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, Menu, X, Play } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);

  return (
    <div className="header-wrapper">
      <header className="site-header">
        {/* Logo */}
        <a href="https://gospelpillars.org/" className="header-logo-link" title="Gospel Pillars Church">
          <Image
            src="/logo.png"
            alt="Gospel Pillars Church Logo"
            width={58}
            height={56}
            className="header-logo-img"
            priority
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="header-nav" aria-label="Main Navigation">
          <a href="https://gospelpillars.org/" className="nav-link">
            Home
          </a>

          {/* About Us Dropdown */}
          <div className="nav-dropdown-parent">
            <button
              className="nav-dropdown-trigger"
              onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
              aria-expanded={aboutDropdownOpen}
              type="button"
            >
              About Us
              <ChevronDown size={14} />
            </button>
            <div className="nav-dropdown-menu">
              <a
                href="https://gospelpillars.org/about-isaiah-macwealth/"
                className="dropdown-item"
              >
                About Prophet Isaiah Macwealth
              </a>
              <a
                href="https://gospelpillars.org/gospel-pillars-church/"
                className="dropdown-item"
              >
                About Gospel Pillars Church
              </a>
            </div>
          </div>

          <a href="https://gospelpillars.org/blog/" className="nav-link">
            Blog
          </a>

          <a href="https://gospelpillars.org/give/" className="nav-link">
            Give Online
          </a>

          <a href="#outlets" className="nav-link active">
            Outlets
          </a>

          <Link href="/portal" className="nav-link">
            Manager Portal
          </Link>

          <a href="https://gospelpillars.org/contact/" className="nav-link">
            Contact Us
          </a>
        </nav>

        {/* Right CTA: Watch Live Services */}
        <div className="header-actions">
          <a
            href="https://www.youtube.com/@gospelpillarsinternational/live"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-watch-live"
          >
            <span className="live-dot"></span>
            Watch Live Services
          </a>

          {/* Mobile hamburger button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            type="button"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          background: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          padding: '16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          borderRadius: '0 0 12px 12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
          <a href="https://gospelpillars.org/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Home</a>
          <div style={{ paddingLeft: '8px', borderLeft: '2px solid #e2e8f0' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>ABOUT US</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
              <a href="https://gospelpillars.org/about-isaiah-macwealth/" className="nav-link" style={{ fontSize: '14px' }}>
                About Prophet Isaiah Macwealth
              </a>
              <a href="https://gospelpillars.org/gospel-pillars-church/" className="nav-link" style={{ fontSize: '14px' }}>
                About Gospel Pillars Church
              </a>
            </div>
          </div>
          <a href="https://gospelpillars.org/blog/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Blog</a>
          <a href="https://gospelpillars.org/give/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Give Online</a>
          <a href="#outlets" className="nav-link active" onClick={() => setMobileMenuOpen(false)}>Outlets</a>
          <Link href="/portal" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Manager Portal</Link>
          <a href="https://gospelpillars.org/contact/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Contact Us</a>
          <a
            href="https://www.youtube.com/@gospelpillarsinternational/live"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-watch-live"
            style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
          >
            <span className="live-dot"></span>
            Watch Live Services
          </a>
        </div>
      )}
    </div>
  );
}
