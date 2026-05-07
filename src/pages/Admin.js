import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Admin.css';

const INITIAL_SUBMISSIONS = [
  {
    id: 1,
    user: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1-555-010-1234',
    type: 'Add Shop',
    shop: 'Fresh Mart Grocery',
    category: 'Grocery',
    description: 'New supermarket opened on Main Street. Has fresh produce, bakery, and deli sections.',
    date: '2026-04-20',
    status: 'pending',
    enabled: true,
    submitterType: 'individual',
    firstName: 'John', lastName: 'Doe',
    orgName: '', orgReg: '', contactPerson: '', website: '',
  },
  {
    id: 2,
    user: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1-555-020-5678',
    type: 'Report Issue',
    shop: 'City Pharmacy',
    category: 'Pharmacy',
    description: 'Opening hours listed as 9am–5pm but the shop actually closes at 8pm on weekdays.',
    date: '2026-04-19',
    status: 'pending',
    enabled: true,
    submitterType: 'individual',
    firstName: 'Jane', lastName: 'Smith',
    orgName: '', orgReg: '', contactPerson: '', website: '',
  },
  {
    id: 3,
    user: 'Fashion Hub Ltd.',
    email: 'contact@fashionhub.com',
    phone: '+1-555-030-9012',
    type: 'Update Location',
    shop: 'Fashion Hub',
    category: 'Fashion',
    description: 'The shop has moved to the new shopping centre on Park Avenue, 2nd floor.',
    date: '2026-04-18',
    status: 'approved',
    enabled: true,
    submitterType: 'organization',
    firstName: '', lastName: '',
    orgName: 'Fashion Hub Ltd.', orgReg: 'REG-2019-00341',
    contactPerson: 'Mike Johnson', website: 'https://fashionhub.com',
  },
  {
    id: 4,
    user: 'Sarah Williams',
    email: 'sarah.w@example.com',
    phone: '+1-555-040-3456',
    type: 'Remove Shop',
    shop: 'Old Electronics Store',
    category: 'Electronics',
    description: 'This shop has been permanently closed for over 6 months. Should be removed from listings.',
    date: '2026-04-17',
    status: 'declined',
    enabled: false,
    submitterType: 'individual',
    firstName: 'Sarah', lastName: 'Williams',
    orgName: '', orgReg: '', contactPerson: '', website: '',
  },
  {
    id: 5,
    user: 'Brew & Bean Co.',
    email: 'hello@brewandbean.com',
    phone: '+1-555-050-7890',
    type: 'Add Shop',
    shop: 'Brew & Bean Café',
    category: 'Cafes',
    description: 'Specialty coffee shop with co-working space. Open 7am–10pm daily.',
    date: '2026-04-16',
    status: 'pending',
    enabled: true,
    submitterType: 'organization',
    firstName: '', lastName: '',
    orgName: 'Brew & Bean Co.', orgReg: 'REG-2023-00887',
    contactPerson: 'Carlos Rivera', website: 'https://brewandbean.com',
  },
  {
    id: 6,
    user: 'Priya Patel',
    email: 'priya.p@example.com',
    phone: '+1-555-060-2345',
    type: 'Report Issue',
    shop: 'Central Bank Branch',
    category: 'Banks',
    description: 'Phone number on the listing is incorrect. The correct number is +1-800-555-0199.',
    date: '2026-04-15',
    status: 'approved',
    enabled: true,
    submitterType: 'individual',
    firstName: 'Priya', lastName: 'Patel',
    orgName: '', orgReg: '', contactPerson: '', website: '',
  },
];

const TYPE_COLORS = {
  'Add Shop':        { bg: 'rgba(16,185,129,0.12)',  border: '#10b981', text: '#10b981' },
  'Report Issue':    { bg: 'rgba(245,158,11,0.12)',  border: '#f59e0b', text: '#f59e0b' },
  'Update Location': { bg: 'rgba(99,102,241,0.12)',  border: '#6366f1', text: '#a5b4fc' },
  'Remove Shop':     { bg: 'rgba(239,68,68,0.12)',   border: '#ef4444', text: '#ef4444' },
};

