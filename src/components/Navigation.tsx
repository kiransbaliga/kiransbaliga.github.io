import React, { useState } from "react";
import { PORTFOLIO_CONFIG } from "../data/portfolioData";
import "./Navigation.css";

interface NavigationProps {
  onOpenContact?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onOpenContact }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="portfolio-nav-header">
      <div className="nav-container">
        <div className="nav-brand">
          <a href="#" className="brand-logo">{PORTFOLIO_CONFIG.brand}</a>
        </div>

        <nav className="nav-links">
          {PORTFOLIO_CONFIG.navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                if (link.id === "lets-talk-card" && onOpenContact) {
                  onOpenContact();
                } else {
                  scrollToSection(link.id);
                }
              }}
              className="nav-link"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <button
          className={`nav-hamburger ${mobileMenuOpen ? "open" : ""}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          <span className="hamburger-line line-1"></span>
          <span className="hamburger-line line-2"></span>
        </button>
      </div>

      <div className="nav-hairline">
        <span className="marker-plus top-left-plus">+</span>
        <span className="marker-plus top-right-plus">+</span>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <div className="mobile-menu-inner">
            {PORTFOLIO_CONFIG.navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  if (link.id === "lets-talk-card" && onOpenContact) {
                    setMobileMenuOpen(false);
                    onOpenContact();
                  } else {
                    scrollToSection(link.id);
                  }
                }}
                className="mobile-nav-link"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
