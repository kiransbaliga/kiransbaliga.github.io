import React, { useState, useEffect } from "react";
import { PORTFOLIO_CONFIG } from "../data/portfolioData";
import "./Footer.css";

interface FooterProps {
  onOpenContact?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenContact }) => {
  const [copied, setCopied] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      try {
        const timeStr = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date());
        setCurrentTime(`${timeStr} IST`);
      } catch {
        setCurrentTime("22:15 IST");
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PORTFOLIO_CONFIG.contactCard.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="portfolio-footer" id="footer">
      {/* Top Coordinate Border */}
      <div className="footer-hairline">
        <span className="marker-plus marker-left">+</span>
        <span className="footer-coordinate mono">04 // FOOTER CANVAS [1440 × 600]</span>
        <span className="marker-plus marker-right">+</span>
      </div>

      <div className="footer-container">
        {/* Main CTA Section */}
        <div className="footer-cta-block">
          <div className="footer-status-pill mono">
            <span className="status-indicator"></span>
            <span>{PORTFOLIO_CONFIG.availability}</span>
          </div>

          <h2 className="footer-headline">
            Let’s build something impactful together.
          </h2>

          <p className="footer-subhead">
            Currently open to full-stack engineering contracts, backend architecture consulting, and high-impact freelance digital products.
          </p>

          <div className="footer-email-box">
            <a href={`mailto:${PORTFOLIO_CONFIG.contactCard.email}`} className="footer-email-link mono">
              {PORTFOLIO_CONFIG.contactCard.email}
            </a>
            <button
              className="footer-copy-btn mono"
              onClick={handleCopyEmail}
              aria-label="Copy email address"
            >
              {copied ? "COPIED ✓" : "COPY EMAIL"}
            </button>
            {onOpenContact && (
              <button
                className="footer-contact-btn mono"
                onClick={onOpenContact}
              >
                OPEN FORM ↗
              </button>
            )}
          </div>
        </div>

        {/* Footer Meta Grid */}
        <div className="footer-meta-grid">
          {/* Col 1: Identity */}
          <div className="footer-col">
            <span className="col-label mono">IDENTITY</span>
            <span className="col-brand">{PORTFOLIO_CONFIG.brand}</span>
            <p className="col-role mono">{PORTFOLIO_CONFIG.title}</p>
            <p className="col-note">{PORTFOLIO_CONFIG.heroSubline}</p>
          </div>

          {/* Col 2: Navigation */}
          <div className="footer-col">
            <span className="col-label mono">NAVIGATION</span>
            <ul className="footer-nav-list">
              <li>
                <button onClick={() => scrollToSection("hero")} className="footer-nav-item mono">
                  01 // Hero
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("selected-works")} className="footer-nav-item mono">
                  02 // Selected Work
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("experience-section")} className="footer-nav-item mono">
                  03 // Experience
                </button>
              </li>
              <li>
                <button onClick={scrollToTop} className="footer-nav-item mono">
                  ↑ Back to Top
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Network / Socials */}
          <div className="footer-col">
            <span className="col-label mono">NETWORK</span>
            <ul className="footer-social-list">
              {PORTFOLIO_CONFIG.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-link mono"
                  >
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Location & Time */}
          <div className="footer-col">
            <span className="col-label mono">LOCATION & TIME</span>
            <div className="footer-location-block">
              <span className="location-name mono">{PORTFOLIO_CONFIG.location}</span>
              <span className="location-time mono">{currentTime || "IST (UTC+5:30)"}</span>
              <span className="location-status mono">REMOTE / HYBRID AVAILABLE</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-bottom-left mono">
            <span>{PORTFOLIO_CONFIG.copyrightYear} {PORTFOLIO_CONFIG.fullName}. ALL RIGHTS RESERVED.</span>
          </div>
          <div className="footer-bottom-right mono">
            <span>DESIGN TOOL PRINCIPLES • FIGMA CANVAS AESTHETICS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
