'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Phone,
  Copy,
  Check,
  ExternalLink,
  Navigation,
  Compass,
  Grid,
  List
} from 'lucide-react';

export default function OutletsDirectory({ outletsData }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState('ALL');
  const [activeType, setActiveType] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid');
  const [toastMessage, setToastMessage] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [showMidweekModal, setShowMidweekModal] = useState(false);

  const outlets = outletsData.outlets || [];
  const regionsSummary = outletsData.metadata?.regions_summary || {};

  const regionOptions = [
    { key: 'ALL', label: 'All Locations', count: outlets.length },
    { key: 'Church Locations Across Lagos', label: 'Lagos', count: regionsSummary['Church Locations Across Lagos'] || 9 },
    { key: 'Nigeria', label: 'Nigeria', count: regionsSummary['Nigeria'] || 36 },
    { key: 'United Kingdom', label: 'United Kingdom', count: regionsSummary['United Kingdom'] || 10 },
    { key: 'North and South America', label: 'Americas', count: regionsSummary['North and South America'] || 8 },
    { key: 'Asia and Europe', label: 'Asia & Europe', count: regionsSummary['Asia and Europe'] || 9 },
    { key: 'Africa', label: 'Africa', count: regionsSummary['Africa'] || 19 },
  ];

  const filteredOutlets = useMemo(() => {
    return outlets.filter((item) => {
      if (activeRegion !== 'ALL' && item.region_category !== activeRegion) {
        return false;
      }
      if (activeType !== 'ALL' && item.branch_type !== activeType) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.name?.toLowerCase().includes(q);
        const matchHeading = item.original_heading?.toLowerCase().includes(q);
        const matchAddress = item.address?.toLowerCase().includes(q);
        const matchCity = item.city?.toLowerCase().includes(q);
        const matchState = item.state_or_province?.toLowerCase().includes(q);
        const matchCountry = item.country?.toLowerCase().includes(q);
        const matchVenue = item.venue?.toLowerCase().includes(q);
        const matchLandmarks = item.landmarks?.toLowerCase().includes(q);
        const matchPhones = item.phone_numbers?.some((p) => p.includes(q));

        if (!matchName && !matchHeading && !matchAddress && !matchCity && !matchState && !matchCountry && !matchVenue && !matchLandmarks && !matchPhones) {
          return false;
        }
      }

      return true;
    });
  }, [outlets, activeRegion, activeType, searchQuery]);

  const groupedResults = useMemo(() => {
    const groups = {};
    filteredOutlets.forEach((item) => {
      const reg = item.region_category;
      if (!groups[reg]) groups[reg] = [];
      groups[reg].push(item);
    });
    return groups;
  }, [filteredOutlets]);

  const handleCopy = (text, id, label) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast(`Copied ${label}: ${text}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div id="outlets">
      {/* Search Header Container (matching screenshot) */}
      <section className="search-container-section">
        <div className="search-inner">
          <h2 className="search-heading">Search for a location in the search box below.</h2>
          <p className="search-subheading">
            You can type in the name of a city, or address. As you start typing, suggestions appear below the search box.
          </p>

          {/* Search bar */}
          <div className="search-bar-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="search ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search church locations"
            />
            {searchQuery && (
              <button
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                title="Clear search"
                type="button"
              >
                ✕
              </button>
            )}
            <div className="search-icon-btn">
              <Search size={18} />
            </div>
          </div>
        </div>

        {/* Region Filter Tabs - Simple flat text tabs, NO pill shapes */}
        <div className="controls-bar">
          <div className="simple-region-nav" role="tablist">
            {regionOptions.map((opt) => (
              <button
                key={opt.key}
                role="tab"
                aria-selected={activeRegion === opt.key}
                className={`simple-tab-item ${activeRegion === opt.key ? 'active' : ''}`}
                onClick={() => setActiveRegion(opt.key)}
              >
                <span>{opt.label}</span>
                <span className="tab-digit">({opt.count})</span>
              </button>
            ))}
          </div>

          {/* Subbar: Simple type filter & view toggle */}
          <div className="filter-subbar">
            <div className="simple-type-group">
              <span className="filter-label">Filter:</span>
              <button
                className={`simple-type-btn ${activeType === 'ALL' ? 'active' : ''}`}
                onClick={() => setActiveType('ALL')}
              >
                All
              </button>
              <button
                className={`simple-type-btn ${activeType === 'Church Branch' ? 'active' : ''}`}
                onClick={() => setActiveType('Church Branch')}
              >
                Church Branches
              </button>
              <button
                className={`simple-type-btn ${activeType === 'Campus Fellowship' ? 'active' : ''}`}
                onClick={() => setActiveType('Campus Fellowship')}
              >
                Campus Fellowships
              </button>
              <button
                className={`simple-type-btn ${activeType === 'Community Church' ? 'active' : ''}`}
                onClick={() => setActiveType('Community Church')}
              >
                Community Churches
              </button>
            </div>

            <div className="filter-actions-right">
              <span className="results-count-text">
                {filteredOutlets.length} {filteredOutlets.length === 1 ? 'location' : 'locations'}
              </span>

              <div className="view-toggle">
                <button
                  className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                  aria-label="Grid view"
                >
                  <Grid size={16} />
                </button>
                <button
                  className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                  aria-label="List view"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Directory Content Area */}
      <div className="directory-container">
        {/* Midweek Services Highlight Banner */}
        <div className="midweek-simple-banner" id="lagos-midweek-service-centers">
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px', color: '#1e293b' }}>
              Lagos Midweek Service Centers
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              Midweek service holds across all Lagos centers on Wednesdays and Thursdays.
            </p>
          </div>
          <button
            className="btn-simple-midweek"
            onClick={() => setShowMidweekModal(true)}
            type="button"
          >
            See Midweek Centers
          </button>
        </div>

        {/* Empty Search State */}
        {filteredOutlets.length === 0 && (
          <div className="empty-state">
            <Compass size={40} className="empty-icon" />
            <h3 className="empty-title">No locations found</h3>
            <p className="empty-desc">
              We couldn&apos;t find any outlet matching &quot;{searchQuery}&quot;. Try adjusting your search or region.
            </p>
            <button
              className="btn-reset-filters"
              onClick={() => {
                setSearchQuery('');
                setActiveRegion('ALL');
                setActiveType('ALL');
              }}
              type="button"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Display Grouped Results - Simple & Clean without badge pills */}
        {Object.entries(groupedResults).map(([regionName, items]) => (
          <div key={regionName} className="section-group">
            <div className="section-group-header">
              <h3 className="section-group-title">
                {regionName}
                <span style={{ fontSize: '15px', fontWeight: '500', color: '#64748b' }}>({items.length})</span>
              </h3>
            </div>

            {viewMode === 'grid' ? (
              <div className="simple-cards-grid">
                {items.map((outlet) => (
                  <article key={outlet.id} className="simple-outlet-card">
                    <div className="simple-card-body">
                      <h4 className="simple-outlet-name">{outlet.name}</h4>

                      {outlet.venue && (
                        <div className="simple-venue-text">
                          {outlet.venue}
                        </div>
                      )}

                      <div className="simple-address-row">
                        <MapPin size={16} className="simple-address-icon" />
                        <span>{outlet.address}</span>
                      </div>

                      {outlet.landmarks && (
                        <div className="simple-landmark-text">
                          <span>Landmark:</span> {outlet.landmarks}
                        </div>
                      )}
                    </div>

                    <div className="simple-card-footer">
                      {outlet.phone_numbers && outlet.phone_numbers.length > 0 ? (
                        <div className="simple-phones-row">
                          {outlet.phone_numbers.map((phone, pIdx) => {
                            const cleanTel = phone.replace(/[^\d+]/g, '');
                            return (
                              <div key={pIdx} className="simple-phone-group">
                                <a
                                  href={`tel:${cleanTel}`}
                                  className="simple-phone-link"
                                  title={`Call ${phone}`}
                                >
                                  <Phone size={13} />
                                  <span>{phone}</span>
                                </a>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(phone, `${outlet.id}-${pIdx}`, 'Phone')}
                                  className="simple-copy-btn"
                                  title="Copy phone"
                                >
                                  {copiedId === `${outlet.id}-${pIdx}` ? (
                                    <Check size={12} color="#16a34a" />
                                  ) : (
                                    <Copy size={12} />
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                          Contact Central Office
                        </span>
                      )}

                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${outlet.name}, ${outlet.address}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="simple-directions-btn"
                      >
                        <Navigation size={13} />
                        Get Directions
                        <ExternalLink size={12} style={{ marginLeft: 'auto' }} />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              /* Simple List View Mode */
              <div className="outlets-list-view">
                {items.map((outlet) => (
                  <div key={outlet.id} className="simple-list-row">
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', marginBottom: '3px' }}>
                        {outlet.name}
                      </h4>
                      <p style={{ fontSize: '13.5px', color: '#475569' }}>
                        {outlet.address}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {outlet.phone_numbers && outlet.phone_numbers[0] && (
                        <a
                          href={`tel:${outlet.phone_numbers[0].replace(/[^\d+]/g, '')}`}
                          className="simple-phone-link"
                        >
                          <Phone size={12} />
                          {outlet.phone_numbers[0]}
                        </a>
                      )}
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${outlet.name}, ${outlet.address}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="simple-directions-btn"
                        style={{ width: 'auto', padding: '6px 12px' }}
                      >
                        Directions
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Midweek Centers Modal */}
      {showMidweekModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(12, 14, 30, 0.6)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowMidweekModal(false)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: '#f1f5f9',
                border: 'none',
                width: '30px',
                height: '30px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b'
              }}
              type="button"
            >
              ✕
            </button>

            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: '#0f172a' }}>
              Lagos Midweek Service Centers
            </h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
              Join us for inspiring worship and Word at our Lagos service centers.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <strong style={{ display: 'block', color: '#0f172a', fontSize: '15px' }}>Ark of Light for All Nations (Ikeja)</strong>
                <p style={{ fontSize: '13px', color: '#475569', marginTop: '2px' }}>11 Kudirat Abiola Way, Ikeja, Lagos • +234 906 460 0560</p>
              </div>

              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <strong style={{ display: 'block', color: '#0f172a', fontSize: '15px' }}>The Hebron – Lekki Outlet</strong>
                <p style={{ fontSize: '13px', color: '#475569', marginTop: '2px' }}>180 Freedom Way, Lekki Phase 1 • +234 809 011 1194</p>
              </div>

              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <strong style={{ display: 'block', color: '#0f172a', fontSize: '15px' }}>Yaba / Somolu Outlet</strong>
                <p style={{ fontSize: '13px', color: '#475569', marginTop: '2px' }}>Beverly&apos;s Event Center, 33-37 Shogbamu St, Somolu • +234 906 310 7001</p>
              </div>

              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <strong style={{ display: 'block', color: '#0f172a', fontSize: '15px' }}>Ikorodu Outlet</strong>
                <p style={{ fontSize: '13px', color: '#475569', marginTop: '2px' }}>94 Oba-Sekumade Road, Beside Ipakodo Grammar School • +234 902 789 8589</p>
              </div>
            </div>

            <button
              onClick={() => setShowMidweekModal(false)}
              style={{
                width: '100%',
                background: '#0c0e1e',
                color: '#ffffff',
                border: 'none',
                padding: '12px',
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '14px',
                marginTop: '20px',
                cursor: 'pointer'
              }}
              type="button"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Copy Toast */}
      {toastMessage && (
        <div className="toast-notice">
          <Check size={16} color="#4ade80" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