const TYPE_ICONS = {
  'Add Shop': '➕',
  'Report Issue': '⚠️',
  'Update Location': '📍',
  'Remove Shop': '🗑️',
};

// ── Priority tiers ─────────────────────────────────────────────────────────
const PRIORITY_TIERS = [
  { level: 3, label: 'Platinum', icon: '💎', color: '#a78bfa', price: '₹2999/mo', perks: 'Top of all results · Featured badge · Highlighted card' },
  { level: 2, label: 'Gold',     icon: '🥇', color: '#f59e0b', price: '₹1499/mo', perks: 'Above standard results · Gold badge' },
  { level: 1, label: 'Silver',   icon: '🥈', color: '#94a3b8', price: '₹699/mo',  perks: 'Slightly boosted · Silver badge' },
  { level: 0, label: 'Standard', icon: '🏪', color: '#475569', price: 'Free',      perks: 'Default position · No badge' },
];

const INITIAL_PRIORITY_SHOPS = [
  { id: 101, name: 'Fresh Mart Grocery', category: 'Grocery',   owner: 'John Doe',       contact: '+91 98100 00001', priority: 3, expiresOn: '2026-07-20', paid: true  },
  { id: 102, name: 'Brew & Bean Café',   category: 'Cafes',     owner: 'Carlos Rivera',  contact: '+91 98100 00002', priority: 2, expiresOn: '2026-06-16', paid: true  },
  { id: 103, name: 'Fashion Hub',        category: 'Fashion',   owner: 'Mike Johnson',   contact: '+91 98100 00003', priority: 1, expiresOn: '2026-05-18', paid: true  },
  { id: 104, name: 'City Pharmacy',      category: 'Pharmacy',  owner: 'Jane Smith',     contact: '+91 98100 00004', priority: 0, expiresOn: null,         paid: false },
];

