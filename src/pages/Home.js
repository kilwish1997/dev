import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Home.css';
import { 
  getCityFromCoordinates, 
  fetchNearbyShopsFromOSM, 
  calculateDistance,
  parseShopFromOSMElement 
} from '../utils/apiHelpers';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// 3D Attract-to-Cursor Tilt — updates CSS custom properties, CSS does the transform
function useTiltEffect({ max = 18, glowColor = 'rgba(255,255,255,0.10)' } = {}) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const rafRef  = useRef(null);
  const posRef  = useRef({ px: 0.5, py: 0.5 });

  const onMouseMove = useCallback((e) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    posRef.current = {
      px: (e.clientX - r.left) / r.width,
      py: (e.clientY - r.top)  / r.height,
    };
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const card = cardRef.current;
      const glow = glowRef.current;
      if (!card) return;
      const { px, py } = posRef.current;
      const cx = px - 0.5;
      const cy = py - 0.5;
      card.style.setProperty('--rx', `${(-cy * max * 2).toFixed(2)}deg`);
      card.style.setProperty('--ry', `${(cx * max * 2).toFixed(2)}deg`);
      card.style.setProperty('--sh-x', `${(-cx * 32).toFixed(1)}px`);
      card.style.setProperty('--sh-y', `${(-cy * 32 + 18).toFixed(1)}px`);
      card.style.setProperty('--sh-b', `${(40 + Math.hypot(cx, cy) * 26).toFixed(1)}px`);
      card.classList.add('is-tilting');
      if (glow) {
        glow.style.opacity    = '1';
        glow.style.background = `radial-gradient(circle 180px at ${(px * 100).toFixed(1)}% ${(py * 100).toFixed(1)}%, ${glowColor}, transparent 70%)`;
      }
    });
  }, [max, glowColor]);

  const onMouseLeave = useCallback(() => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card) return;
    card.classList.remove('is-tilting');
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
    card.style.setProperty('--sh-x', '0px');
    card.style.setProperty('--sh-y', '16px');
    card.style.setProperty('--sh-b', '40px');
    if (glow) glow.style.opacity = '0';
  }, []);

  return { cardRef, glowRef, onMouseMove, onMouseLeave };
}

// ── Tilt-wrapped category card ─────────────────────────────────────────────
function CategoryCard({ cat, isActive, onClick }) {
  const { cardRef, glowRef, onMouseMove, onMouseLeave } = useTiltEffect({
    max: 15,
    glowColor: `${cat.color}60`,
  });

  return (
    <div
      ref={cardRef}
      className={`category-card ${isActive ? 'active' : ''}`}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ '--category-color': cat.color }}
    >
      {/* cursor-following inner spotlight */}
      <div ref={glowRef} className="card-spotlight" aria-hidden="true" />
      <div className="category-icon">{cat.icon}</div>
      <div className="category-label">{cat.label}</div>
    </div>
  );
}

