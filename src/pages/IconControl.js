import React, { useState, useEffect } from 'react';
import './IconControl.css';

const ALL_CATEGORIES = [
  { value: 'all', label: 'All', icon: '🏪', color: '#667eea' },
  { value: 'restaurant', label: 'Restaurants', icon: '🍽️', color: '#f59e0b' },
  { value: 'supermarket', label: 'Grocery', icon: '🛒', color: '#10b981' },
  { value: 'pharmacy', label: 'Pharmacy', icon: '💊', color: '#ef4444' },
  { value: 'hospital', label: 'Hospitals', icon: '🏥', color: '#dc2626' },
  { value: 'hotel', label: 'Hotels', icon: '🏨', color: '#8b5cf6' },
  { value: 'bank', label: 'Banks', icon: '🏦', color: '#3b82f6' },
  { value: 'cafe', label: 'Cafes', icon: '☕', color: '#92400e' },
  { value: 'clothes', label: 'Fashion', icon: '👗', color: '#ec4899' },
  { value: 'electronics', label: 'Electronics', icon: '📱', color: '#6366f1' },
  { value: 'books', label: 'Books', icon: '📚', color: '#059669' },
  { value: 'gym', label: 'Fitness', icon: '💪', color: '#f97316' },
  { value: 'beauty', label: 'Beauty', icon: '💄', color: '#d946ef' },
  { value: 'petshop', label: 'Pet Shops', icon: '🐾', color: '#14b8a6' },
  { value: 'school', label: 'Education', icon: '🎓', color: '#0891b2' },
  { value: 'gas', label: 'Gas Stations', icon: '⛽', color: '#ea580c' },
];

const STORAGE_KEY = 'iconVisibility';

export function getVisibleCategories() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const visibility = JSON.parse(saved);
      return ALL_CATEGORIES.filter(cat => visibility[cat.value] !== false);
    }
  } catch (e) {}
  return ALL_CATEGORIES;
}

function IconControl() {
  const [visibility, setVisibility] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    // Default: all enabled
    const defaults = {};
    ALL_CATEGORIES.forEach(cat => { defaults[cat.value] = true; });
    return defaults;
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visibility));
  }, [visibility]);

  const toggle = (value) => {
    setVisibility(prev => ({ ...prev, [value]: !prev[value] }));
    setSaved(false);
  };

  const enableAll = () => {
    const all = {};
    ALL_CATEGORIES.forEach(cat => { all[cat.value] = true; });
    setVisibility(all);
    setSaved(false);
  };

  const disableAll = () => {
    const none = {};
    ALL_CATEGORIES.forEach(cat => { none[cat.value] = false; });
    // Keep "All" always available
    none['all'] = true;
    setVisibility(none);
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visibility));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const activeCount = Object.values(visibility).filter(Boolean).length;

  return (
    <div className="ic-container">
      <div className="ic-header">
        <h1>🎛️ Icon Visibility Control</h1>
        <p className="ic-subtitle">
          Toggle which category icons appear on the Home screen. Changes take effect immediately.
        </p>
      </div>

      <div className="ic-stats-bar">
        <span className="ic-stat">
          <span className="ic-stat-num">{activeCount}</span>
          <span className="ic-stat-label">Active</span>
        </span>
        <span className="ic-stat">
          <span className="ic-stat-num">{ALL_CATEGORIES.length - activeCount}</span>
          <span className="ic-stat-label">Hidden</span>
        </span>
        <span className="ic-stat">
          <span className="ic-stat-num">{ALL_CATEGORIES.length}</span>
          <span className="ic-stat-label">Total</span>
        </span>
      </div>

      <div className="ic-toolbar">
        <button className="ic-btn-all" onClick={enableAll}>✅ Enable All</button>
        <button className="ic-btn-none" onClick={disableAll}>🚫 Disable All</button>
        <button className={`ic-btn-save ${saved ? 'saved' : ''}`} onClick={handleSave}>
          {saved ? '✓ Saved!' : '💾 Save Changes'}
        </button>
      </div>

      <div className="ic-grid">
        {ALL_CATEGORIES.map(cat => {
          const isOn = visibility[cat.value] !== false;
          return (
            <div
              key={cat.value}
              className={`ic-card ${isOn ? 'on' : 'off'}`}
              style={{ '--cat-color': cat.color }}
              onClick={() => toggle(cat.value)}
            >
              <div className="ic-card-icon">{cat.icon}</div>
              <div className="ic-card-label">{cat.label}</div>
              <div className={`ic-toggle ${isOn ? 'on' : 'off'}`}>
                <span className="ic-toggle-knob" />
              </div>
              <div className={`ic-badge ${isOn ? 'on' : 'off'}`}>
                {isOn ? 'VISIBLE' : 'HIDDEN'}
              </div>
            </div>
          );
        })}
      </div>

      <div className="ic-note">
        <span>ℹ️</span>
        <span>
          These settings are saved in your browser. The Home page will only show icons marked as <strong>VISIBLE</strong>.
        </span>
      </div>
    </div>
  );
}

export default IconControl;
