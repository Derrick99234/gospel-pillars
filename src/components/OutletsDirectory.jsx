'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  X,
  MapPin,
  Phone,
  Copy,
  Check,
  ExternalLink,
  Navigation,
  Building2,
  Compass,
  Grid,
  List,
  Filter,
  Info
} from 'lucide-react';

export default function OutletsDirectory({ outletsData }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState('ALL');
  const [activeType, setActiveType] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [toastMessage, setToastMessage] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [showMidweekModal, setShowMidweekModal] = useState(false);

  const outlets = outletsData.outlets || [];
  const regionsSummary = outletsData.metadata?.regions_summary || {};

  // Available regions in canonical order
  const regionOptions = [
    { key: 'ALL', label: 'All Locations', count: outlets.length },
    { key: 'Church Locations Across Lagos', label: 'Lagos', count: regionsSummary['Church Locations Across Lagos'] || 9 },
    { key: 'Nigeria', label: 'Nigeria', count: regionsSummary['Nigeria'] || 36 },
    { key: 'United Kingdom', label: 'United Kingdom', count: regionsSummary['United Kingdom'] || 10 },
    { key: 'North and South America', label: 'Americas', count: regionsSummary['North and South America'] || 8 },
    { key: 'Asia and Europe', label: 'Asia & Europe', count: regionsSummary['Asia and Europe'] || 9 },
    { key: 'Africa', label: 'Africa', count: regionsSummary['Africa'] || 19 },
  ];

  // Types summary
  const typeCounts = useMemo(() => {
    const counts = { ALL: outlets.length, 'Church Branch': 0, 'Campus Fellowship': 0, 'Community Church': 0 };
    outlets.forEach((o) => {
      counts[o.branch_type] = (counts[o.branch_type] || 0) + 1;
    });
    return counts;
  }, [outlets]);

  // Filtered outlets based on region, type, and search
  const filteredOutlets = useMemo(() => {
    return outlets.filter((item) => {
      // Region filter
      if (activeRegion !== 'ALL' && item.region_category !== activeRegion) {
        return false;
      }

      // Branch Type filter
      if (activeType !== 'ALL' && item.branch_type !== activeType) {
        return false;
      }

      // Search query filter
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

  // Group filtered results by region
  const groupedResults = useMemo(() => {
    const groups = {};
    filteredOutlets.forEach((item) => {
      const reg = item.region_category;
      if (!groups[reg]) groups[reg] = [];
      groups[reg].push(item);
    });
    return groups;
  }, [filteredOutlets]);

  // Copy phone or address to clipboard
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

          {/* Search bar pill */}
          <div className="search-bar-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="search ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search church locations"
            />
            {searchQuery ? (
              <button
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                title="Clear search"
                type="button"
              >
                ✕
              </button>
            ) : null}
            <div className="search-icon-btn">
              <Search size={18} />
            </div>
          </div>
        </div>

        {/* Region Filter Tabs */}
        <div className="controls-bar">
          <div className="region-tabs" role="tablist">
            {regionOptions.map((opt) => (
              <button
                key={opt.key}
                role="tab"
                aria-selected={activeRegion === opt.key}
                className={`region-tab-btn ${activeRegion === opt.key ? 'active' : ''}`}
                onClick={() => setActiveRegion(opt.key)}
              >
                <span>{opt.label}</span>
                <span className="tab-count">{opt.count}</span>
              </button>
            ))}
          </div>

          {/* Filter sub-bar: Types & View Switcher */}
          <div className="filter-subbar">
            <div className="type-filter-group">
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginRight: '6px' }}>
                Type:
              </span>
              <button
                className={`type-chip ${activeType === 'ALL' ? 'active' : ''}`}
                onClick={() => setActiveType('ALL')}
              >
                All ({typeCounts.ALL})
              </button>
              <button
                className={`type-chip ${activeType === 'Church Branch' ? 'active' : ''}`}
                onClick={() => setActiveType('Church Branch')}
              >
                Church Branches ({typeCounts['Church Branch']})
              </button>
              <button
                className={`type-chip ${activeType === 'Campus Fellowship' ? 'active' : ''}`}
                onClick={() => setActiveType('Campus Fellowship')}
              >
                Campus Fellowships ({typeCounts['Campus Fellowship']})
              </button>
              <button
                className={`type-chip ${activeType === 'Community Church' ? 'active' : ''}`}
                onClick={() => setActiveType('Community Church')}
              >
                Community Churches ({typeCounts['Community Church']})
              </button>
            </div>

            <div className="filter-actions-right">
              <span className="results-count-text">
                Showing <strong>{filteredOutlets.length}</strong> of {outlets.length} outlets
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
        <div className="midweek-banner-card" id="lagos-midweek-service-centers">
          <div className="midweek-info">
            <span className="midweek-badge">Midweek Services</span>
            <h3 className="midweek-title">Lagos Midweek Service Centers</h3>
            <p className="midweek-desc">
              Looking to fellowship with us during the week? Join our midweek teachings, communion,
              and prayer services across all Lagos centers on Wednesdays & Thursdays.
            </p>
          </div>
          <button
            className="btn-midweek-action"
            onClick={() => setShowMidweekModal(true)}
            type="button"
          >
            Explore Midweek Centers
          </button>
        </div>

        {/* Empty Search State */}
        {filteredOutlets.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <Compass size={48} />
            </div>
            <h3 className="empty-title">No matching church outlets found</h3>
            <p className="empty-desc">
              We couldn&apos;t find any outlet matching &quot;{searchQuery}&quot;. Try checking for spelling errors,
              clearing your filters, or browsing by region.
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
              Reset All Filters
            </button>
          </div>
        )}

        {/* Display Grouped Results */}
        {Object.entries(groupedResults).map(([regionName, items]) => (
          <div key={regionName} className="section-group">
            <div className="section-group-header">
              <h3 className="section-group-title">
                {regionName}
                <span className="section-group-badge">{items.length}</span>
              </h3>
            </div>

            {viewMode === 'grid' ? (
              <div className="outlets-grid">
                {items.map((outlet) => (
                  <article key={outlet.id} className="outlet-card">
                    <div className="card-top">
                      <div className="card-badges-row">
                        <span className="badge-region">{outlet.city || outlet.country}</span>
                        {outlet.branch_type && outlet.branch_type !== 'Church Branch' && (
                          <span
                            className={`badge-type ${
                              outlet.branch_type === 'Campus Fellowship'
                                ? 'campus'
                                : 'community'
                            }`}
                          >
                            {outlet.branch_type}
                          </span>
                        )}
                      </div>

                      <h4 className="outlet-name">{outlet.name}</h4>

                      {outlet.venue && (
                        <div className="venue-tag" title="Venue / Hall">
                          <Building2 size={13} />
                          <span>{outlet.venue}</span>
                        </div>
                      )}

                      <div className="address-row">
                        <MapPin size={16} className="address-icon" />
                        <span>{outlet.address}</span>
                      </div>

                      {/* Location & postal pills */}
                      <div className="location-tags-row">
                        {outlet.city && <span className="geo-tag">📍 {outlet.city}</span>}
                        {outlet.state_or_province && <span className="geo-tag">{outlet.state_or_province}</span>}
                        {outlet.country && <span className="geo-tag">🌐 {outlet.country}</span>}
                        {outlet.postal_code && <span className="geo-tag">📮 {outlet.postal_code}</span>}
                      </div>

                      
                    </div>

                    <div className="card-bottom">
                      {/* Phone Numbers */}
                      {outlet.phone_numbers && outlet.phone_numbers.length > 0 ? (
                        <div className="phone-list">
                          {outlet.phone_numbers.map((phone, pIdx) => {
                            const cleanTel = phone.replace(/[^\d+]/g, '');
                            return (
                              <div key={pIdx} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <a
                                  href={`tel:${cleanTel}`}
                                  className="phone-chip"
                                  title={`Call ${phone}`}
                                >
                                  <Phone size={13} />
                                  <span>{phone}</span>
                                </a>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(phone, `${outlet.id}-${pIdx}`, 'Phone')}
                                  style={{
                                    background: '#f1f5f9',
                                    border: '1px solid #cbd5e1',
                                    padding: '6px 8px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#475569',
                                    transition: 'all 0.15s ease'
                                  }}
                                  title="Copy phone number"
                                >
                                  {copiedId === `${outlet.id}-${pIdx}` ? (
                                    <Check size={13} color="#16a34a" />
                                  ) : (
                                    <Copy size={13} />
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <span style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>
                          Contact via Gospel Pillars Central Office
                        </span>
                      )}

                      {/* Google Maps Directions */}
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${outlet.name}, ${outlet.address}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-directions"
                      >
                        <Navigation size={13} />
                        Get Directions
                        <ExternalLink size={11} style={{ marginLeft: 'auto' }} />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              /* List View Mode */
              <div className="outlets-list-view">
                {items.map((outlet) => (
                  <div key={outlet.id} className="outlet-list-row">
                    <div className="list-row-main">
                      <div className="list-row-title-bar">
                        {outlet.branch_type && outlet.branch_type !== 'Church Branch' && (
                          <span
                            className={`badge-type ${
                              outlet.branch_type === 'Campus Fellowship'
                                ? 'campus'
                                : 'community'
                            }`}
                          >
                            {outlet.branch_type}
                          </span>
                        )}
                        <h4 className="list-row-title">{outlet.name}</h4>
                        {outlet.venue && (
                          <span style={{ fontSize: '12px', color: '#0284c7', background: '#f0f9ff', padding: '2px 8px', borderRadius: '4px' }}>
                            {outlet.venue}
                          </span>
                        )}
                      </div>
                      <p className="list-row-address">
                        <MapPin size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                        {outlet.address}
                        {outlet.city ? ` • ${outlet.city}` : ''}
                        {outlet.country ? ` • ${outlet.country}` : ''}
                      </p>
                    </div>

                    <div className="list-row-actions">
                      {outlet.phone_numbers && outlet.phone_numbers[0] && (
                        <a
                          href={`tel:${outlet.phone_numbers[0].replace(/[^\d+]/g, '')}`}
                          className="phone-chip"
                          style={{ padding: '6px 10px', fontSize: '12px' }}
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
                        className="phone-chip"
                        style={{ padding: '6px 10px', fontSize: '12px', background: '#0f172a', color: '#ffffff', borderColor: '#0f172a' }}
                      >
                        <Navigation size={12} />
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
          background: 'rgba(12, 14, 30, 0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            maxWidth: '680px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowMidweekModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: '#f1f5f9',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              type="button"
            >
              ✕
            </button>

            <span className="midweek-badge">Special Service Announcement</span>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: '700', margin: '8px 0 12px' }}>
              Lagos Midweek Service Centers
            </h3>
            <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.6', marginBottom: '20px' }}>
              All members and guests in Lagos are invited to attend our inspiring Midweek Service at our main Lagos centers.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <strong style={{ display: 'block', color: '#0f172a', marginBottom: '4px' }}>Ark of Light for All Nations (Ikeja)</strong>
                <p style={{ fontSize: '13.5px', color: '#475569' }}>11 Kudirat Abiola Way, Ikeja, Lagos • Contact: +234 906 460 0560</p>
              </div>

              <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <strong style={{ display: 'block', color: '#0f172a', marginBottom: '4px' }}>The Hebron – Lekki Outlet</strong>
                <p style={{ fontSize: '13.5px', color: '#475569' }}>180 Freedom Way, Lekki Phase 1 • Contact: +234 809 011 1194</p>
              </div>

              <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <strong style={{ display: 'block', color: '#0f172a', marginBottom: '4px' }}>Yaba / Somolu Outlet</strong>
                <p style={{ fontSize: '13.5px', color: '#475569' }}>Beverly&apos;s Event Center, 33-37 Shogbamu St, Somolu • Contact: +234 906 310 7001</p>
              </div>

              <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <strong style={{ display: 'block', color: '#0f172a', marginBottom: '4px' }}>Ikorodu Outlet</strong>
                <p style={{ fontSize: '13.5px', color: '#475569' }}>94 Oba-Sekumade Road, Beside Ipakodo Grammar School • Contact: +234 902 789 8589</p>
              </div>
            </div>

            <button
              onClick={() => setShowMidweekModal(false)}
              className="btn-watch-live"
              style={{ width: '100%', justifyContent: 'center', marginTop: '24px' }}
              type="button"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

      {/* Copy Toast Notice */}
      {toastMessage && (
        <div className="toast-notice">
          <Check size={16} color="#4ade80" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
