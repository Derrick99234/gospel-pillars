import './globals.css';

export const metadata = {
  metadataBase: new URL('https://gospelpillars.org'),
  title: 'Outlets - Gospel Pillars | Find a Church Outlet Close to You',
  description: 'Looking for a vibrant church family near you? Discover the nearest Gospel Pillars Church outlet, campus fellowship, or service center worldwide.',
  keywords: 'Gospel Pillars, Church Outlets, Prophet Isaiah Macwealth, Lagos Churches, UK Outlets, Campus Fellowships',
  openGraph: {
    title: 'Outlets - Gospel Pillars',
    description: 'Looking for a vibrant church family near you, discover the nearest Gospel Pillars Church outlet! Join us for inspiring worship, life-transforming teachings, and fellowship.',
    url: 'https://gospelpillars.org/outlets/',
    siteName: 'Gospel Pillars Int\'l Church',
    images: [
      {
        url: '/logo.png',
        width: 600,
        height: 584,
        alt: 'Gospel Pillars Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
