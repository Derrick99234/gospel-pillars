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
  List,
  Building2
} from 'lucide-react';

export default function OutletsDirectory({ outletsData }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState('ALL');
  const [activeType, setActiveType] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid');
  const [toastMessage, setToastMessage] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

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

                      {outlet.landmarks && (
                        <div className="landmarks-box">
                          <strong>Note / Landmark:</strong> {outlet.landmarks}
                        </div>
                      )}
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
                          <span className="list-venue-tag" title="Venue / Hall">
                            <Building2 size={12} />
                            <span>{outlet.venue}</span>
                          </span>
                        )}
                      </div>
                      <p className="list-row-address">
                        <MapPin size={14} className="list-address-icon" />
                        <span>
                          {outlet.address}
                          {outlet.city ? ` • ${outlet.city}` : ''}
                          {outlet.country ? ` • ${outlet.country}` : ''}
                        </span>
                      </p>
                    </div>

                    <div className="list-row-actions">
                      {outlet.phone_numbers && outlet.phone_numbers[0] && (
                        <a
                          href={`tel:${outlet.phone_numbers[0].replace(/[^\d+]/g, '')}`}
                          className="list-action-btn list-phone-btn"
                          title={`Call ${outlet.phone_numbers[0]}`}
                        >
                          <Phone size={13} />
                          <span>{outlet.phone_numbers[0]}</span>
                        </a>
                      )}
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${outlet.name}, ${outlet.address}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="list-action-btn list-directions-btn"
                        title="Get directions on Google Maps"
                      >
                        <Navigation size={13} />
                        <span>Directions</span>
                        <ExternalLink size={11} className="list-external-icon" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>


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
