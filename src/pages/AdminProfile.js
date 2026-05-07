import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminProfile.css';

function AdminProfile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@fuevo.com',
    phone: '+91 98765 43210',
    role: 'Super Admin',
    department: 'Operations',
    location: 'Mumbai, India',
    bio: 'Platform administrator with full access to all features and settings.',
    joinDate: '2024-01-15',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    navigate('/admin-login');
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    // Simulate save
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    alert('Password changed successfully!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const stats = [
    { label: 'Total Logins', value: '342', icon: '🔑', color: '#2dd4bf' },
    { label: 'Actions Taken', value: '1,248', icon: '⚡', color: '#a78bfa' },
    { label: 'Days Active', value: '145', icon: '📅', color: '#f59e0b' },
    { label: 'Last Login', value: '2 hrs ago', icon: '🕐', color: '#10b981' },
  ];

  const recentActivity = [
    { action: 'Updated user permissions', time: '2 hours ago', icon: '👤', type: 'user' },
    { action: 'Approved 5 new businesses', time: '5 hours ago', icon: '✅', type: 'approval' },
    { action: 'Modified dashboard settings', time: '1 day ago', icon: '⚙️', type: 'settings' },
    { action: 'Exported analytics report', time: '2 days ago', icon: '📊', type: 'report' },
    { action: 'Reviewed flagged content', time: '3 days ago', icon: '🚩', type: 'review' },
  ];

  return (
    <div className="admin-profile-container">
      
      {/* Header */}
      <div className="admin-profile-header">
        <div className="admin-profile-header-left">
          <button className="admin-profile-back" onClick={() => navigate('/admin')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Dashboard
          </button>
          <h1 className="admin-profile-title">Admin Profile</h1>
          <p className="admin-profile-subtitle">Manage your account settings and preferences</p>
        </div>
        <button className="admin-profile-logout" onClick={handleLogout}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="admin-profile-stats">
        {stats.map((stat, i) => (
          <div key={i} className="admin-profile-stat-card" style={{ '--stat-color': stat.color }}>
            <span className="admin-profile-stat-icon">{stat.icon}</span>
            <div className="admin-profile-stat-info">
              <span className="admin-profile-stat-value">{stat.value}</span>
              <span className="admin-profile-stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="admin-profile-content">
        
        {/* Sidebar */}
        <div className="admin-profile-sidebar">
          <div className="admin-profile-avatar-section">
            <div className="admin-profile-avatar">
              <span className="admin-profile-avatar-text">
                {profileData.firstName[0]}{profileData.lastName[0]}
              </span>
            </div>
            <button className="admin-profile-avatar-change">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              Change Photo
            </button>
          </div>

          <div className="admin-profile-nav">
            <button
              className={`admin-profile-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Profile Info
            </button>
            <button
              className={`admin-profile-nav-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Security
            </button>
            <button
              className={`admin-profile-nav-item ${activeTab === 'activity' ? 'active' : ''}`}
              onClick={() => setActiveTab('activity')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              Activity Log
            </button>
          </div>
        </div>

        {/* Main Panel */}
        <div className="admin-profile-main">
          
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="admin-profile-panel">
              <div className="admin-profile-panel-header">
                <h2 className="admin-profile-panel-title">Profile Information</h2>
                {!isEditing ? (
                  <button className="admin-profile-edit-btn" onClick={() => setIsEditing(true)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit Profile
                  </button>
                ) : (
                  <div className="admin-profile-edit-actions">
                    <button className="admin-profile-cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                    <button className="admin-profile-save-btn" onClick={handleSaveProfile}>Save Changes</button>
                  </div>
                )}
              </div>

              <div className="admin-profile-form">
                <div className="admin-profile-form-row">
                  <div className="admin-profile-form-field">
                    <label className="admin-profile-form-label">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      className="admin-profile-form-input"
                      value={profileData.firstName}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="admin-profile-form-field">
                    <label className="admin-profile-form-label">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      className="admin-profile-form-input"
                      value={profileData.lastName}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="admin-profile-form-row">
                  <div className="admin-profile-form-field">
                    <label className="admin-profile-form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="admin-profile-form-input"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="admin-profile-form-field">
                    <label className="admin-profile-form-label">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      className="admin-profile-form-input"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="admin-profile-form-row">
                  <div className="admin-profile-form-field">
                    <label className="admin-profile-form-label">Role</label>
                    <input
                      type="text"
                      name="role"
                      className="admin-profile-form-input"
                      value={profileData.role}
                      disabled
                    />
                  </div>
                  <div className="admin-profile-form-field">
                    <label className="admin-profile-form-label">Department</label>
                    <input
                      type="text"
                      name="department"
                      className="admin-profile-form-input"
                      value={profileData.department}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="admin-profile-form-field">
                  <label className="admin-profile-form-label">Location</label>
                  <input
                    type="text"
                    name="location"
                    className="admin-profile-form-input"
                    value={profileData.location}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="admin-profile-form-field">
                  <label className="admin-profile-form-label">Bio</label>
                  <textarea
                    name="bio"
                    className="admin-profile-form-textarea"
                    value={profileData.bio}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    rows="4"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="admin-profile-panel">
              <div className="admin-profile-panel-header">
                <h2 className="admin-profile-panel-title">Security Settings</h2>
              </div>

              <form className="admin-profile-form" onSubmit={handleChangePassword}>
                <div className="admin-profile-form-field">
                  <label className="admin-profile-form-label">Current Password</label>
                  <div className="admin-profile-password-wrap">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      name="currentPassword"
                      className="admin-profile-form-input"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      className="admin-profile-password-toggle"
                      onClick={() => setShowPasswords(p => ({ ...p, current: !p.current }))}
                    >
                      {showPasswords.current ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <div className="admin-profile-form-field">
                  <label className="admin-profile-form-label">New Password</label>
                  <div className="admin-profile-password-wrap">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      name="newPassword"
                      className="admin-profile-form-input"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      className="admin-profile-password-toggle"
                      onClick={() => setShowPasswords(p => ({ ...p, new: !p.new }))}
                    >
                      {showPasswords.new ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <div className="admin-profile-form-field">
                  <label className="admin-profile-form-label">Confirm New Password</label>
                  <div className="admin-profile-password-wrap">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      name="confirmPassword"
                      className="admin-profile-form-input"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      className="admin-profile-password-toggle"
                      onClick={() => setShowPasswords(p => ({ ...p, confirm: !p.confirm }))}
                    >
                      {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <button type="submit" className="admin-profile-save-btn">
                  Change Password
                </button>
              </form>

              <div className="admin-profile-security-info">
                <h3 className="admin-profile-security-title">Password Requirements</h3>
                <ul className="admin-profile-security-list">
                  <li>At least 8 characters long</li>
                  <li>Contains uppercase and lowercase letters</li>
                  <li>Includes at least one number</li>
                  <li>Has at least one special character</li>
                </ul>
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="admin-profile-panel">
              <div className="admin-profile-panel-header">
                <h2 className="admin-profile-panel-title">Recent Activity</h2>
              </div>

              <div className="admin-profile-activity-list">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="admin-profile-activity-item">
                    <span className="admin-profile-activity-icon">{activity.icon}</span>
                    <div className="admin-profile-activity-info">
                      <span className="admin-profile-activity-action">{activity.action}</span>
                      <span className="admin-profile-activity-time">{activity.time}</span>
                    </div>
                    <span className={`admin-profile-activity-badge ${activity.type}`}>
                      {activity.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
