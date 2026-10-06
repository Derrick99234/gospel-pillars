import Header from '../components/Header';
import Hero from '../components/Hero';
import OutletsDirectory from '../components/OutletsDirectory';
import Footer from '../components/Footer';
import outletsData from '../data/outlets.json';

export default function HomePage() {
  const totalOutlets = outletsData?.metadata?.total_outlets || 91;
  const totalRegions = outletsData?.metadata?.total_regions || 6;

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1:1 Pixel-faithful Navigation matching the WordPress website */}
      <Header />

      {/* Dark Navy Hero Section */}
      <Hero totalOutlets={totalOutlets} totalRegions={totalRegions} />

      {/* Interactive Outlets Directory */}
      <div style={{ flex: 1 }}>
        <OutletsDirectory outletsData={outletsData} />
      </div>

      {/* Footer matching website */}
      <Footer />
    </main>
  );
}