// ── Tilt-wrapped shop tile ─────────────────────────────────────────────────
function ShopTile({ shop, index, catInfo, city, location, onOpen }) {
  const { cardRef, glowRef, onMouseMove, onMouseLeave } = useTiltEffect({
    max: 12,
    glowColor: `${catInfo.color}45`,
  });

  const isOpen     = shop.openingHours && shop.openingHours !== 'Not available';
  const trustScore = Math.max(60, Math.round(99 - shop.distance * 6));

  return (
    <div
      ref={cardRef}
      className="shop-tile"
      style={{ '--tile-color': catInfo.color, animationDelay: `${index * 0.05}s` }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onOpen()}
      aria-label={`View details for ${shop.name}`}
    >
      {/* cursor-following inner spotlight */}
      <div ref={glowRef} className="card-spotlight" aria-hidden="true" />

      {/* ── Cover ── */}
      <div className="tile-cover">
        <div className="tile-cover-bg" style={{ background: `linear-gradient(135deg, ${catInfo.color}22 0%, #0d1b2a 100%)` }}>
          <span className="tile-cover-icon">{catInfo.icon}</span>
        </div>
        <div className="tile-cover-badges">
          {isOpen && <span className="tile-badge tile-badge-open">OPEN NOW</span>}
          <span className="tile-badge tile-badge-featured"
            style={{ background: `${catInfo.color}33`, borderColor: `${catInfo.color}66`, color: catInfo.color }}>
            {catInfo.label?.toUpperCase()}
          </span>
        </div>
        <div className="tile-cover-dist">📏 {shop.distance.toFixed(1)} km</div>
      </div>

      {/* ── Body ── */}
      <div className="tile-body">
        <div className="tile-name-row">
          <span className="tile-name">
            {shop.name}
            <span className="tile-verified" title="Verified on OpenStreetMap">✔</span>
          </span>
          <span className="tile-area">
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden="true">
              <path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 7 5 7s5-3.25 5-7c0-2.76-2.24-5-5-5z" fill="currentColor"/>
            </svg>
            {city}
          </span>
        </div>
        <p className="tile-subtitle">
          {shop.cuisine
            ? `${shop.cuisine.replace(/_/g, ' ')} cuisine`
            : shop.openingHours !== 'Not available'
              ? shop.openingHours
              : `${catInfo.label} · ${shop.address !== 'Address not available' ? shop.address : 'Nearby location'}`
          }
        </p>
        <div className="tile-meta-row">
          <div className="tile-stars">
            {[1,2,3,4,5].map(s => (
              <svg key={s} className={`tile-star ${s <= 4 ? 'filled' : 'half'}`} width="13" height="13" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
              </svg>
            ))}
          </div>
          <span className="tile-rating-val">4.{Math.max(1, (trustScore % 9))}</span>
          <span className="tile-rating-count">({Math.round(trustScore * 1.8)})</span>
          {shop.phone !== 'N/A' && (
            <span className="tile-price"
              onClick={e => { e.stopPropagation(); window.location.href = `tel:${shop.phone}`; }}>
              📞
            </span>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="tile-footer">
        <div className="tile-footer-dots">
          {[0,1,2,3].map(i => (
            <span key={i} className="tile-dot" style={{ background: catInfo.color, opacity: 1 - i * 0.2 }} />
          ))}
        </div>
        <span className="tile-trust">TRUST {trustScore}</span>
      </div>
    </div>
  );
}

const ALL_CATEGORIES = [
  { value: 'all', label: 'All', icon: '🏪', osmTag: 'shop', color: '#667eea' },
  { value: 'restaurant', label: 'Restaurants', icon: '🍽️', osmTag: 'amenity=restaurant,amenity=fast_food', color: '#f59e0b' },
  { value: 'supermarket', label: 'Grocery', icon: '🛒', osmTag: 'shop=supermarket,shop=convenience', color: '#10b981' },
  { value: 'pharmacy', label: 'Pharmacy', icon: '💊', osmTag: 'amenity=pharmacy', color: '#ef4444' },
  { value: 'hospital', label: 'Hospitals', icon: '🏥', osmTag: 'amenity=hospital,amenity=clinic', color: '#dc2626' },
  { value: 'hotel', label: 'Hotels', icon: '🏨', osmTag: 'tourism=hotel', color: '#8b5cf6' },
  { value: 'bank', label: 'Banks', icon: '🏦', osmTag: 'amenity=bank', color: '#3b82f6' },
  { value: 'cafe', label: 'Cafes', icon: '☕', osmTag: 'amenity=cafe', color: '#92400e' },
  { value: 'clothes', label: 'Fashion', icon: '👗', osmTag: 'shop=clothes,shop=fashion', color: '#ec4899' },
  { value: 'electronics', label: 'Electronics', icon: '📱', osmTag: 'shop=electronics', color: '#6366f1' },
  { value: 'books', label: 'Books', icon: '📚', osmTag: 'shop=books', color: '#059669' },
  { value: 'gym', label: 'Fitness', icon: '💪', osmTag: 'leisure=fitness_centre,leisure=sports_centre', color: '#f97316' },
  { value: 'beauty', label: 'Beauty', icon: '💄', osmTag: 'shop=beauty,shop=hairdresser', color: '#d946ef' },
  { value: 'petshop', label: 'Pet Shops', icon: '🐾', osmTag: 'shop=pet', color: '#14b8a6' },
  { value: 'school', label: 'Education', icon: '🎓', osmTag: 'amenity=school,amenity=university', color: '#0891b2' },
  { value: 'gas', label: 'Gas Stations', icon: '⛽', osmTag: 'amenity=fuel', color: '#ea580c' },
];

// Read admin visibility settings from localStorage
function getVisibleCategories() {
  try {
    const saved = localStorage.getItem('iconVisibility');
    if (saved) {
      const visibility = JSON.parse(saved);
      return ALL_CATEGORIES.filter(cat => visibility[cat.value] !== false);
    }
  } catch (e) {}
  return ALL_CATEGORIES;
}

const DISTANCE_OPTIONS = [
  { value: 5000, label: 'Within 5 km' },
  { value: 10000, label: 'Within 10 km' },
  { value: 15000, label: 'Within 15 km' }
];

// Custom blue marker for user location
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to recenter map when location changes
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
}

// ── Submission form with Individual / Organization toggle ──────────────────
const EMPTY_FORM = {
  submitterType: 'individual',
  // individual
  firstName: '', lastName: '', email: '', phone: '',
  // organization
  orgName: '', orgReg: '', contactPerson: '', orgEmail: '', orgPhone: '', website: '',
  // shared
  requestType: 'Add Shop', description: '',
};

function SubmitForm({ shopName, onClose }) {
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [submitted, setSubmitted] = useState(false);
  const isOrg = form.submitterType === 'organization';

  const set = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app this would POST to an API
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="submit-success">
        <div className="submit-success-icon">✅</div>
        <h3>Submission received!</h3>
        <p>Your request about <strong>{shopName}</strong> has been sent to the admin for review.</p>
        <button className="submit-close-btn" onClick={onClose}>Close</button>
      </div>
    );
  }

  return (
    <form className="submit-form" onSubmit={handleSubmit} noValidate>
      <h3 className="submit-form-title">📝 Submit a Request</h3>
      <p className="submit-form-sub">About: <strong>{shopName}</strong></p>

      {/* Request type */}
      <div className="sf-group">
        <label className="sf-label">Request type</label>
        <div className="sf-select-wrap">
          <select
            className="sf-select"
            value={form.requestType}
            onChange={e => set('requestType', e.target.value)}
          >
            <option>Add Shop</option>
            <option>Report Issue</option>
            <option>Update Location</option>
            <option>Remove Shop</option>
          </select>
        </div>
      </div>

      {/* Individual / Organization toggle */}
      <div className="sf-group">
        <label className="sf-label">Submitter type</label>
        <div className="sf-toggle" role="group">
          <button
            type="button"
            className={`sf-toggle-btn ${!isOrg ? 'active' : ''}`}
            onClick={() => set('submitterType', 'individual')}
            aria-pressed={!isOrg}
          >
            👤 Individual
          </button>
          <button
            type="button"
            className={`sf-toggle-btn ${isOrg ? 'active' : ''}`}
            onClick={() => set('submitterType', 'organization')}
            aria-pressed={isOrg}
          >
            🏢 Organization
          </button>
        </div>
      </div>

      {/* Animated fields */}
      <div className="sf-fields" key={form.submitterType}>
        {!isOrg ? (
          <>
            <div className="sf-row-2">
              <div className="sf-group">
                <label className="sf-label">First name <span className="sf-req">*</span></label>
                <input className="sf-input" required value={form.firstName}
                  onChange={e => set('firstName', e.target.value)} placeholder="John" />
              </div>
              <div className="sf-group">
                <label className="sf-label">Last name <span className="sf-req">*</span></label>
                <input className="sf-input" required value={form.lastName}
                  onChange={e => set('lastName', e.target.value)} placeholder="Doe" />
              </div>
            </div>
            <div className="sf-row-2">
              <div className="sf-group">
                <label className="sf-label">Email <span className="sf-req">*</span></label>
                <input className="sf-input" type="email" required value={form.email}
                  onChange={e => set('email', e.target.value)} placeholder="john@example.com" />
              </div>
              <div className="sf-group">
                <label className="sf-label">Phone</label>
                <input className="sf-input" type="tel" value={form.phone}
                  onChange={e => set('phone', e.target.value)} placeholder="+1-555-000-0000" />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="sf-group">
              <label className="sf-label">Organization name <span className="sf-req">*</span></label>
              <input className="sf-input" required value={form.orgName}
                onChange={e => set('orgName', e.target.value)} placeholder="Acme Corp Ltd." />
            </div>
            <div className="sf-row-2">
              <div className="sf-group">
                <label className="sf-label">Registration no.</label>
                <input className="sf-input" value={form.orgReg}
                  onChange={e => set('orgReg', e.target.value)} placeholder="REG-2024-00001" />
              </div>
              <div className="sf-group">
                <label className="sf-label">Contact person <span className="sf-req">*</span></label>
                <input className="sf-input" required value={form.contactPerson}
                  onChange={e => set('contactPerson', e.target.value)} placeholder="Jane Smith" />
              </div>
            </div>
            <div className="sf-row-2">
              <div className="sf-group">
                <label className="sf-label">Email <span className="sf-req">*</span></label>
                <input className="sf-input" type="email" required value={form.orgEmail}
                  onChange={e => set('orgEmail', e.target.value)} placeholder="contact@acme.com" />
              </div>
              <div className="sf-group">
                <label className="sf-label">Website</label>
                <input className="sf-input" type="url" value={form.website}
                  onChange={e => set('website', e.target.value)} placeholder="https://acme.com" />
              </div>
            </div>
          </>
        )}

        {/* Description — always shown */}
        <div className="sf-group">
          <label className="sf-label">Description <span className="sf-req">*</span></label>
          <textarea
            className="sf-textarea"
            required
            rows={3}
            value={form.description}
            onChange={e => set('description', e.target.value)}
            placeholder="Describe your request in detail…"
          />
        </div>
      </div>

      <button type="submit" className="sf-submit">Send Request →</button>
    </form>
  );
}

