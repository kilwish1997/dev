import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Admin from './pages/Admin';
import IconControl from './pages/IconControl';
import Contact from './pages/Contact';
import './App.css';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/icon-control', label: 'Icon Control' },
  { to: '/admin', label: 'Admin' },
];

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

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <img src="/logo.png" alt="FUEUO" className="nav-logo-img" />
          <span className="nav-logo-text">FUEUO</span>
        </Link>

        {/* Desktop menu */}
        <ul className="nav-menu">
          {NAV_LINKS.map(link => (
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
        {NAV_LINKS.map(link => (
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

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">

        {/* Left — brand */}
        <div className="footer-brand">
          <span className="footer-logo">FUEUO</span>
          <p className="footer-tagline">Mapping the hyperlocal, one pin at a time.</p>
        </div>

        {/* Center — nav links */}
        <nav className="footer-nav" aria-label="Footer navigation">
          <Link to="/about"   className="footer-link">About</Link>
          <Link to="/contact" className="footer-link">Contact</Link>
          <span className="footer-divider" />
          <Link to="/admin"   className="footer-link">Admin</Link>
        </nav>

        {/* Right — live pulse + copyright */}
        <div className="footer-right">
          <span className="footer-live">
            <span className="footer-pulse" aria-hidden="true" />
            Live data · OpenStreetMap
          </span>
          <span className="footer-copy">© {new Date().getFullYear()} FUEUO</span>
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
            <Route path="/admin" element={<Admin />} />
            <Route path="/icon-control" element={<IconControl />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
