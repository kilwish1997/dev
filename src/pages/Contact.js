import React, { useState } from 'react';
import './Contact.css';

const CONTACT_CHANNELS = [
  {
    icon: '✉️',
    label: 'Email',
    value: 'hello@fueuo.app',
    href: 'mailto:hello@fueuo.app',
    color: '#00d4ff',
  },
  {
    icon: '🐙',
    label: 'GitHub',
    value: 'github.com/fueuo',
    href: 'https://github.com',
    color: '#e2e8f0',
  },
  {
    icon: '🐦',
    label: 'Twitter / X',
    value: '@fueuo_app',
    href: 'https://twitter.com',
    color: '#1d9bf0',
  },
  {
    icon: '💬',
    label: 'Discord',
    value: 'discord.gg/fueuo',
    href: 'https://discord.com',
    color: '#5865f2',
  },
];

const FAQS = [
  {
    q: 'Why is my location not detected?',
    a: 'Make sure you have granted location permission in your browser. On Chrome, click the lock icon in the address bar → Site settings → Location → Allow.',
  },
  {
    q: 'The shops list is empty — what do I do?',
    a: 'Try increasing the search radius to 10 km or 15 km. Some areas have sparse OpenStreetMap coverage. You can also switch categories to "All".',
  },
  {
    q: 'Can I add a missing shop?',
    a: 'Yes! Click any shop tile → Submit tab → fill in the form. Our admin team reviews all submissions and updates the map accordingly.',
  },
  {
    q: 'Is my location data stored anywhere?',
    a: 'Never. Your coordinates are used only to query the Overpass API in real time and are never sent to our servers or stored anywhere.',
  },
  {
    q: 'How do I report a wrong address or closed shop?',
    a: 'Open the shop tile, go to the Submit tab, choose "Report Issue" as the request type, and describe the problem. We\'ll review it promptly.',
  },
];

const EMPTY = { name: '', email: '', subject: '', message: '' };

export default function Contact() {
  const [form, setForm]       = useState(EMPTY);
  const [sent, setSent]       = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="contact-page">

      {/* ── Hero ── */}
      <div className="contact-hero">
        <div className="contact-hero-glow" aria-hidden="true" />
        <h1 className="contact-title">Get in Touch</h1>
        <p className="contact-sub">
          Have a question, found a bug, or want to contribute? We'd love to hear from you.
        </p>
      </div>

      <div className="contact-body">

        {/* ── Left column ── */}
        <div className="contact-left">

          {/* Channel cards */}
          <div className="contact-channels">
            {CONTACT_CHANNELS.map(ch => (
              <a
                key={ch.label}
                href={ch.href}
                target={ch.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="channel-card"
                style={{ '--ch-color': ch.color }}
              >
                <span className="channel-icon">{ch.icon}</span>
                <div className="channel-info">
                  <span className="channel-label">{ch.label}</span>
                  <span className="channel-value">{ch.value}</span>
                </div>
                <span className="channel-arrow">↗</span>
              </a>
            ))}
          </div>

          {/* FAQ */}
          <div className="contact-faq">
            <h2 className="faq-title">
              <span className="faq-title-icon">💡</span> Common Questions
            </h2>
            {FAQS.map((item, i) => (
              <div
                key={i}
                className={`faq-item ${openFaq === i ? 'open' : ''}`}
              >
                <button
                  className="faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{item.q}</span>
                  <span className="faq-chevron" aria-hidden="true">›</span>
                </button>
                <div className="faq-a">
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right column — form ── */}
        <div className="contact-right">
          <div className="contact-form-card">
            {sent ? (
              <div className="contact-success">
                <div className="success-icon">📬</div>
                <h3>Message sent!</h3>
                <p>Thanks for reaching out. We'll get back to you within 24 hours.</p>
                <button className="success-reset" onClick={() => { setSent(false); setForm(EMPTY); }}>
                  Send another
                </button>
              </div>
            ) : (
              <>
                <h2 className="form-heading">Send a Message</h2>
                <p className="form-sub">We read every message and reply within one business day.</p>

                <form className="cf-form" onSubmit={handleSubmit} noValidate>
                  <div className="cf-row-2">
                    <div className="cf-group">
                      <label className="cf-label">Name <span className="cf-req">*</span></label>
                      <input
                        className="cf-input"
                        required
                        placeholder="Your name"
                        value={form.name}
                        onChange={e => set('name', e.target.value)}
                      />
                    </div>
                    <div className="cf-group">
                      <label className="cf-label">Email <span className="cf-req">*</span></label>
                      <input
                        className="cf-input"
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={e => set('email', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="cf-group">
                    <label className="cf-label">Subject <span className="cf-req">*</span></label>
                    <input
                      className="cf-input"
                      required
                      placeholder="What's this about?"
                      value={form.subject}
                      onChange={e => set('subject', e.target.value)}
                    />
                  </div>

                  <div className="cf-group">
                    <label className="cf-label">Message <span className="cf-req">*</span></label>
                    <textarea
                      className="cf-textarea"
                      required
                      rows={5}
                      placeholder="Tell us everything…"
                      value={form.message}
                      onChange={e => set('message', e.target.value)}
                    />
                  </div>

                  <button type="submit" className="cf-submit">
                    <span>Send Message</span>
                    <span className="cf-submit-arrow">→</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