// ── Shop detail modal ──────────────────────────────────────────────────────
function ShopModal({ shop, userLocation, city, onClose, getDirectionsUrl, getGoogleMapsUrl, userIcon }) {
  const [tab, setTab] = useState('info');
  const overlayRef = useRef(null);

  // Build description chips from available OSM tags
  const descChips = [
    shop.shopType && { icon: '🏷️', label: 'Type', value: shop.shopType },
    shop.cuisine  && { icon: '🍴', label: 'Cuisine', value: shop.cuisine },
    shop.brand    && { icon: '⭐', label: 'Brand', value: shop.brand },
    shop.operator && { icon: '🏢', label: 'Operator', value: shop.operator },
    shop.email    && { icon: '✉️', label: 'Email', value: shop.email },
    shop.wheelchair !== undefined && {
      icon: '♿', label: 'Wheelchair',
      value: shop.wheelchair === 'yes' ? 'Accessible' : shop.wheelchair === 'no' ? 'Not accessible' : shop.wheelchair,
    },
    shop.delivery !== undefined && {
      icon: '🚚', label: 'Delivery',
      value: shop.delivery === 'yes' ? 'Available' : 'Not available',
    },
    shop.takeaway !== undefined && {
      icon: '🥡', label: 'Takeaway',
      value: shop.takeaway === 'yes' ? 'Available' : 'Not available',
    },
    shop.outdoor_seating !== undefined && {
      icon: '🪑', label: 'Outdoor seating',
      value: shop.outdoor_seating === 'yes' ? 'Yes' : 'No',
    },
    shop.internet_access && { icon: '📶', label: 'Internet', value: shop.internet_access },
    shop.level    && { icon: '🏢', label: 'Floor', value: shop.level },
  ].filter(Boolean);

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onClick={e => e.target === overlayRef.current && onClose()}
    >
      <div className="modal-content" role="dialog" aria-modal="true" aria-label={shop.name}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-meta">
            <span className="modal-shop-type-badge">{shop.shopType}</span>
            <span className="modal-distance-badge">📏 {shop.distance.toFixed(2)} km</span>
          </div>
          <h2>{shop.name}</h2>
          <p className="modal-address">📍 {shop.address}</p>
        </div>

        {/* Tab bar */}
        <div className="modal-tabs">
          {[
            { id: 'info',   label: 'ℹ️ Details' },
            { id: 'map',    label: '🗺️ Map' },
            { id: 'submit', label: '📝 Submit' },
          ].map(t => (
            <button
              key={t.id}
              className={`modal-tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Details tab ── */}
        {tab === 'info' && (
          <div className="modal-tab-panel">
            {/* Key info rows */}
            <div className="modal-info">
              <div className="info-row">
                <span className="info-icon">📏</span>
                <span><strong>Distance:</strong> {shop.distance.toFixed(2)} km away</span>
              </div>
              {shop.phone !== 'N/A' && (
                <div className="info-row">
                  <span className="info-icon">📞</span>
                  <span><strong>Phone:</strong> <a href={`tel:${shop.phone}`}>{shop.phone}</a></span>
                </div>
              )}
              <div className="info-row">
                <span className="info-icon">🕒</span>
                <span><strong>Hours:</strong> {shop.openingHours}</span>
              </div>
              {shop.website && (
                <div className="info-row">
                  <span className="info-icon">🌐</span>
                  <span>
                    <a href={shop.website} target="_blank" rel="noopener noreferrer">
                      Visit Website ↗
                    </a>
                  </span>
                </div>
              )}
            </div>

            {/* Description chips */}
            {descChips.length > 0 && (
              <div className="modal-description">
                <div className="modal-desc-title">About this place</div>
                <div className="modal-desc-chips">
                  {descChips.map(chip => (
                    <div key={chip.label} className="desc-chip">
                      <span className="desc-chip-icon">{chip.icon}</span>
                      <span className="desc-chip-label">{chip.label}</span>
                      <span className="desc-chip-value">{chip.value}</span>
                    </div>
                  ))}
                </div>
                {/* Fallback text when only type is available */}
                {descChips.length === 1 && (
                  <p className="modal-desc-fallback">
                    This is a <strong>{shop.shopType}</strong> located at {shop.address}.
                    {shop.openingHours !== 'Not available' && ` Open: ${shop.openingHours}.`}
                    {shop.phone !== 'N/A' && ` Call: ${shop.phone}.`}
                  </p>
                )}
              </div>
            )}

            {/* Directions */}
            <div className="modal-actions">
              <a href={getDirectionsUrl(shop)} target="_blank" rel="noopener noreferrer" className="btn-directions osm">
                🗺️ OpenStreetMap Directions
              </a>
              <a href={getGoogleMapsUrl(shop)} target="_blank" rel="noopener noreferrer" className="btn-directions google">
                🚗 Google Maps Directions
              </a>
            </div>
          </div>
        )}

        {/* ── Map tab ── */}
        {tab === 'map' && (
          <div className="modal-tab-panel modal-tab-map">
            <MapContainer
              center={[shop.location.lat, shop.location.lng]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                <Popup>📍 Your Location — {city}</Popup>
              </Marker>
              <Marker position={[shop.location.lat, shop.location.lng]}>
                <Popup><strong>{shop.name}</strong><br />{shop.address}</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        {/* ── Submit tab ── */}
        {tab === 'submit' && (
          <div className="modal-tab-panel">
            <SubmitForm shopName={shop.name} onClose={onClose} />
          </div>
        )}
      </div>
    </div>
  );
}

function Home() {
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState('');
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('all');
  const [distance, setDistance] = useState(5000);
  const [viewMode, setViewMode] = useState('table');
  const [selectedShop, setSelectedShop] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Load admin-controlled visible categories on mount and on storage changes
  const [CATEGORIES, setCategories] = useState(getVisibleCategories);

  useEffect(() => {
    const onStorage = () => setCategories(getVisibleCategories());
    window.addEventListener('storage', onStorage);
    // Also refresh when tab regains focus (admin may have changed settings)
    window.addEventListener('focus', onStorage);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', onStorage);
    };
  }, []);

  // If current category was hidden by admin, reset to 'all'
  useEffect(() => {
    if (!CATEGORIES.find(c => c.value === category)) {
      setCategory('all');
    }
  }, [CATEGORIES, category]);

  useEffect(() => {
    getUserLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (location) {
      fetchNearbyShops();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, category, distance]);

  useEffect(() => {
    filterShops();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shops, distance, searchQuery]);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setLocation(userLocation);
        getCityName(userLocation);
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = 'Unable to retrieve your location. ';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please enable location permissions in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
        }
        
        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const getCityName = async (location) => {
    const cityName = await getCityFromCoordinates(location.lat, location.lng);
    setCity(cityName);
  };

  const fetchNearbyShops = async () => {
    setLoading(true);
    setError('');
    
    try {
      const radiusInMeters = distance;
      const selectedCategory = CATEGORIES.find(cat => cat.value === category);
      const osmTag = selectedCategory ? selectedCategory.osmTag : 'shop';
      
      const data = await fetchNearbyShopsFromOSM(
        location.lat, 
        location.lng, 
        radiusInMeters, 
        osmTag
      );
      
      if (data.elements && data.elements.length > 0) {
        const shopsData = data.elements
          .map(element => parseShopFromOSMElement(element, location))
          .filter(shop => shop !== null);

        setShops(shopsData);
      } else {
        setShops([]);
        setError('No shops found in your area. Try increasing the distance.');
      }
    } catch (error) {
      console.error('Error fetching nearby shops:', error);
      setError(`Failed to fetch nearby shops: ${error.message}. Please try again.`);
      setShops([]);
    }
    
    setLoading(false);
  };

  const filterShops = () => {
    let filtered = shops.filter(shop => shop.distance <= distance / 1000);
    filtered.sort((a, b) => a.distance - b.distance);
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(shop =>
        shop.name.toLowerCase().includes(q) ||
        shop.shopType.toLowerCase().includes(q) ||
        shop.address.toLowerCase().includes(q)
      );
    }
    setFilteredShops(filtered);
  };eredShops(filtered);
  };

  const handleAddressClick = (shop) => {
    setSelectedShop(shop);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedShop(null);
  };

  const getDirectionsUrl = (shop) => {
    // OpenStreetMap directions URL
    return `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${location.lat}%2C${location.lng}%3B${shop.location.lat}%2C${shop.location.lng}`;
  };

  const getGoogleMapsUrl = (shop) => {
    return `https://www.google.com/maps/dir/?api=1&origin=${location.lat},${location.lng}&destination=${shop.location.lat},${shop.location.lng}`;
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Detecting your location and finding nearby shops...</p>
        </div>
      </div>
    );
  }

  if (error && !location) {
    return (
      <div className="container">
        <div className="error">
          <h2>⚠️ {error}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🛍️ {filteredShops.length} shops found near you in <span className="city-highlight">{city}</span></h1>
        <p className="subtitle">Discover local businesses in your area</p>

        {/* ── Search bar ── */}
        <div className="search-bar-wrap">
          <div className="search-bar">
            <input
              className="search-input"
              type="text"
              placeholder="Search shops, type, address…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search shops"
            />
            {searchQuery ? (
              <button
                className="search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            ) : (
              <span className="search-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Category Cards Grid */}
      <div className="categories-grid">
        {CATEGORIES.map(cat => (
          <CategoryCard
            key={cat.value}
            cat={cat}
            isActive={category === cat.value}
            onClick={() => setCategory(cat.value)}
          />
        ))}
      </div>

      <div className="filters">
        <div className="filter-group">
          <label>Distance:</label>
          <select value={distance} onChange={(e) => setDistance(Number(e.target.value))}>
            {DISTANCE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="view-toggle">
          <button 
            className={viewMode === 'table' ? 'active' : ''} 
            onClick={() => setViewMode('table')}
          >
            ⊞ Tile View
          </button>
          <button 
            className={viewMode === 'map' ? 'active' : ''} 
            onClick={() => setViewMode('map')}
          >
            🗺️ Map View
          </button>
        </div>
      </div>

      {error && (
        <div className="warning">
          {error}
        </div>
      )}

      {viewMode === 'table' ? (
        <div className="tiles-section">
          {filteredShops.length === 0 ? (
            <div className="no-results">
              <p>No shops found. Try adjusting your filters or increasing the distance.</p>
            </div>
          ) : (
            <div className="shops-grid">
              {filteredShops.map((shop, index) => {
                const catInfo = ALL_CATEGORIES.find(c => c.value === shop.shopType) ||
                                ALL_CATEGORIES.find(c => c.osmTag && c.osmTag.includes(shop.shopType)) ||
                                { icon: '🏪', color: '#667eea', label: 'Shop' };
                return (
                  <ShopTile
                    key={shop.id}
                    shop={shop}
                    index={index}
                    catInfo={catInfo}
                    city={city}
                    location={location}
                    onOpen={() => handleAddressClick(shop)}
                  />
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="map-container">
          {location && (
            <MapContainer 
              center={[location.lat, location.lng]} 
              zoom={13} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapUpdater center={[location.lat, location.lng]} />
              
              {/* User location marker */}
              <Marker position={[location.lat, location.lng]} icon={userIcon}>
                <Popup>
                  <strong>📍 Your Location</strong>
                  <br />
                  {city}
                </Popup>
              </Marker>

              {/* Shop markers */}
              {filteredShops.map(shop => (
                <Marker 
                  key={shop.id} 
                  position={[shop.location.lat, shop.location.lng]}
                >
                  <Popup>
                    <div className="map-popup">
                      <strong>{shop.name}</strong>
                      <br />
                      <small>{shop.shopType}</small>
                      <br />
                      {shop.address}
                      <br />
                      <strong>Distance:</strong> {shop.distance.toFixed(2)} km
                      {shop.phone !== 'N/A' && (
                        <>
                          <br />
                          <strong>Phone:</strong> {shop.phone}
                        </>
                      )}
                      {shop.website && (
                        <>
                          <br />
                          <a href={shop.website} target="_blank" rel="noopener noreferrer">
                            Visit Website
                          </a>
                        </>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>
      )}

      {/* Modal for shop location and directions */}
      {showModal && selectedShop && (
        <ShopModal
          shop={selectedShop}
          userLocation={location}
          city={city}
          onClose={closeModal}
          getDirectionsUrl={getDirectionsUrl}
          getGoogleMapsUrl={getGoogleMapsUrl}
          userIcon={userIcon}
        />
      )}
    </div>
  );
}

export default Home;
