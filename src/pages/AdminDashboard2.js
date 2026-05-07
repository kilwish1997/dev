import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard2.css';

// ── Mock API data with FULL rating system, shop types, and YoY growth ──────
const MOCK_DATA = {
  overview: {
    users: { total: 1284, active: 973, inactive: 311 },
    entities: {
      individualUsers: 542,
      businesses: 318,
      hospitals: 47,
      schools: 89,
      institutions: 63,
      properties: 225,
    },
    engagement: { comments: 4821, ratings: 3107, addresses: 2654 },
  },
  
  // ── RATING SYSTEM (FULL) ──
  ratingSystem: {
    distribution: [
      { stars: 5, count: 1240 },
      { stars: 4, count: 980 },
      { stars: 3, count: 520 },
      { stars: 2, count: 240 },
      { stars: 1, count: 127 },
    ],
    byTargetType: [
      { targetType: 'Business', count: 1540, avg: 4.2 },
      { targetType: 'Hospital', count: 620, avg: 3.8 },
      { targetType: 'School', count: 480, avg: 4.5 },
      { targetType: 'Property', count: 310, avg: 3.6 },
      { targetType: 'Institution', count: 157, avg: 4.1 },
    ],
    monthlyGrowth: [
      { month: 'Jan', count: 180 }, { month: 'Feb', count: 210 },
      { month: 'Mar', count: 240 }, { month: 'Apr', count: 280 },
      { month: 'May', count: 310 }, { month: 'Jun', count: 290 },
      { month: 'Jul', count: 350 }, { month: 'Aug', count: 380 },
      { month: 'Sep', count: 360 }, { month: 'Oct', count: 420 },
      { month: 'Nov', count: 460 }, { month: 'Dec', count: 520 },
    ],
    avgRating: 4.1,
    totalRatings: 3107,
  },

  // ── SHOP TYPES & CATEGORIES (Individual vs Organization) ──
  shopTypes: {
    individual: {
      total: 542,
      byCategory: [
        { category: 'Freelancer', count: 142 },
        { category: 'Consultant', count: 98 },
        { category: 'Artist', count: 76 },
        { category: 'Tutor', count: 112 },
        { category: 'Other', count: 114 },
      ],
    },
    organization: {
      total: 318,
      byType: [
        { type: 'Retail', count: 98 },
        { type: 'Restaurant', count: 74 },
        { type: 'Service', count: 62 },
        { type: 'Healthcare', count: 45 },
        { type: 'Education', count: 39 },
      ],
      byCategory: [
        { category: 'Food & Beverage', count: 89 },
        { category: 'Fashion', count: 67 },
        { category: 'Electronics', count: 54 },
        { category: 'Health', count: 48 },
        { category: 'Other', count: 60 },
      ],
    },
  },

  // ── YEAR-OVER-YEAR GROWTH COMPARISON ──
  yearOverYear: {
    users: [
      { year: '2023', count: 420 },
      { year: '2024', count: 780 },
      { year: '2025', count: 1284 },
    ],
    businesses: [
      { year: '2023', count: 120 },
      { year: '2024', count: 210 },
      { year: '2025', count: 318 },
    ],
    ratings: [
      { year: '2023', count: 890 },
      { year: '2024', count: 1820 },
      { year: '2025', count: 3107 },
    ],
  },

  growth: {
    users: {
      userGrowth: [
        { month: 'Jan', count: 80 }, { month: 'Feb', count: 95 },
        { month: 'Mar', count: 110 }, { month: 'Apr', count: 130 },
        { month: 'May', count: 160 }, { month: 'Jun', count: 145 },
        { month: 'Jul', count: 190 }, { month: 'Aug', count: 210 },
        { month: 'Sep', count: 175 }, { month: 'Oct', count: 230 },
        { month: 'Nov', count: 260 }, { month: 'Dec', count: 290 },
      ],
    },
  },
  
  geographic: {
    byCity: [
      { city: 'Mumbai', count: 312 }, { city: 'Delhi', count: 278 },
      { city: 'Bangalore', count: 241 }, { city: 'Chennai', count: 189 },
      { city: 'Hyderabad', count: 156 }, { city: 'Pune', count: 108 },
    ],
    byState: [
      { state: 'Maharashtra', count: 420 }, { state: 'Karnataka', count: 310 },
      { state: 'Tamil Nadu', count: 265 }, { state: 'Delhi', count: 278 },
      { state: 'Telangana', count: 156 },
    ],
    byCountry: [
      { country: 'India', count: 1180 }, { country: 'USA', count: 62 },
      { country: 'UK', count: 24 }, { country: 'UAE', count: 18 },
    ],
  },
  
  searchAnalytics: {
    topQueries: [
      { query: 'hospital near me', count: 842 },
      { query: 'restaurant', count: 731 },
      { query: 'school admission', count: 618 },
      { query: 'pharmacy', count: 542 },
      { query: 'ATM', count: 489 },
      { query: 'grocery store', count: 421 },
    ],
  },
};