// ── Shop Priority Section ──────────────────────────────────────────────────
function ShopPrioritySection() {
  const [shops, setShops] = useState(INITIAL_PRIORITY_SHOPS);
  const [addForm, setAddForm] = useState({ name: '', category: '', owner: '', contact: '', priority: 1, expiresOn: '' });
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);

  const tierOf = (level) => PRIORITY_TIERS.find(t => t.level === level);

  const handlePriorityChange = (id, newLevel) => {
    setShops(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, priority: Number(newLevel), paid: Number(newLevel) > 0 } : s);
      try { localStorage.setItem('shopPriorities', JSON.stringify(updated.map(s => ({ id: s.id, name: s.name, priority: s.priority })))); } catch (e) {}
      return updated;
    });
  };

  const handleDelete = (id) => setShops(prev => prev.filter(s => s.id !== id));

  const handleAdd = (e) => {
    e.preventDefault();
    const newShop = { ...addForm, id: Date.now(), paid: addForm.priority > 0, priority: Number(addForm.priority) };
    setShops(prev => [...prev, newShop]);
    setAddForm({ name: '', category: '', owner: '', contact: '', priority: 1, expiresOn: '' });
    setShowAdd(false);
  };

  // Sort by priority desc
  const sorted = [...shops].sort((a, b) => b.priority - a.priority);

  return (
    <section className="priority-section">

      {/* Header */}
      <div className="priority-header">
        <div>
          <h2 className="priority-heading">
            <span className="priority-heading-icon">⚡</span> Shop Priority & Boost
          </h2>
          <p className="priority-subheading">
            Shops with higher priority appear at the top of search results. Manage paid boosts here.
          </p>
        </div>
        <button className="priority-add-btn" onClick={() => setShowAdd(v => !v)}>
          {showAdd ? '✕ Cancel' : '+ Add Shop'}
        </button>
      </div>

      {/* Tier legend */}
      <div className="priority-tiers">
        {PRIORITY_TIERS.map(t => (
          <div key={t.level} className="priority-tier-card" style={{ '--tier-color': t.color }}>
            <span className="tier-icon">{t.icon}</span>
            <div className="tier-info">
              <span className="tier-label">{t.label}</span>
              <span className="tier-price">{t.price}</span>
            </div>
            <span className="tier-perks">{t.perks}</span>
          </div>
        ))}
      </div>

      {/* Add shop form */}
      {showAdd && (
        <form className="priority-add-form" onSubmit={handleAdd}>
          <h3 className="paf-title">Add Shop to Priority List</h3>
          <div className="paf-grid">
            <div className="paf-group">
              <label className="paf-label">Shop Name *</label>
              <input className="paf-input" required placeholder="e.g. City Bakery" value={addForm.name}
                onChange={e => setAddForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="paf-group">
              <label className="paf-label">Category *</label>
              <input className="paf-input" required placeholder="e.g. Bakery" value={addForm.category}
                onChange={e => setAddForm(p => ({ ...p, category: e.target.value }))} />
            </div>
            <div className="paf-group">
              <label className="paf-label">Owner Name *</label>
              <input className="paf-input" required placeholder="Full name" value={addForm.owner}
                onChange={e => setAddForm(p => ({ ...p, owner: e.target.value }))} />
            </div>
            <div className="paf-group">
              <label className="paf-label">Contact</label>
              <input className="paf-input" placeholder="+91 XXXXX XXXXX" value={addForm.contact}
                onChange={e => setAddForm(p => ({ ...p, contact: e.target.value }))} />
            </div>
            <div className="paf-group">
              <label className="paf-label">Priority Tier *</label>
              <select className="paf-input" value={addForm.priority}
                onChange={e => setAddForm(p => ({ ...p, priority: Number(e.target.value) }))}>
                {PRIORITY_TIERS.map(t => (
                  <option key={t.level} value={t.level}>{t.icon} {t.label} — {t.price}</option>
                ))}
              </select>
            </div>
            <div className="paf-group">
              <label className="paf-label">Expires On</label>
              <input className="paf-input" type="date" value={addForm.expiresOn}
                onChange={e => setAddForm(p => ({ ...p, expiresOn: e.target.value }))} />
            </div>
          </div>
          <button type="submit" className="paf-submit">Add to Priority List →</button>
        </form>
      )}

      {/* Priority table */}
      <div className="priority-table-wrap">
        <table className="priority-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Shop</th>
              <th>Owner</th>
              <th>Contact</th>
              <th>Tier</th>
              <th>Expires</th>
              <th>Change Tier</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((shop, idx) => {
              const tier = tierOf(shop.priority);
              return (
                <tr key={shop.id} className={`priority-row priority-row-${shop.priority}`}>
                  <td className="priority-rank">
                    <span className="rank-num">#{idx + 1}</span>
                  </td>
                  <td className="priority-shop-cell">
                    <span className="priority-shop-name">{shop.name}</span>
                    <span className="priority-shop-cat">{shop.category}</span>
                  </td>
                  <td className="priority-owner">{shop.owner}</td>
                  <td className="priority-contact">
                    {shop.contact
                      ? <a href={`tel:${shop.contact}`} className="priority-contact-link">{shop.contact}</a>
                      : '—'}
                  </td>
                  <td>
                    <span className="priority-tier-badge" style={{ '--tier-color': tier.color }}>
                      {tier.icon} {tier.label}
                    </span>
                  </td>
                  <td className="priority-expires">
                    {shop.expiresOn
                      ? <span className={new Date(shop.expiresOn) < new Date() ? 'expired-text' : ''}>{shop.expiresOn}</span>
                      : <span className="no-expiry">—</span>}
                  </td>
                  <td>
                    <select
                      className="priority-select"
                      value={shop.priority}
                      onChange={e => handlePriorityChange(shop.id, e.target.value)}
                      style={{ '--tier-color': tier.color }}
                    >
                      {PRIORITY_TIERS.map(t => (
                        <option key={t.level} value={t.level}>{t.icon} {t.label}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button className="priority-delete-btn" onClick={() => handleDelete(shop.id)} title="Remove">✕</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </section>
  );
}

// ── Submitter detail form ──────────────────────────────────────────────────
function SubmitterDetail({ sub, onTypeChange }) {
  const isOrg = sub.submitterType === 'organization';

  return (
    <div className="submitter-detail">

      {/* Toggle */}
      <div className="submitter-toggle-wrap">
        <span className="submitter-toggle-label">Submitter type</span>
        <div className="submitter-toggle" role="group" aria-label="Submitter type">
          <button
            className={`st-btn ${!isOrg ? 'active' : ''}`}
            onClick={() => onTypeChange(sub.id, 'individual')}
            aria-pressed={!isOrg}
          >
            👤 Individual
          </button>
          <button
            className={`st-btn ${isOrg ? 'active' : ''}`}
            onClick={() => onTypeChange(sub.id, 'organization')}
            aria-pressed={isOrg}
          >
            🏢 Organization
          </button>
        </div>
      </div>

      {/* Fields */}
      <div className="submitter-fields">
        {!isOrg ? (
          /* ── Individual fields ── */
          <>
            <div className="sf-row">
              <div className="sf-field">
                <span className="info-label">First Name</span>
                <span>{sub.firstName || '—'}</span>
              </div>
              <div className="sf-field">
                <span className="info-label">Last Name</span>
                <span>{sub.lastName || '—'}</span>
              </div>
            </div>
            <div className="sf-row">
              <div className="sf-field">
                <span className="info-label">Email</span>
                <a href={`mailto:${sub.email}`} className="admin-email-link">{sub.email}</a>
              </div>
              <div className="sf-field">
                <span className="info-label">Phone</span>
                <span>{sub.phone || '—'}</span>
              </div>
            </div>
          </>
        ) : (
          /* ── Organization fields ── */
          <>
            <div className="sf-row">
              <div className="sf-field sf-full">
                <span className="info-label">Organization Name</span>
                <span>{sub.orgName || '—'}</span>
              </div>
            </div>
            <div className="sf-row">
              <div className="sf-field">
                <span className="info-label">Registration No.</span>
                <span>{sub.orgReg || '—'}</span>
              </div>
              <div className="sf-field">
                <span className="info-label">Contact Person</span>
                <span>{sub.contactPerson || '—'}</span>
              </div>
            </div>
            <div className="sf-row">
              <div className="sf-field">
                <span className="info-label">Email</span>
                <a href={`mailto:${sub.email}`} className="admin-email-link">{sub.email}</a>
              </div>
              <div className="sf-field">
                <span className="info-label">Website</span>
                {sub.website
                  ? <a href={sub.website} target="_blank" rel="noopener noreferrer" className="admin-email-link">{sub.website}</a>
                  : <span>—</span>
                }
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main Admin component ───────────────────────────────────────────────────
function Admin() {
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState('');

  const handleApprove = (id) =>
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: 'approved' } : s));

  const handleDecline = (id) =>
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: 'declined' } : s));

  const handleDelete = (id) => {
    setSubmissions(prev => prev.filter(s => s.id !== id));
    if (expanded === id) setExpanded(null);
  };

  // Toggle shop enabled/disabled — persists to localStorage
  const handleToggleEnabled = (id) => {
    setSubmissions(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s);
      // persist disabled shop IDs so Home page can read them
      const disabledIds = updated.filter(s => !s.enabled).map(s => s.id);
      try { localStorage.setItem('disabledShops', JSON.stringify(disabledIds)); } catch (e) {}
      return updated;
    });
  };

  // Switch submitter type for a specific card
  const handleTypeChange = (id, newType) =>
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, submitterType: newType } : s));

  const toggleExpand = (id) =>
    setExpanded(prev => prev === id ? null : id);

  const allTypes = ['all', ...Array.from(new Set(INITIAL_SUBMISSIONS.map(s => s.type)))];

  const filtered = submissions.filter(s => {
    const matchStatus = filter === 'all' || s.status === filter;
    const matchType   = typeFilter === 'all' || s.type === typeFilter;
    const matchSearch = search === '' ||
      s.shop.toLowerCase().includes(search.toLowerCase()) ||
      s.user.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchType && matchSearch;
  });

  const stats = {
    total:    submissions.length,
    pending:  submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    declined: submissions.filter(s => s.status === 'declined').length,
  };

  return (
    <div className="admin-container">

      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-glow" />
        <h1>🔐 Admin Dashboard</h1>
        <p className="admin-subtitle">Review user submissions and manage shop data requests</p>
        <Link to="/icon-control" className="admin-icon-control-link">
          🎛️ Manage Icon Visibility
        </Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {[
          { label: 'Total',    value: stats.total,    cls: '',         icon: '📋' },
          { label: 'Pending',  value: stats.pending,  cls: 'pending',  icon: '⏳' },
          { label: 'Approved', value: stats.approved, cls: 'approved', icon: '✅' },
          { label: 'Declined', value: stats.declined, cls: 'declined', icon: '❌' },
        ].map(s => (
          <div key={s.label} className={`stat-card ${s.cls}`}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="admin-controls">
        <div className="admin-search-wrap">
          <span className="admin-search-icon">🔍</span>
          <input
            className="admin-search"
            type="text"
            placeholder="Search by shop, user, or category…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="admin-search-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        <div className="filter-row">
          <span className="filter-label">Status</span>
          <div className="filter-buttons">
            {['all', 'pending', 'approved', 'declined'].map(f => (
              <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-row">
          <span className="filter-label">Type</span>
          <div className="filter-buttons">
            {allTypes.map(t => (
              <button key={t} className={typeFilter === t ? 'active' : ''} onClick={() => setTypeFilter(t)}>
                {t === 'all' ? 'All Types' : `${TYPE_ICONS[t]} ${t}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results bar */}
      <div className="admin-results-bar">
        <span>
          Showing <strong>{filtered.length}</strong> of <strong>{submissions.length}</strong> submissions
        </span>
        {(filter !== 'all' || typeFilter !== 'all' || search) && (
          <button
            className="admin-clear-filters"
            onClick={() => { setFilter('all'); setTypeFilter('all'); setSearch(''); }}
          >
            ✕ Clear filters
          </button>
        )}
      </div>

      {/* Submissions list */}
      <div className="actions-container">
        {filtered.length === 0 ? (
          <div className="no-actions">
            <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>🔎</div>
            No submissions match your filters.
          </div>
        ) : (
          <div className="actions-list">
            {filtered.map(sub => {
              const typeStyle = TYPE_COLORS[sub.type] || {};
              const isOpen = expanded === sub.id;

              return (
                <div key={sub.id} className={`action-card ${sub.status} ${isOpen ? 'expanded' : ''}`}>

                  {/* Collapsed header row */}
                  <div
                    className="action-header"
                    onClick={() => toggleExpand(sub.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && toggleExpand(sub.id)}
                    aria-expanded={isOpen}
                  >
                    {/* Col 1 — type dot + icon */}
                    <span
                      className="type-dot"
                      style={{ background: typeStyle.border }}
                      title={sub.type}
                    />

                    {/* Col 2 — shop name + meta */}
                    <div className="action-main">
                      <span className="action-shop-name">
                        {sub.shop}
                        {!sub.enabled && (
                          <span className="shop-disabled-badge">disabled</span>
                        )}
                      </span>
                      <div className="action-meta-row">
                        <span
                          className="type-tag"
                          style={{ color: typeStyle.text, background: typeStyle.bg, borderColor: typeStyle.border }}
                        >
                          {TYPE_ICONS[sub.type]} {sub.type}
                        </span>
                        <span className="meta-dot" />
                        <span className="action-category">{sub.category}</span>
                        <span className="meta-dot" />
                        <span className={`submitter-pill ${sub.submitterType}`}>
                          {sub.submitterType === 'individual' ? '👤 Individual' : '🏢 Org'}
                        </span>
                      </div>
                    </div>

                    {/* Col 3 — right side */}
                    <div className="action-header-right">
                      <span className={`status-badge ${sub.status}`}>
                        {sub.status === 'pending' ? '● Pending' : sub.status === 'approved' ? '✓ Approved' : '✕ Declined'}
                      </span>
                      <span className="action-date">{sub.date}</span>
                      <span className={`expand-chevron ${isOpen ? 'open' : ''}`}>›</span>
                    </div>
                  </div>

                  {/* Expanded body */}
                  {isOpen && (
                    <div className="action-body">

                      {/* Submission meta */}
                      <div className="action-details-grid">
                        <div className="action-detail-row">
                          <span className="info-label">Shop</span>
                          <span>{sub.shop}</span>
                        </div>
                        <div className="action-detail-row">
                          <span className="info-label">Category</span>
                          <span>{sub.category}</span>
                        </div>
                        <div className="action-detail-row">
                          <span className="info-label">Submitted</span>
                          <span>{sub.date}</span>
                        </div>
                        <div className="action-detail-row">
                          <span className="info-label">Phone</span>
                          <span>{sub.phone || '—'}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="action-description">
                        <span className="info-label">Description</span>
                        <p>{sub.description}</p>
                      </div>

                      {/* ── Individual / Organization toggle + fields ── */}
                      <SubmitterDetail sub={sub} onTypeChange={handleTypeChange} />

                      {/* ── Shop visibility toggle ── */}
                      <div className="shop-toggle-row">
                        <div className="shop-toggle-info">
                          <span className="shop-toggle-label">Shop Visibility</span>
                          <span className="shop-toggle-desc">
                            {sub.enabled
                              ? 'Shop is visible to users on the map'
                              : 'Shop is hidden from all users'}
                          </span>
                        </div>
                        <button
                          className={`shop-toggle-btn ${sub.enabled ? 'on' : 'off'}`}
                          onClick={() => handleToggleEnabled(sub.id)}
                          aria-pressed={sub.enabled}
                          aria-label={`${sub.enabled ? 'Disable' : 'Enable'} ${sub.shop}`}
                        >
                          <span className="shop-toggle-track">
                            <span className="shop-toggle-knob" />
                          </span>
                          <span className="shop-toggle-text">
                            {sub.enabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </button>
                      </div>

                      {/* Action buttons */}
                      <div className="action-buttons">
                        {sub.status === 'pending' && (
                          <>
                            <button className="btn-approve" onClick={() => handleApprove(sub.id)}>
                              ✓ Approve
                            </button>
                            <button className="btn-decline" onClick={() => handleDecline(sub.id)}>
                              ✗ Decline
                            </button>
                          </>
                        )}
                        {sub.status === 'approved' && (
                          <button className="btn-decline" onClick={() => handleDecline(sub.id)}>
                            ↩ Revoke Approval
                          </button>
                        )}
                        {sub.status === 'declined' && (
                          <button className="btn-approve" onClick={() => handleApprove(sub.id)}>
                            ↩ Re-approve
                          </button>
                        )}
                        <button className="btn-delete" onClick={() => handleDelete(sub.id)}>
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Shop Priority & Boost ── */}
      <ShopPrioritySection />

    </div>
  );
}

export default Admin;
