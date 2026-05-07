import React, { useState } from 'react';
import './Contact.css';

const CONTACT_CHANNELS = [
  {
    icon: '✉️',
    label: 'Email',
    value: 'hello@fuevo.app',
    href: 'mailto:hello@fuevo.app',
    color: '#00d4ff',
  },
  {
    icon: 'whatsapp',
    label: 'WhatsApp',
    value: '+91 97163 72568',
    href: 'https://wa.me/919716372568',
    color: '#25d366',
  },
  {
    icon: '🕐',
    label: 'Timings',
    value: '9:00 AM – 7:00 PM  (Mon – Sat)',
    href: null,
    color: '#f59e0b',
  },
  {
    icon: '💬',
    label: 'Discord',
    value: 'discord.gg/fuevo',
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
            {CONTACT_CHANNELS.map(ch => {
              const Tag = ch.href ? 'a' : 'div';
              const linkProps = ch.href ? {
                href: ch.href,
                target: ch.href.startsWith('mailto') ? undefined : '_blank',
                rel: 'noopener noreferrer',
              } : {};

              return (
                <Tag
                  key={ch.label}
                  {...linkProps}
                  className={`channel-card ${!ch.href ? 'channel-card-static' : ''}`}
                  style={{ '--ch-color': ch.color }}
                >
                  <span className="channel-icon">
                    {ch.icon === 'whatsapp' ? (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#25d366' }} aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.882l6.186-1.443A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.5-5.207-1.378l-.373-.22-3.674.857.896-3.567-.242-.386A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                      </svg>
                    ) : ch.icon}
                  </span>
                  <div className="channel-info">
                    <span className="channel-label">{ch.label}</span>
                    <span className="channel-value">{ch.value}</span>
                  </div>
                  {ch.href && <span className="channel-arrow">↗</span>}
                </Tag>
              );
            })}
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
