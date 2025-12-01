'use client';

import { useRouter } from 'next/navigation';
import styles from './workspace.module.css';

const workspaceData: Record<string, any> = {
  'hot-desks': {
    title: 'Hot Desks',
    price: '₦1,500/hour',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
    description: 'Flexible workspace solutions for modern professionals who value freedom and collaboration.',
    features: [
      'Ergonomic chairs and adjustable desks',
      'High-speed WiFi (50+ Mbps)',
      '24/7 power backup',
      'Access to shared amenities',
      'Coffee and refreshments',
      'Printing and scanning facilities',
      'Community networking events',
      'Flexible booking (hourly/daily)',
    ],
    amenities: [
      { icon: '⚡', name: 'Power Backup' },
      { icon: '🌐', name: 'High-Speed WiFi' },
      { icon: '☕', name: 'Free Coffee' },
      { icon: '🖨️', name: 'Printing' },
      { icon: '🔒', name: 'Secure Lockers' },
      { icon: '❄️', name: 'Air Conditioning' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80',
    ],
  },
  'meeting-rooms': {
    title: 'Meeting Rooms',
    price: '₦4,500/hour',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80',
    description: 'Professional meeting spaces equipped with everything you need for productive discussions and presentations.',
    features: [
      'Capacity: 4-20 people',
      '65" 4K display screens',
      'Video conferencing equipment',
      'Whiteboard and markers',
      'High-speed internet',
      'Conference phone system',
      'Comfortable seating',
      'Complimentary refreshments',
    ],
    amenities: [
      { icon: '📺', name: '4K Display' },
      { icon: '🎥', name: 'Video Conferencing' },
      { icon: '📝', name: 'Whiteboard' },
      { icon: '☕', name: 'Refreshments' },
      { icon: '🔊', name: 'Sound System' },
      { icon: '❄️', name: 'Climate Control' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
      'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800&q=80',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
    ],
  },
  'recording-studios': {
    title: 'Recording Studios',
    price: '₦7,500/hour',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&q=80',
    description: 'State-of-the-art recording facilities for podcasts, music production, and video content creation.',
    features: [
      'Soundproof recording booth',
      'Professional microphones (Shure SM7B)',
      '4K video recording equipment',
      'Studio lighting setup',
      'Audio mixing console',
      'DAW software (Pro Tools, Logic Pro)',
      'Green screen available',
      'Technical support included',
    ],
    amenities: [
      { icon: '🎙️', name: 'Pro Microphones' },
      { icon: '🎥', name: '4K Cameras' },
      { icon: '💡', name: 'Studio Lighting' },
      { icon: '🎚️', name: 'Mixing Console' },
      { icon: '🎬', name: 'Green Screen' },
      { icon: '🔇', name: 'Soundproof' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80',
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80',
      'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&q=80',
    ],
  },
};

export default function WorkspacePage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { slug } = params;
  const workspace = workspaceData[slug];

  if (!workspace) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <button onClick={() => router.push('/')} className={styles.backButton}>
            ← Back to Home
          </button>
        </div>
        <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'white' }}>
          <h1>Workspace not found</h1>
          <p>The workspace you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => router.push('/')} className={styles.backButton}>
          ← Back to Home
        </button>
      </div>

      <div className={styles.hero}>
        <img src={workspace.image} alt={workspace.title} className={styles.heroImage} />
        <div className={styles.heroOverlay}>
          <h1 className={styles.title}>{workspace.title}</h1>
          <p className={styles.price}>{workspace.price}</p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.mainContent}>
          <section className={styles.section}>
            <h2>About This Space</h2>
            <p className={styles.description}>{workspace.description}</p>
          </section>

          <section className={styles.section}>
            <h2>Features & Amenities</h2>
            <div className={styles.featureGrid}>
              {workspace.features.map((feature: string, index: number) => (
                <div key={index} className={styles.featureItem}>
                  <span className={styles.checkmark}>✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2>Amenities</h2>
            <div className={styles.amenityGrid}>
              {workspace.amenities.map((amenity: any, index: number) => (
                <div key={index} className={styles.amenityCard}>
                  <div className={styles.amenityIcon}>{amenity.icon}</div>
                  <div className={styles.amenityName}>{amenity.name}</div>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2>Gallery</h2>
            <div className={styles.gallery}>
              {workspace.gallery.map((image: string, index: number) => (
                <img key={index} src={image} alt={`${workspace.title} ${index + 1}`} className={styles.galleryImage} />
              ))}
            </div>
          </section>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.bookingCard}>
            <h3>Book This Space</h3>
            <div className={styles.bookingPrice}>{workspace.price}</div>
            <a href="/booking" className={styles.bookButton}>
              Book Now
            </a>
            <div className={styles.bookingInfo}>
              <p>✓ Instant confirmation</p>
              <p>✓ Flexible cancellation</p>
              <p>✓ 24/7 support</p>
            </div>
          </div>

          <div className={styles.contactCard}>
            <h4>Need Help?</h4>
            <p>Contact our team for custom packages or group bookings.</p>
            <p className={styles.contactDetail}>📧 hello@sourcehub.ng</p>
            <p className={styles.contactDetail}>📱 +234 800 SOURCE HUB</p>
          </div>
        </div>
      </div>
    </div>
  );
}
