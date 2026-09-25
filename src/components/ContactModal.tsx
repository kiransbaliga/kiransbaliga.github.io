import React, { useState } from "react";
import { PORTFOLIO_CONFIG } from "../data/portfolioData";
import "./ContactModal.css";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PORTFOLIO_CONFIG.contactCard.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="contact-modal-backdrop" onClick={onClose}>
      <div
        className="contact-modal-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Chrome */}
        <div className="modal-chrome">
          <div className="modal-meta mono">
            <span className="live-dot">●</span>
            <span>AVAILABLE FOR NEW PROJECTS</span>
          </div>
          <button className="modal-close-btn mono" onClick={onClose} aria-label="Close dialog">
            ESC ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="modal-body">
          <div className="modal-avatar-row">
            <img src={PORTFOLIO_CONFIG.portraitImage} alt={PORTFOLIO_CONFIG.name} className="modal-avatar" />
            <div>
              <h3 className="modal-name">{PORTFOLIO_CONFIG.contactCard.name}</h3>
              <p className="modal-subtitle mono">{PORTFOLIO_CONFIG.title}</p>
            </div>
          </div>

          <p className="modal-copy">
            Building scalable backends and crafting thoughtful interfaces for ambitious teams. Let's build something impactful together.
          </p>

          <div className="email-action-box">
            <a href={`mailto:${PORTFOLIO_CONFIG.contactCard.email}`} className="email-address mono">
              {PORTFOLIO_CONFIG.contactCard.email}
            </a>
            <button className="copy-btn mono" onClick={handleCopyEmail}>
              {copied ? "COPIED ✓" : "COPY"}
            </button>
          </div>

          <div className="modal-socials-row">
            {PORTFOLIO_CONFIG.socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-pill mono"
              >
                {s.label} ↗
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
