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
    // Individual fields
    submitterType: 'individual',
    firstName: 'John',
    lastName: 'Doe',
    // Org fields
    orgName: '',
    orgReg: '',
    contactPerson: '',
    website: '',
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
    submitterType: 'individual',
    firstName: 'Jane',
    lastName: 'Smith',
    orgName: '',
    orgReg: '',
    contactPerson: '',
    website: '',
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
    submitterType: 'organization',
    firstName: '',
    lastName: '',
    orgName: 'Fashion Hub Ltd.',
    orgReg: 'REG-2019-00341',
    contactPerson: 'Mike Johnson',
    website: 'https://fashionhub.com',
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
    submitterType: 'individual',
    firstName: 'Sarah',
    lastName: 'Williams',
    orgName: '',
    orgReg: '',
    contactPerson: '',
    website: '',
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
    submitterType: 'organization',
    firstName: '',
    lastName: '',
    orgName: 'Brew & Bean Co.',
    orgReg: 'REG-2023-00887',
    contactPerson: 'Carlos Rivera',
    website: 'https://brewandbean.com',
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
    submitterType: 'individual',
    firstName: 'Priya',
    lastName: 'Patel',
    orgName: '',
    orgReg: '',
    contactPerson: '',
    website: '',
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
                    <div className="action-header-left">
                      <span
                        className="submission-type-badge"
                        style={{
                          background: typeStyle.bg,
                          border: `1px solid ${typeStyle.border}`,
                          color: typeStyle.text,
                        }}
                      >
                        {TYPE_ICONS[sub.type]} {sub.type}
                      </span>
                      <span className="action-shop-name">{sub.shop}</span>
                      <span className="action-category">{sub.category}</span>
                      {/* Submitter type pill in collapsed row */}
                      <span className={`submitter-pill ${sub.submitterType}`}>
                        {sub.submitterType === 'individual' ? '👤 Individual' : '🏢 Organization'}
                      </span>
                    </div>
                    <div className="action-header-right">
                      <span className={`status-badge ${sub.status}`}>
                        {sub.status.toUpperCase()}
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
    </div>
  );
}

export default Admin;
