import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Copy, Check, Send, AlertCircle, ArrowUpRight } from 'lucide-react';
import { ParticleField } from '../components/ParticleField';
import { MagneticButton } from '../components/MagneticButton';
import { PORTFOLIO_CONFIG } from '../config/content';
import {
  pageContainerVariants,
  titleMaskVariants,
  tagVariants,
  contentBlockVariants,
} from '../utils/pageTransitions';

export const ContactPage = () => {
  const { contact } = PORTFOLIO_CONFIG;
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleCopyEmail = () => {
    if (!contact.email) return;
    navigator.clipboard.writeText(contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setFormSubmitted(true);
  };

  // Construct mailto link with prefilled subject and message
  const mailtoUrl = contact.email
    ? `mailto:${contact.email}?subject=${encodeURIComponent(subject || `Message from ${name}`)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`
    : '#';

  // Filter available social links (only those with non-empty URLs)
  const availableSocials = Object.values(contact.socials).filter(
    (social) => social.url && social.url.trim() !== ''
  );

  return (
    <motion.div
      variants={pageContainerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-deep)',
        color: 'var(--silver-primary)',
        paddingTop: 'var(--page-top-offset)',
        paddingBottom: 'clamp(4rem, 8vw, 7rem)',
      }}
    >
      <ParticleField opacity={0.35} />

      <div className="page-container" style={{ position: 'relative', zIndex: 10 }}>
        {/* Page Header with Mask Reveal */}
        <div style={{ marginBottom: 'clamp(3rem, 6vw, 4.5rem)' }}>
          <motion.span
            variants={tagVariants}
            style={{
              fontSize: '0.82rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--silver-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              display: 'block',
              marginBottom: '0.75rem',
            }}
          >
            03 &mdash; Direct Channel
          </motion.span>
          <div style={{ overflow: 'hidden' }}>
            <motion.h1
              variants={titleMaskVariants}
              style={{
                fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
                fontWeight: 900,
                letterSpacing: '-0.04em',
                lineHeight: 1.05,
                textTransform: 'uppercase',
                margin: 0,
              }}
              className="silver-chrome-text"
            >
              Contact
            </motion.h1>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(280px, 420px) 1fr',
            gap: 'clamp(2.5rem, 6vw, 5rem)',
            alignItems: 'flex-start',
          }}
          className="contact-layout-grid"
        >
          {/* Left Column: Direct Inquiries */}
          <motion.div
            variants={contentBlockVariants}
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
          >
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.75rem' }}>
                Initiate Dialogue
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--silver-secondary)', lineHeight: 1.65 }}>
                Available for technical discussions, creative collaborations, and architectural engineering projects.
              </p>
            </div>

            {/* Email Card */}
            {contact.email && (
              <div
                style={{
                  padding: 'clamp(1rem, 3vw, 1.5rem)',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: '1 1 200px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--silver-bright)',
                      flexShrink: 0,
                    }}
                  >
                    <Mail size={18} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--silver-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Email
                    </div>
                    <div className="wrap-anywhere" style={{ fontSize: '0.92rem', fontFamily: 'var(--font-mono)', color: '#ffffff', fontWeight: 500, wordBreak: 'break-all' }}>
                      {contact.email}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCopyEmail}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    minHeight: '44px',
                    minWidth: '44px',
                    padding: '8px 14px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-mono)',
                    color: copied ? 'var(--silver-bright)' : 'var(--silver-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                  }}
                  aria-label="Copy email address"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            )}

            {/* Social Links (Only displayed if URLs exist) */}
            {availableSocials.length > 0 && (
              <div>
                <h3 style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--silver-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
                  Channels
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {availableSocials.map((social) => (
                    <a
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        minHeight: '44px',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        color: 'var(--silver-bright)',
                        textDecoration: 'none',
                        transition: 'border-color 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)')}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {social.label.toLowerCase() === 'github' && (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                            <path d="M9 18c-4.51 2-5-2-7-2" />
                          </svg>
                        )}
                        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{social.label}</span>
                      </div>
                      <ArrowUpRight size={15} color="var(--silver-muted)" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div
            variants={contentBlockVariants}
            style={{
              backgroundColor: 'rgba(15, 15, 19, 0.8)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: 'clamp(1.5rem, 4vw, 3rem)',
            }}
          >
            {formSubmitted ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    color: '#ffffff',
                  }}
                >
                  <AlertCircle size={26} />
                </div>

                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.75rem' }}>
                  Direct Submission Notice
                </h3>

                <p style={{ fontSize: '0.95rem', color: 'var(--silver-secondary)', lineHeight: 1.65, maxWidth: '480px', margin: '0 auto 1.75rem' }}>
                  A backend form forwarding service (e.g., Formspree, Resend, or API) is not currently connected to this static build.
                  To ensure your message reaches me immediately, click below to open your native mail client with your prefilled note.
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <MagneticButton
                    href={mailtoUrl}
                    variant="primary"
                    icon={<ArrowUpRight size={15} />}
                  >
                    Open in Email App
                  </MagneticButton>

                  <MagneticButton
                    onClick={() => setFormSubmitted(false)}
                    variant="secondary"
                  >
                    Back to Form
                  </MagneticButton>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>
                  Send a Message
                </h3>

                {/* Name */}
                <div>
                  <label htmlFor="contact-name" style={{ display: 'block', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--silver-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                    Your Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    style={{
                      width: '100%',
                      minHeight: '44px',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="contact-email" style={{ display: 'block', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--silver-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                    Email Address *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    style={{
                      width: '100%',
                      minHeight: '44px',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="contact-subject" style={{ display: 'block', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--silver-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Project Inquiry / Collaboration"
                    style={{
                      width: '100%',
                      minHeight: '44px',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="contact-message" style={{ display: 'block', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--silver-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                    Message *
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell me about your project or inquiry..."
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                      resize: 'vertical',
                    }}
                  />
                </div>

                {/* Submit button */}
                <div>
                  <MagneticButton
                    type="submit"
                    variant="primary"
                    icon={<Send size={15} />}
                  >
                    Submit Message
                  </MagneticButton>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
