'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

function makeImages(prefix, count, alt) {
  return Array.from({ length: count }, (_, i) => ({
    src: `/hebron/${prefix}-${String(i + 1).padStart(2, '0')}.jpg`,
    alt,
  }));
}

const albums = [
  {
    id: 'sunday-group-1',
    label: 'Sunday Service',
    date: 'Group 1',
    images: makeImages('sunday-g1', 17, 'Sunday service at The Hebron'),
  },
  {
    id: 'sunday-group-2',
    label: 'Sunday Service',
    date: 'Group 2',
    images: makeImages('sunday-g2', 15, 'Sunday service at The Hebron'),
  },
  {
    id: 'sunday-group-3',
    label: 'Sunday Service',
    date: 'Group 3',
    images: makeImages('sunday-g3', 28, 'Sunday service at The Hebron'),
  },
  {
    id: 'midweek-group-1',
    label: 'Midweek Service',
    date: 'Group 1',
    images: makeImages('midweek-g1', 20, 'Midweek service at The Hebron'),
  },
  {
    id: 'midweek-group-2',
    label: 'Midweek Service',
    date: 'Group 2',
    images: makeImages('midweek-g2', 11, 'Midweek service at The Hebron'),
  },
  {
    id: 'nov-17-2026',
    label: 'Sunday Service',
    date: 'November 17, 2026',
    images: [
      { src: '/hebron/hebron-new-01.jpg', alt: 'Sunday service at The Hebron' },
      { src: '/hebron/hebron-new-02.jpg', alt: 'Sunday service at The Hebron' },
      { src: '/hebron/hebron-new-03.jpg', alt: 'Sunday service at The Hebron' },
      { src: '/hebron/hebron-new-04.jpg', alt: 'Sunday service at The Hebron' },
      { src: '/hebron/hebron-new-05.jpg', alt: 'Sunday service at The Hebron' },
      { src: '/hebron/hebron-new-06.jpg', alt: 'Sunday service at The Hebron' },
      { src: '/hebron/hebron-new-07.jpg', alt: 'Sunday service at The Hebron' },
      { src: '/hebron/hebron-new-08.jpg', alt: 'Sunday service at The Hebron' },
      { src: '/hebron/hebron-new-09.jpg', alt: 'Sunday service at The Hebron' },
      { src: '/hebron/hebron-new-10.jpg', alt: 'Sunday service at The Hebron' },
      { src: '/hebron/hebron-new-11.jpg', alt: 'Sunday service at The Hebron' },
      { src: '/hebron/hebron-new-12.jpg', alt: 'Sunday service at The Hebron' },
      { src: '/hebron/hebron-new-13.jpg', alt: 'Sunday service at The Hebron' },
    ],
  },
  {
    id: 'life-at-hebron',
    label: 'Life at The Hebron',
    date: '',
    images: [
      { src: '/hebron/congregation-revival-aerial.jpg', alt: 'Full congregation revival service' },
      { src: '/hebron/congregation-taking-notes.jpg', alt: 'Members taking notes during service' },
      { src: '/hebron/congregation-worship.jpg', alt: 'Congregation in worship' },
      { src: '/hebron/praise-team-worship.jpg', alt: 'Praise team leading worship' },
      { src: '/hebron/choir-worship-stage.jpg', alt: 'Choir leading worship on stage' },
      { src: '/hebron/auditorium-hosting-spirit.jpg', alt: 'Auditorium during service' },
      { src: '/hebron/prophet-macwealth-stage.jpg', alt: 'Prophet Macwealth on stage' },
      { src: '/hebron/congregation-wednesday-service.jpg', alt: 'Wednesday service congregation' },
      { src: '/hebron/members-arriving-green-dress.jpg', alt: 'Members arriving for service' },
      { src: '/hebron/members-greeting-handshake.jpg', alt: 'Members fellowshipping' },
      { src: '/hebron/children-church-1a.jpg', alt: 'Children church session 1' },
      { src: '/hebron/children-church-2a.jpg', alt: 'Children church session 2' },
    ],
  },
];

export default function HebronGallery() {
  const [lightbox, setLightbox] = useState(null); // { albumIdx, imgIdx }

  const allImages = lightbox !== null
    ? albums[lightbox.albumIdx].images
    : [];

  const close = useCallback(() => setLightbox(null), []);

  const prev = useCallback(() => {
    setLightbox(lb => ({
      ...lb,
      imgIdx: (lb.imgIdx - 1 + allImages.length) % allImages.length,
    }));
  }, [allImages.length]);

  const next = useCallback(() => {
    setLightbox(lb => ({
      ...lb,
      imgIdx: (lb.imgIdx + 1) % allImages.length,
    }));
  }, [allImages.length]);

  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, close, prev, next]);

  return (
    <section className="hgallery">
      <div className="hgallery-inner">
        <div className="hgallery-heading">
          <span className="hebron-about-eyebrow" style={{ color: '#e55353' }}>GALLERY</span>
          <h2 className="hgallery-title">Photo Albums</h2>
        </div>

        {albums.map((album, aIdx) => (
          <div key={album.id} className="hgallery-album">
            <div className="hgallery-album-header">
              <div className="hgallery-album-meta">
                <span className="hgallery-album-label">{album.label}</span>
                {album.date && (
                  <span className="hgallery-album-date">{album.date}</span>
                )}
              </div>
              <span className="hgallery-album-count">{album.images.length} photos</span>
            </div>

            <div className="hgallery-grid">
              {album.images.map((img, iIdx) => (
                <button
                  key={iIdx}
                  className={`hgallery-photo${iIdx === 0 ? ' hgallery-photo--featured' : ''}`}
                  onClick={() => setLightbox({ albumIdx: aIdx, imgIdx: iIdx })}
                  aria-label={`View ${img.alt}`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes={iIdx === 0
                      ? '(max-width: 768px) 100vw, 560px'
                      : '(max-width: 768px) 50vw, 220px'}
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="hgallery-photo-overlay" aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="hgallery-lightbox" role="dialog" aria-modal="true">
          <button className="hgallery-lb-close" onClick={close} aria-label="Close">✕</button>

          <button className="hgallery-lb-nav hgallery-lb-nav--prev" onClick={prev} aria-label="Previous">‹</button>

          <div className="hgallery-lb-img-wrap">
            <Image
              src={allImages[lightbox.imgIdx].src}
              alt={allImages[lightbox.imgIdx].alt}
              fill
              sizes="100vw"
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>

          <button className="hgallery-lb-nav hgallery-lb-nav--next" onClick={next} aria-label="Next">›</button>

          <div className="hgallery-lb-counter">
            {lightbox.imgIdx + 1} / {allImages.length}
          </div>

          <div className="hgallery-lb-backdrop" onClick={close} aria-hidden="true" />
        </div>
      )}
    </section>
  );
}