// ── Helpers ────────────────────────────────────────────────────────────────
function fmt(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

function pct(part, total) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

// ── Bar chart ──────────────────────────────────────────────────────────────
function BarChart({ data, color = '#2dd4bf', height = 80, labelKey = 'month', useGradient = false }) {
  if (!data || data.length === 0) return <div className="chart-empty">No data</div>;
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div className="bar-chart" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="bar-col" title={`${d[labelKey]}: ${d.count}`}>
          <div
            className="bar-fill"
            style={{
              height: `${(d.count / max) * 100}%`,
              background: useGradient && d.gradient ? d.gradient : color,
            }}
          />
          <span className="bar-label">{d[labelKey] || ''}</span>
        </div>
      ))}
    </div>
  );
}

// ── Multi-series bar chart (for YoY comparison) ───────────────────────────
function MultiBarChart({ datasets, height = 100 }) {
  if (!datasets || datasets.length === 0) return <div className="chart-empty">No data</div>;
  
  const allCounts = datasets.flatMap(ds => ds.data.map(d => d.count));
  const max = Math.max(...allCounts, 1);
  const labels = datasets[0].data.map(d => d.year || d.month);
  
  return (
    <div className="multi-bar-chart" style={{ height }}>
      {labels.map((label, i) => (
        <div key={i} className="multi-bar-group">
          <div className="multi-bar-cols">
            {datasets.map((ds, j) => {
              const val = ds.data[i].count;
              return (
                <div
                  key={j}
                  className="multi-bar-col"
                  style={{
                    height: `${(val / max) * 100}%`,
                    background: ds.color,
                  }}
                  title={`${ds.label} ${label}: ${val}`}
                />
              );
            })}
          </div>
          <span className="multi-bar-label">{label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Pie chart (SVG-based) ──────────────────────────────────────────────────
function PieChart({ data, colors }) {
  if (!data || data.length === 0) return <div className="chart-empty">No data</div>;
  
  const total = data.reduce((a, b) => a + b.count, 0);
  let cumulativePercent = 0;
  
  const slices = data.map((d, i) => {
    const percent = (d.count / total) * 100;
    const startAngle = (cumulativePercent / 100) * 360;
    const endAngle = ((cumulativePercent + percent) / 100) * 360;
    cumulativePercent += percent;
    
    const x1 = 50 + 40 * Math.cos((Math.PI * startAngle) / 180);
    const y1 = 50 + 40 * Math.sin((Math.PI * startAngle) / 180);
    const x2 = 50 + 40 * Math.cos((Math.PI * endAngle) / 180);
    const y2 = 50 + 40 * Math.sin((Math.PI * endAngle) / 180);
    const largeArc = percent > 50 ? 1 : 0;
    
    const path = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;
    
    return { path, color: colors[i % colors.length], percent: percent.toFixed(1), ...d };
  });
  
  return (
    <div className="pie-chart-wrap">
      <svg className="pie-chart" viewBox="0 0 100 100">
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} opacity="0.85" />
        ))}
      </svg>
      <div className="pie-legend">
        {slices.map((s, i) => (
          <div key={i} className="pie-legend-item">
            <span className="pie-legend-dot" style={{ background: s.color }} />
            <span className="pie-legend-label">{s.type || s.category || s.label}</span>
            <span className="pie-legend-val">{s.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Horizontal bar ─────────────────────────────────────────────────────────
function HBar({ label, count, total, color }) {
  const w = pct(count, total);
  return (
    <div className="hbar-row">
      <span className="hbar-label">{label}</span>
      <div className="hbar-track">
        <div className="hbar-fill" style={{ width: `${w}%`, background: color }}>
          <div className="hbar-shine" />
        </div>
      </div>
      <span className="hbar-count">{fmt(count)}</span>
    </div>
  );
}

// ── Card wrapper ───────────────────────────────────────────────────────────
function Card({ title, icon, children, className = '' }) {
  return (
    <div className={`db2-card ${className}`}>
      {title && (
        <div className="db2-card-header">
          {icon && <span className="db2-card-icon">{icon}</span>}
          <h3 className="db2-card-title">{title}</h3>
        </div>
      )}
      <div className="db2-card-body">{children}</div>
    </div>
  );
}

// ── Stat tile ──────────────────────────────────────────────────────────────
function StatTile({ icon, label, value, sub, color }) {
  return (
    <div className="db2-stat-tile" style={{ '--tile-color': color }}>
      <div className="db2-stat-icon">{icon}</div>
      <div className="db2-stat-info">
        <span className="db2-stat-value">{fmt(value)}</span>
        <span className="db2-stat-label">{label}</span>
        {sub && <span className="db2-stat-sub">{sub}</span>}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
function AdminDashboard2() {
  const navigate = useNavigate();
  const [data] = useState(MOCK_DATA);
  const [loading, setLoading] = useState(true);
  const [activeGeoTab, setActiveGeoTab] = useState('byCity');

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="db2-loading">
        <div className="db2-spinner" />
        <span>Loading dashboard…</span>
      </div>
    );
  }

  const { overview, ratingSystem, shopTypes, yearOverYear, growth, geographic, searchAnalytics } = data;
  const totalEntities = Object.values(overview.entities).reduce((a, b) => a + b, 0);
  const totalRatingDist = ratingSystem.distribution.reduce((a, b) => a + b.count, 0);

  // Enhanced gradient colors for charts
  const COLORS = [
    'linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%)', // Cyan gradient
    'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)', // Purple gradient
    'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', // Orange gradient
    'linear-gradient(135deg, #10b981 0%, #059669 100%)', // Green gradient
    'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)', // Pink gradient
    'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)', // Blue gradient
    'linear-gradient(135deg, #fb923c 0%, #f97316 100%)', // Deep orange gradient
  ];
  
  const SOLID_COLORS = ['#2dd4bf', '#a78bfa', '#f59e0b', '#10b981', '#f472b6', '#60a5fa', '#fb923c'];

  // Geo data
  const geoData = geographic[activeGeoTab] || [];
  const geoKey = activeGeoTab === 'byCity' ? 'city' : activeGeoTab === 'byState' ? 'state' : 'country';
  const geoTotal = geoData.reduce((a, b) => a + b.count, 0);

  return (
    <div className="db2-container">

      {/* ── Header ── */}
      <div className="db2-header">
        <div className="db2-header-left">
          <h1 className="db2-title">
            <span className="db2-title-icon">📊</span>
            Analytics Dashboard
          </h1>
          <p className="db2-subtitle">
            <span className="db2-subtitle-badge">Real-time</span>
            Platform-wide insights and performance metrics
          </p>
        </div>
        <div className="db2-header-right">
          <div className="db2-header-actions">
            <button className="db2-profile-btn" onClick={() => navigate('/admin-profile')} title="Admin Profile">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Profile
            </button>
            <button className="db2-export-btn" title="Export Report">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              Export
            </button>
            <button className="db2-refresh-btn" title="Refresh Data">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
              </svg>
            </button>
          </div>
          <div className="db2-header-meta">
            <span className="db2-live-badge">
              <span className="db2-live-dot" />
              Live
            </span>
            <span className="db2-timestamp">
              {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      {/* ── Stat tiles ── */}
      <div className="db2-section-header">
        <h2 className="db2-section-title">Overview Metrics</h2>
        <p className="db2-section-desc">Key performance indicators at a glance</p>
      </div>
      <div className="db2-tiles">
        <StatTile icon="👥" label="Total Users" value={overview.users.total} sub={`${fmt(overview.users.active)} active`} color="#2dd4bf" />
        <StatTile icon="✅" label="Active Users" value={overview.users.active} sub={`${pct(overview.users.active, overview.users.total)}% of total`} color="#10b981" />
        <StatTile icon="🏢" label="Businesses" value={overview.entities.businesses} sub="registered" color="#a78bfa" />
        <StatTile icon="💬" label="Comments" value={overview.engagement.comments} sub="total posted" color="#f59e0b" />
        <StatTile icon="⭐" label="Ratings" value={overview.engagement.ratings} sub="total submitted" color="#f472b6" />
        <StatTile icon="📍" label="Addresses" value={overview.engagement.addresses} sub="mapped" color="#60a5fa" />
      </div>

      {/* ── ROW: Year-over-Year Growth Comparison ── */}
      <div className="db2-section-header">
        <h2 className="db2-section-title">Year-over-Year Growth</h2>
        <p className="db2-section-desc">Compare annual performance across key metrics</p>
      </div>
      <Card title="" icon="" className="db2-card-clean">
        <div className="yoy-grid">
          <div className="yoy-section">
            <div className="yoy-header">
              <span className="yoy-icon">👥</span>
              <h4 className="yoy-section-title">Total Users</h4>
            </div>
            <MultiBarChart
              datasets={[
                { label: '2023', data: [{ year: '2023', count: yearOverYear.users[0].count }], color: '#64748b' },
                { label: '2024', data: [{ year: '2024', count: yearOverYear.users[1].count }], color: '#60a5fa' },
                { label: '2025', data: [{ year: '2025', count: yearOverYear.users[2].count }], color: '#2dd4bf' },
              ]}
              height={100}
            />
            <div className="yoy-stats">
              {yearOverYear.users.map((y, i) => (
                <div key={i} className="yoy-stat">
                  <span className="yoy-year">{y.year}</span>
                  <span className="yoy-val">{fmt(y.count)}</span>
                  {i > 0 && (
                    <span className="yoy-growth">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M12 19V5M5 12l7-7 7 7"/>
                      </svg>
                      {pct(y.count - yearOverYear.users[i - 1].count, yearOverYear.users[i - 1].count)}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="yoy-section">
            <div className="yoy-header">
              <span className="yoy-icon">🏢</span>
              <h4 className="yoy-section-title">Businesses</h4>
            </div>
            <MultiBarChart
              datasets={[
                { label: '2023', data: [{ year: '2023', count: yearOverYear.businesses[0].count }], color: '#64748b' },
                { label: '2024', data: [{ year: '2024', count: yearOverYear.businesses[1].count }], color: '#a78bfa' },
                { label: '2025', data: [{ year: '2025', count: yearOverYear.businesses[2].count }], color: '#f59e0b' },
              ]}
              height={100}
            />
            <div className="yoy-stats">
              {yearOverYear.businesses.map((y, i) => (
                <div key={i} className="yoy-stat">
                  <span className="yoy-year">{y.year}</span>
                  <span className="yoy-val">{fmt(y.count)}</span>
                  {i > 0 && (
                    <span className="yoy-growth">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M12 19V5M5 12l7-7 7 7"/>
                      </svg>
                      {pct(y.count - yearOverYear.businesses[i - 1].count, yearOverYear.businesses[i - 1].count)}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="yoy-section">
            <div className="yoy-header">
              <span className="yoy-icon">⭐</span>
              <h4 className="yoy-section-title">Total Ratings</h4>
            </div>
            <MultiBarChart
              datasets={[
                { label: '2023', data: [{ year: '2023', count: yearOverYear.ratings[0].count }], color: '#64748b' },
                { label: '2024', data: [{ year: '2024', count: yearOverYear.ratings[1].count }], color: '#f472b6' },
                { label: '2025', data: [{ year: '2025', count: yearOverYear.ratings[2].count }], color: '#10b981' },
              ]}
              height={100}
            />
            <div className="yoy-stats">
              {yearOverYear.ratings.map((y, i) => (
                <div key={i} className="yoy-stat">
                  <span className="yoy-year">{y.year}</span>
                  <span className="yoy-val">{fmt(y.count)}</span>
                  {i > 0 && (
                    <span className="yoy-growth">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M12 19V5M5 12l7-7 7 7"/>
                      </svg>
                      {pct(y.count - yearOverYear.ratings[i - 1].count, yearOverYear.ratings[i - 1].count)}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* ── ROW: Rating System (FULL) ── */}
      <div className="db2-section-header">
        <h2 className="db2-section-title">Rating Analytics</h2>
        <p className="db2-section-desc">Comprehensive rating distribution and trends</p>
      </div>
      <div className="db2-row">
        
        {/* Rating distribution (1-5 stars) */}
        <Card title="Rating Distribution" icon="⭐" className="db2-card-md">
          <div className="rating-dist-list">
            {ratingSystem.distribution.map((r, i) => (
              <div key={i} className="rating-dist-row">
                <span className="rating-stars">
                  {Array.from({ length: 5 }, (_, j) => (
                    <span key={j} className={j < r.stars ? 'star-filled' : 'star-empty'}>★</span>
                  ))}
                </span>
                <div className="rating-dist-bar">
                  <div
                    className="rating-dist-fill"
                    style={{
                      width: `${pct(r.count, totalRatingDist)}%`,
                      background: COLORS[5 - r.stars],
                    }}
                  />
                </div>
                <span className="rating-dist-count">{fmt(r.count)}</span>
                <span className="rating-dist-pct">{pct(r.count, totalRatingDist)}%</span>
              </div>
            ))}
          </div>
          <div className="db2-total-row">
            <div className="rating-summary">
              <span className="rating-summary-label">Average Rating</span>
              <span className="rating-summary-value">
                <span className="rating-star-icon">★</span>
                {ratingSystem.avgRating.toFixed(1)}
              </span>
            </div>
            <div className="rating-summary">
              <span className="rating-summary-label">Total Reviews</span>
              <span className="rating-summary-value">{fmt(ratingSystem.totalRatings)}</span>
            </div>
          </div>
        </Card>

        {/* Ratings by target type */}
        <Card title="Ratings by Type" icon="📊" className="db2-card-md">
          <BarChart 
            data={ratingSystem.byTargetType.map((r, i) => ({ 
              ...r, 
              month: r.targetType,
              gradient: COLORS[i % COLORS.length]
            }))} 
            color="#f472b6" 
            height={100} 
            labelKey="month" 
            useGradient={true}
          />
          <div className="rating-type-list">
            {ratingSystem.byTargetType.map((r, i) => (
              <div key={i} className="rating-type-row">
                <span className="rating-type-label">{r.targetType}</span>
                <span className="rating-type-avg">★ {r.avg.toFixed(1)}</span>
                <span className="rating-type-count">{fmt(r.count)} ratings</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Rating growth over time */}
        <Card title="Rating Growth" icon="📈" className="db2-card-md">
          <BarChart 
            data={ratingSystem.monthlyGrowth.map((m, i) => ({
              ...m,
              gradient: COLORS[i % COLORS.length]
            }))} 
            color="#10b981" 
            height={100}
            useGradient={true}
          />
          <div className="chart-stats">
            <div className="chart-stat">
              <span className="chart-stat-label">Total This Year</span>
              <span className="chart-stat-value">{fmt(ratingSystem.monthlyGrowth.reduce((a, b) => a + b.count, 0))}</span>
            </div>
            <div className="chart-stat">
              <span className="chart-stat-label">Avg per Month</span>
              <span className="chart-stat-value">{fmt(Math.round(ratingSystem.monthlyGrowth.reduce((a, b) => a + b.count, 0) / 12))}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* ── ROW: Shop Types (Individual vs Organization) ── */}
      <div className="db2-section-header">
        <h2 className="db2-section-title">Entity Breakdown</h2>
        <p className="db2-section-desc">Distribution across individual users and organizations</p>
      </div>
      <div className="db2-row">
        
        {/* Individual vs Organization split */}
        <Card title="User Type Split" icon="👥" className="db2-card-sm">
          <div className="split-stats">
            <div className="split-stat split-stat-individual">
              <span className="split-icon">👤</span>
              <span className="split-label">Individual</span>
              <span className="split-value">{fmt(shopTypes.individual.total)}</span>
              <span className="split-pct">{pct(shopTypes.individual.total, shopTypes.individual.total + shopTypes.organization.total)}%</span>
              <div className="split-bar">
                <div 
                  className="split-bar-fill" 
                  style={{ 
                    width: `${pct(shopTypes.individual.total, shopTypes.individual.total + shopTypes.organization.total)}%`,
                    background: '#2dd4bf'
                  }} 
                />
              </div>
            </div>
            <div className="split-stat split-stat-org">
              <span className="split-icon">🏢</span>
              <span className="split-label">Organization</span>
              <span className="split-value">{fmt(shopTypes.organization.total)}</span>
              <span className="split-pct">{pct(shopTypes.organization.total, shopTypes.individual.total + shopTypes.organization.total)}%</span>
              <div className="split-bar">
                <div 
                  className="split-bar-fill" 
                  style={{ 
                    width: `${pct(shopTypes.organization.total, shopTypes.individual.total + shopTypes.organization.total)}%`,
                    background: '#a78bfa'
                  }} 
                />
              </div>
            </div>
          </div>
          <div className="db2-total-row">
            <span className="db2-total-label">Total Entities</span>
            <span className="db2-total-value">{fmt(shopTypes.individual.total + shopTypes.organization.total)}</span>
          </div>
        </Card>

        {/* Individual categories */}
        <Card title="Individual Categories" icon="👤" className="db2-card-md">
          <PieChart data={shopTypes.individual.byCategory} colors={SOLID_COLORS} />
        </Card>

        {/* Organization types */}
        <Card title="Organization Types" icon="🏪" className="db2-card-md">
          <PieChart data={shopTypes.organization.byType} colors={SOLID_COLORS} />
        </Card>

        {/* Organization categories */}
        <Card title="Organization Categories" icon="🏢" className="db2-card-md">
          {(() => {
            const total = shopTypes.organization.byCategory.reduce((a, b) => a + b.count, 0);
            return shopTypes.organization.byCategory.map((c, i) => (
              <HBar key={i} label={c.category} count={c.count} total={total} color={SOLID_COLORS[i]} />
            ));
          })()}
        </Card>
      </div>

      {/* ── NEW ROW: Additional Metrics to Fill Space ── */}
      <div className="db2-section-header">
        <h2 className="db2-section-title">Engagement Metrics</h2>
        <p className="db2-section-desc">User interaction and content activity</p>
      </div>
      <div className="db2-row">
        
        {/* Comments by target type */}
        <Card title="Comments by Type" icon="💬" className="db2-card-md">
          {(() => {
            const commentData = [
              { targetType: 'Business', count: 2140 },
              { targetType: 'Hospital', count: 890 },
              { targetType: 'School', count: 720 },
              { targetType: 'Property', count: 640 },
              { targetType: 'Institution', count: 431 },
            ];
            const total = commentData.reduce((a, b) => a + b.count, 0);
            return commentData.map((c, i) => (
              <HBar key={i} label={c.targetType} count={c.count} total={total} color={SOLID_COLORS[i]} />
            ));
          })()}
        </Card>

        {/* Activity heatmap */}
        <Card title="Platform Activity" icon="🔥" className="db2-card-md">
          <div className="activity-grid">
            <div className="activity-item">
              <span className="activity-icon">👁️</span>
              <div className="activity-info">
                <span className="activity-label">Page Views</span>
                <span className="activity-value">45.2K</span>
                <span className="activity-change positive">+12.5%</span>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">🖱️</span>
              <div className="activity-info">
                <span className="activity-label">Interactions</span>
                <span className="activity-value">18.7K</span>
                <span className="activity-change positive">+8.3%</span>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">⏱️</span>
              <div className="activity-info">
                <span className="activity-label">Avg Session</span>
                <span className="activity-value">4m 32s</span>
                <span className="activity-change positive">+15.2%</span>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">🔄</span>
              <div className="activity-info">
                <span className="activity-label">Return Rate</span>
                <span className="activity-value">68%</span>
                <span className="activity-change positive">+5.1%</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Top contributors */}
        <Card title="Top Contributors" icon="🏆" className="db2-card-md">
          <div className="contributor-list">
            {[
              { name: 'Rajesh Kumar', contributions: 342, type: 'Reviews' },
              { name: 'Priya Sharma', contributions: 298, type: 'Comments' },
              { name: 'Amit Patel', contributions: 276, type: 'Ratings' },
              { name: 'Sneha Reddy', contributions: 245, type: 'Reviews' },
              { name: 'Vikram Singh', contributions: 218, type: 'Comments' },
            ].map((c, i) => (
              <div key={i} className="contributor-row">
                <span className="contributor-rank">{['🥇','🥈','🥉','4','5'][i]}</span>
                <div className="contributor-info">
                  <span className="contributor-name">{c.name}</span>
                  <span className="contributor-type">{c.type}</span>
                </div>
                <span className="contributor-count">{c.contributions}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── ROW: User growth + Geographic ── */}
      <div className="db2-section-header">
        <h2 className="db2-section-title">Growth & Geography</h2>
        <p className="db2-section-desc">Monthly trends and geographic distribution</p>
      </div>
      <div className="db2-row">
        <Card title="Monthly User Growth" icon="📈" className="db2-card-md">
          <BarChart 
            data={growth.users.userGrowth.map((m, i) => ({
              ...m,
              gradient: COLORS[i % COLORS.length]
            }))} 
            color="#2dd4bf" 
            height={120}
            useGradient={true}
          />
          <div className="chart-insight">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4M12 8h.01"/>
            </svg>
            <span>Peak growth observed in December with 290 new users</span>
          </div>
        </Card>

        <Card title="Geographic Distribution" icon="🌍" className="db2-card-lg">
          <div className="db2-tab-row">
            {[
              { key: 'byCity', label: 'By City' },
              { key: 'byState', label: 'By State' },
              { key: 'byCountry', label: 'By Country' },
            ].map(t => (
              <button
                key={t.key}
                className={`db2-tab ${activeGeoTab === t.key ? 'active' : ''}`}
                onClick={() => setActiveGeoTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="geo-list">
            {geoData.map((item, i) => (
              <HBar
                key={i}
                label={item[geoKey]}
                count={item.count}
                total={geoTotal}
                color={SOLID_COLORS[i % SOLID_COLORS.length]}
              />
            ))}
          </div>
        </Card>
      </div>

      {/* ── ROW: Search queries ── */}
      <div className="db2-section-header">
        <h2 className="db2-section-title">Search Insights</h2>
        <p className="db2-section-desc">Most popular search queries on the platform</p>
      </div>
      <Card title="" icon="" className="db2-card-clean">
        <div className="search-grid">
          {searchAnalytics.topQueries.map((q, i) => (
            <div key={i} className="search-card">
              <div className="search-card-header">
                <span className="search-rank">#{i + 1}</span>
                <span className="search-badge">{fmt(q.count)} searches</span>
              </div>
              <span className="search-query">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                {q.query}
              </span>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
}

export default AdminDashboard2;
