import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Admin from './pages/Admin';
import AdminDashboard2 from './pages/AdminDashboard2';
import AdminLogin from './pages/AdminLogin';
import AdminProfile from './pages/AdminProfile';
import IconControl from './pages/IconControl';
import Contact from './pages/Contact';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Read saved theme or fall back to system preference
function getInitialTheme() {
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
  } catch (e) {}
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function NavBar({ theme, toggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const closeMenu = () => setMenuOpen(false);
  const isDark = theme === 'dark';
  const isLoggedIn = localStorage.getItem('adminToken');

  // Dynamic nav links based on login status
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    isLoggedIn 
      ? { to: '/admin', label: 'Admin' }
      : { to: '/admin-login', label: 'Admin Login' },
    ...(isLoggedIn ? [{ to: '/admin2', label: 'Admin 2' }] : []),
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <img
            src="/logo.png"
            alt=""
            className="nav-logo-img"
            onError={e => { e.currentTarget.style.display = 'none'; }}
          />
          <span className="nav-logo-text">FUEVO</span>
        </Link>

        {/* Desktop menu */}
        <ul className="nav-menu">
          {navLinks.map(link => (
            <li key={link.to} className="nav-item">
              <Link
                to={link.to}
                className={`nav-link${location.pathname === link.to ? ' active' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-right">
          {/* Theme toggle */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            <span className="theme-toggle-track">
              <span className="theme-toggle-thumb">
                {isDark ? '🌙' : '☀️'}
              </span>
            </span>
            <span className="theme-toggle-label">{isDark ? 'Dark' : 'Light'}</span>
          </button>

          {/* Hamburger */}
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span className="ham-line" />
            <span className="ham-line" />
            <span className="ham-line" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`mobile-link${location.pathname === link.to ? ' active' : ''}`}
            onClick={closeMenu}
          >
            {link.label}
          </Link>
        ))}
        {/* Theme toggle in mobile menu too */}
        <button className="mobile-theme-toggle" onClick={toggleTheme}>
          {isDark ? '☀️ Switch to Light Mode' : '🌙 Switch to Dark Mode'}
        </button>
      </div>
    </nav>
  );
}

// ── Floating WhatsApp Button ───────────────────────────────────────────────
const WA_NUMBER = '919716372568';
const WA_MESSAGE = encodeURIComponent('Hi! I found you on FUEVO. I have a query about your services.');

function FloatingWhatsApp() {
  const [tooltip, setTooltip] = React.useState(false);

  return (
    <a
      href={`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      className="wa-float"
      aria-label="Chat with us on WhatsApp"
      onMouseEnter={() => setTooltip(true)}
      onMouseLeave={() => setTooltip(false)}
    >
      {/* WhatsApp SVG */}
      <svg className="wa-float-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.882l6.186-1.443A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.5-5.207-1.378l-.373-.22-3.674.857.896-3.567-.242-.386A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
      </svg>

      {/* Tooltip */}
      <span className={`wa-float-tooltip ${tooltip ? 'visible' : ''}`}>
        Chat with us on WhatsApp
      </span>

      {/* Ping ring */}
      <span className="wa-float-ping" aria-hidden="true" />
    </a>
  );
}

function Footer() {
  const isLoggedIn = localStorage.getItem('adminToken');
  
  return (
    <footer className="site-footer">
      <div className="footer-inner">

        {/* Left — brand */}
        <div className="footer-brand">
          <span className="footer-logo">FUEVO</span>
          <p className="footer-tagline">Mapping the hyperlocal, one pin at a time.</p>
        </div>

        {/* Center — nav links */}
        <nav className="footer-nav" aria-label="Footer navigation">
          <Link to="/about"   className="footer-link">About</Link>
          <Link to="/contact" className="footer-link">Contact</Link>
          <span className="footer-divider" />
          {isLoggedIn ? (
            <>
              <Link to="/admin"   className="footer-link">Admin</Link>
              <Link to="/admin2"  className="footer-link">Admin 2</Link>
            </>
          ) : (
            <Link to="/admin-login" className="footer-link">Admin Login</Link>
          )}
        </nav>

        {/* Right — live pulse + copyright */}
        <div className="footer-right">
          <span className="footer-live">
            <span className="footer-pulse" aria-hidden="true" />
            Live data · OpenStreetMap
          </span>
          <span className="footer-copy">© {new Date().getFullYear()} FUEVO</span>
        </div>

      </div>

      {/* bottom glow line */}
      <div className="footer-glow-line" aria-hidden="true" />
    </footer>
  );
}

function App() {
  const [theme, setTheme] = useState(getInitialTheme);

  // Apply theme to <html> element so all CSS vars cascade correctly
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) {}
  }, [theme]);

  const toggleTheme = () =>
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <Router>
      <div className="App">
        <NavBar theme={theme} toggleTheme={toggleTheme} />
        <main className="page-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="/admin2" element={
              <ProtectedRoute>
                <AdminDashboard2 />
              </ProtectedRoute>
            } />
            <Route path="/admin-profile" element={
              <ProtectedRoute>
                <AdminProfile />
              </ProtectedRoute>
            } />
            <Route path="/icon-control" element={
              <ProtectedRoute>
                <IconControl />
              </ProtectedRoute>
            } />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
        <FloatingWhatsApp />
      </div>
    </Router>
  );
}

export default App;
