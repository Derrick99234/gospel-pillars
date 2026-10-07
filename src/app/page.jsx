import Header from '../components/Header';
import Hero from '../components/Hero';
import OutletsDirectory from '../components/OutletsDirectory';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch outlets from Supabase
  const { data: outlets, error } = await supabase
    .from('outlets')
    .select('*')
    .order('index');

  const liveOutlets = outlets || [];

  if (error) {
    console.error('Failed to fetch outlets from Supabase:', error.message);
  }

  // Calculate dynamic counts per region
  const regionsSummary = {};
  liveOutlets.forEach((item) => {
    const reg = item.region_category || 'Other';
    regionsSummary[reg] = (regionsSummary[reg] || 0) + 1;
  });

  const liveOutletsData = {
    metadata: {
      total_outlets: liveOutlets.length,
      total_regions: Object.keys(regionsSummary).length,
      regions_summary: regionsSummary,
    },
    outlets: liveOutlets,
  };

  const totalOutlets = liveOutletsData.metadata.total_outlets;
  const totalRegions = liveOutletsData.metadata.total_regions;

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Hero totalOutlets={totalOutlets} totalRegions={totalRegions} />
      <div style={{ flex: 1 }}>
        <OutletsDirectory outletsData={liveOutletsData} />
      </div>
      <Footer />
    </main>
  );
}
