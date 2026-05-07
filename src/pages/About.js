import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const FEATURES = [
  { icon: '📍', title: 'Automatic Location Detection', desc: 'Uses your device GPS to pinpoint your exact position — no manual input needed.', color: '#00d4ff' },
  { icon: '🔄', title: 'Real-time Shop Discovery', desc: "Powered by OpenStreetMap's Overpass API for live, accurate business data.", color: '#10b981' },
  { icon: '🎛️', title: 'Smart Category Filtering', desc: 'Filter by 16 categories — restaurants, pharmacies, banks, gyms, and more.', color: '#f59e0b' },
  { icon: '📏', title: 'Distance Control', desc: 'Set your search radius from 5 km to 15 km and sort results by proximity.', color: '#8b5cf6' },
  { icon: '🗺️', title: 'Map & Tile Views', desc: 'Switch between an interactive Leaflet map and a beautiful card grid.', color: '#ec4899' },
  { icon: '🧭', title: 'Turn-by-turn Directions', desc: 'Get directions via OpenStreetMap or Google Maps with a single click.', color: '#3b82f6' },
  { icon: '🔐', title: 'Admin Dashboard', desc: 'Admins can review submissions, approve or decline requests, and control icon visibility.', color: '#ef4444' },
  { icon: '🆓', title: 'Completely Free', desc: 'No API keys, no usage limits, no billing. 100% open-source data.', color: '#14b8a6' },
];

const PRIVACY_POINTS = [
  { icon: '🚫', title: 'No Data Collection', desc: 'We do not collect, store, or transmit your personal data or location to any server.' },
  { icon: '🖥️', title: 'Browser-only Processing', desc: 'All location logic runs entirely in your browser. Your coordinates never leave your device.' },
  { icon: '🍪', title: 'No Cookies or Tracking', desc: 'We use no analytics, advertising cookies, or third-party trackers of any kind.' },
  { icon: '💾', title: 'Local Storage Only', desc: "Admin icon preferences are saved in your browser's localStorage — never on a remote server." },
  { icon: '🔓', title: 'Open Source Data', desc: 'All map and shop data comes from OpenStreetMap, a public, community-maintained dataset.' },
  { icon: '⚡', title: 'Permission-based', desc: 'Location access is requested explicitly. You can deny it at any time without losing app functionality.' },
];

const SERVICES = [
  {
    icon: '📱',
    title: 'App Development',
    tagline: 'iOS · Android · Cross-platform',
    color: '#6366f1',
    desc: 'We build fast, scalable mobile apps from idea to App Store. Whether you need a consumer app, a business tool, or a hyperlocal discovery experience — we ship products that users love.',
    bullets: [
      'React Native & Flutter cross-platform apps',
      'Native iOS (Swift) and Android (Kotlin)',
      'Offline-first architecture & push notifications',
      'App Store & Play Store submission support',
    ],
  },
  {
    icon: '🌐',
    title: 'Web Development',
    tagline: 'Frontend · Backend · Full-stack',
    color: '#2dd4bf',
    desc: 'From landing pages to complex SaaS platforms, we design and build web experiences that are fast, accessible, and built to scale. We work with modern stacks and ship clean, maintainable code.',
    bullets: [
      'React, Next.js, and modern frontend frameworks',
      'Node.js, REST & GraphQL APIs',
      'Database design — PostgreSQL, MongoDB, Redis',
      'CI/CD pipelines, cloud deployment (AWS, Vercel)',
    ],
  },
  {
    icon: '📣',
    title: 'Social Media Marketing',
    tagline: 'Strategy · Content · Growth',
    color: '#f59e0b',
    desc: 'We help local businesses and startups grow their online presence with data-driven social media strategies. From content creation to paid campaigns, we handle the full funnel.',
    bullets: [
      'Brand identity & content strategy',
      'Instagram, Facebook, LinkedIn & TikTok management',
      'Paid ad campaigns with measurable ROI',
      'Analytics reporting & monthly growth reviews',
    ],
  },
];

