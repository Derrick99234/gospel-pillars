import Header from '../components/Header';
import Hero from '../components/Hero';
import OutletsDirectory from '../components/OutletsDirectory';
import Footer from '../components/Footer';
import { getDatabase } from '../lib/db';
import outletsDataFallback from '../data/outlets.json';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const db = getDatabase();
  const outlets = (db && db.outlets && db.outlets.length > 0) ? db.outlets : outletsDataFallback.outlets;
  
  // Calculate dynamic counts per region
  const regionsSummary = {};
  outlets.forEach((item) => {
    const reg = item.region_category || 'Other';
    regionsSummary[reg] = (regionsSummary[reg] || 0) + 1;
  });

  const liveOutletsData = {
    metadata: {
      total_outlets: outlets.length,
      total_regions: Object.keys(regionsSummary).length,
      regions_summary: regionsSummary,
    },
    outlets,
  };

  const totalOutlets = liveOutletsData.metadata.total_outlets;
  const totalRegions = liveOutletsData.metadata.total_regions;

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1:1 Pixel-faithful Navigation matching the WordPress website */}
      <Header />

      {/* Dark Navy Hero Section */}
      <Hero totalOutlets={totalOutlets} totalRegions={totalRegions} />

      {/* Interactive Outlets Directory */}
      <div style={{ flex: 1 }}>
        <OutletsDirectory outletsData={liveOutletsData} />
      </div>

      {/* Footer matching website */}
      <Footer />
    </main>
  );
}
