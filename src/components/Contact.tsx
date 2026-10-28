import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Send, Copy, Check, MessageSquare, Clock, MapPin } from 'lucide-react';

export const Contact: React.FC = () => {
  const [topic, setTopic] = useState('Design Systems');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const topics = ['Design Systems', 'Web Application', 'Motion Consulting', 'Full-Time Role'];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('alex.rivera.dev@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setStatus('sending');
    setTimeout(() => {
      setStatus('success');
    }, 900);
  };

  return (
    <section id="contact" style={{ paddingBlock: 'var(--space-4xl)', backgroundColor: 'var(--bg-surface)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', marginInline: 'auto', marginBottom: '3.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--accent-light)',
              color: 'var(--accent-primary)',
              fontSize: '0.82rem',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
              marginBottom: '1rem',
            }}
          >
            <MessageSquare size={13} />
            <span>Initiate Collaboration</span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
              letterSpacing: '-0.03em',
              marginBottom: '1rem',
              color: 'var(--text-primary)',
            }}
          >
            Let&apos;s Build Something Extraordinary
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            Available for select engineering contracts, design system consultations, and technical leadership roles.
          </p>
        </div>

        {/* Contact Layout Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.3fr',
            gap: '3rem',
            maxWidth: '1000px',
            marginInline: 'auto',
          }}
          className="contact-grid"
        >
          {/* Left Column: Direct Details */}
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>
              Direct Channel
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
              Whether you need to overhaul an inconsistent UI component library, audit frontend performance, or implement high-fidelity motion, I&apos;d love to connect.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border-default)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--accent-light)',
                      color: 'var(--accent-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Mail size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Email Address</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                      alex.rivera.dev@gmail.com
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCopyEmail}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.78rem',
                    color: 'var(--accent-primary)',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-default)',
                    cursor: 'pointer',
                  }}
                  aria-label="Copy email address"
                >
                  {copiedEmail ? <Check size={13} color="var(--accent-emerald)" /> : <Copy size={13} />}
                  <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border-default)',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--accent-emerald-light)',
                    color: 'var(--accent-emerald)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Clock size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Response Time</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Typically within 24 hours
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border-default)',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--accent-purple-light)',
                    color: 'var(--accent-purple)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MapPin size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Location</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    San Francisco, CA &middot; Remote Worldwide
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div
            style={{
              backgroundColor: 'var(--bg-app)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-default)',
              padding: '2.25rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="successMessage"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    textAlign: 'center',
                    paddingBlock: '3rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent-emerald-light)',
                      color: 'var(--accent-emerald)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.25rem',
                      boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)',
                    }}
                  >
                    <Check size={32} />
                  </div>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                    Message Received!
                  </h4>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '360px', marginBottom: '2rem' }}>
                    Thank you, {name}. I&apos;ll review your project details and get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setStatus('idle');
                      setName('');
                      setEmail('');
                      setMessage('');
                    }}
                    style={{
                      padding: '8px 20px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--text-primary)',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}
                  >
                    Send Another Note
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Topic Picker */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      Topic of Collaboration
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {topics.map((t) => {
                        const isSelected = topic === t;
                        return (
                          <button
                            type="button"
                            key={t}
                            onClick={() => setTopic(t)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '0.8rem',
                              fontWeight: isSelected ? 600 : 500,
                              backgroundColor: isSelected ? 'var(--accent-primary)' : 'var(--bg-surface)',
                              color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                              border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-default)',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name Input */}
                  <div>
                    <label htmlFor="contact-name" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-default)',
                        fontSize: '0.9rem',
                        color: 'var(--text-primary)',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <label htmlFor="contact-email" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Work Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="jane@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-default)',
                        fontSize: '0.9rem',
                        color: 'var(--text-primary)',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  {/* Message Input */}
                  <div>
                    <label htmlFor="contact-message" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Project Scope &amp; Timeline
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      placeholder="Tell me about your team, tech stack, and what problem you are solving..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-default)',
                        fontSize: '0.9rem',
                        color: 'var(--text-primary)',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '13px 24px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--accent-primary)',
                      color: '#ffffff',
                      fontSize: '0.92rem',
                      fontWeight: 600,
                      cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (status !== 'sending') e.currentTarget.style.backgroundColor = 'var(--accent-primary-hover)';
                    }}
                    onMouseLeave={(e) => {
                      if (status !== 'sending') e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
                    }}
                  >
                    {status === 'sending' ? (
                      <span>Sending note...</span>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send size={15} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