function About() {
  const [activeTab, setActiveTab] = useState('mission');

  const tabs = [
    { id: 'mission',  label: '🎯 Mission'  },
    { id: 'features', label: '✨ Features' },
    { id: 'privacy',  label: '🔒 Privacy'  },
  ];

  return (
    <div className="about-container">

      {/* ── Hero ── */}
      <div className="about-hero">
        <div className="about-hero-glow" />
        <p className="about-platform-line">Local Xeo platform helps businesses grow their businesses.</p>
        <h1 className="about-title">Local Shops Finder</h1>
        <p className="about-tagline">
          Discover businesses around you — powered by open data, built for everyone.
        </p>
        <div className="about-badges">
          <span className="about-badge">🆓 Free Forever</span>
          <span className="about-badge">🔓 Open Source Data</span>
          <span className="about-badge">📵 No Tracking</span>
          <span className="about-badge">📱 Mobile Ready</span>
        </div>
      </div>

      {/* ── Tab nav ── */}
      <div className="about-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`about-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Mission ── */}
      {activeTab === 'mission' && (
        <div className="about-panel">
          <div className="mission-block">
            <div className="mission-icon">🎯</div>
            <h2>Our Mission</h2>
            <p>
              Local Shops Finder exists to make your neighbourhood more accessible. Whether you're
              looking for a late-night pharmacy, the nearest café, or a pet shop you've never noticed
              before — we surface it instantly using your device's location and open community data.
            </p>
            <p>
              We believe local discovery should be free, private, and fast. No accounts, no
              subscriptions, no data harvesting. Just open the app, allow location access, and
              explore what's around you.
            </p>
          </div>

          <div className="how-it-works">
            <h3>How It Works</h3>
            <div className="steps">
              {[
                { n: '01', title: 'Allow Location', desc: 'Your browser requests GPS access. Your coordinates stay on your device.' },
                { n: '02', title: 'City Detected',  desc: 'Nominatim reverse-geocodes your position to identify your city or area.' },
                { n: '03', title: 'Shops Fetched',  desc: 'The Overpass API queries OpenStreetMap for businesses within your chosen radius.' },
                { n: '04', title: 'Browse & Navigate', desc: 'Filter by category, switch views, and get directions — all in one place.' },
              ].map(step => (
                <div key={step.n} className="step-card">
                  <div className="step-num">{step.n}</div>
                  <div className="step-body">
                    <strong>{step.title}</strong>
                    <p>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Features ── */}
      {activeTab === 'features' && (
        <div className="about-panel">
          <p className="panel-intro">
            Everything you need to find local businesses — nothing you don't.
          </p>
          <div className="features-grid">
            {FEATURES.map(f => (
              <div key={f.title} className="feature-card" style={{ '--fc': f.color }}>
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-body">
                  <strong>{f.title}</strong>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Privacy ── */}
      {activeTab === 'privacy' && (
        <div className="about-panel">
          <div className="privacy-hero">
            <div className="privacy-shield">🛡️</div>
            <h2>Your Privacy is Non-negotiable</h2>
            <p>
              This app was built with a privacy-first philosophy. We have no backend, no database,
              and no interest in your personal data.
            </p>
          </div>

          <div className="privacy-grid">
            {PRIVACY_POINTS.map(p => (
              <div key={p.title} className="privacy-card">
                <div className="privacy-card-icon">{p.icon}</div>
                <div>
                  <strong>{p.title}</strong>
                  <p>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="privacy-policy-box">
            <h3>📄 Privacy Policy Summary</h3>
            <ul>
              <li>We do <strong>not</strong> collect names, emails, or any personally identifiable information.</li>
              <li>Location data is used <strong>only</strong> to query the Overpass API and Nominatim — both are public services.</li>
              <li>No data is retained after your session ends.</li>
              <li>Admin preferences (icon visibility) are stored in <strong>your browser's localStorage</strong> only.</li>
              <li>We do not use Google Analytics, Facebook Pixel, or any third-party tracking scripts.</li>
              <li>This policy applies to all users globally. Last updated: April 2026.</li>
            </ul>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          SERVICES — standalone section
          ════════════════════════════════════════ */}
      <section className="services-section">

        {/* Section header */}
        <div className="services-section-header">
          <span className="services-eyebrow">What we do</span>
          <h2 className="services-heading">Our Services</h2>
          <p className="services-subheading">
            Beyond the map — we build digital products and grow brands for businesses of all sizes.
          </p>
        </div>

        {/* Cards */}
        <div className="services-grid">
          {SERVICES.map(svc => (
            <div key={svc.title} className="service-card" style={{ '--svc': svc.color }}>
              <div className="service-card-header">
                <div className="service-icon-wrap">
                  <span className="service-icon">{svc.icon}</span>
                </div>
                <div>
                  <h3 className="service-title">{svc.title}</h3>
                  <span className="service-tagline">{svc.tagline}</span>
                </div>
              </div>

              <p className="service-desc">{svc.desc}</p>

              <ul className="service-bullets">
                {svc.bullets.map(b => (
                  <li key={b}>
                    <span className="service-bullet-dot" />
                    {b}
                  </li>
                ))}
              </ul>

              <Link to="/contact" className="service-cta">
                Get in touch →
              </Link>
            </div>
          ))}
        </div>

        {/* CTA banner */}
        <div className="services-banner">
          <div className="services-banner-text">
            <strong>Have a project in mind?</strong>
            <span>Let's talk about how we can help you build, launch, and grow.</span>
          </div>
          <Link to="/contact" className="services-banner-btn">Start a conversation →</Link>
        </div>

      </section>

    </div>
  );
}

export default About;
