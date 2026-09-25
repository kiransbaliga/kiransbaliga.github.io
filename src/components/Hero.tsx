import React, { useEffect, useRef, useState } from "react";
import { PORTFOLIO_CONFIG } from "../data/portfolioData";
import "./Hero.css";

interface HeroProps {
  onOpenContact?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenContact }) => {
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 60);

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (heroRef.current) {
            const rect = heroRef.current.getBoundingClientRect();
            if (rect.bottom > 0) {
              setScrollY(window.scrollY);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Parallax speeds:
  // Layer 1 (slowest): Background dark text = 0.15x
  // Layer 2 (medium): Portrait cutout = 0.35x
  // Layer 3 (fastest): Foreground white text = 0.65x
  const bgTextY = scrollY * 0.15;
  const portraitY = scrollY * 0.35;
  const fgTextY = scrollY * 0.65;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className={`hero-section ${isLoaded ? "hero-entered" : ""}`} ref={heroRef} id="hero">
      {/* ─── Grid Overlay with Coordinate Crosshairs ─── */}
      <div className="hero-grid-overlay" aria-hidden="true">
        <div className="grid-h-line grid-h-top">
          <span className="marker-plus pos-left">+</span>
          <span className="marker-plus pos-c1">+</span>
          <span className="marker-plus pos-c2">+</span>
          <span className="marker-plus pos-right">+</span>
        </div>
        <div className="grid-h-line grid-h-mid">
          <span className="marker-plus pos-left">+</span>
          <span className="marker-plus pos-right">+</span>
        </div>
        <div className="grid-h-line grid-h-bot">
          <span className="marker-plus pos-left">+</span>
          <span className="marker-plus pos-right">+</span>
        </div>
        <div className="grid-v-line grid-v-left"></div>
        <div className="grid-v-line grid-v-c1"></div>
        <div className="grid-v-line grid-v-c2"></div>
        <div className="grid-v-line grid-v-right"></div>
      </div>

      {/* ─── PARALLAX LAYER 1 (slowest): Giant Tonal Background Typography ─── */}
      <div
        className="hero-bg-typography"
        aria-hidden="true"
        style={{ transform: `translate3d(-50%, ${-bgTextY}px, 0)` }}
      >
        <span className="bg-name-text">{PORTFOLIO_CONFIG.name}</span>
      </div>

      {/* ─── PARALLAX LAYER 2 (medium): Portrait Cutout Scaled Large ─── */}
      <div
        className="hero-portrait-container"
        style={{ transform: `translate3d(-50%, ${-portraitY}px, 0)` }}
      >
        <img
          src={PORTFOLIO_CONFIG.portraitImage}
          alt={PORTFOLIO_CONFIG.fullName}
          className="hero-portrait-img"
        />
      </div>

      {/* ─── Left Mission Statement ─── */}
      <div className="hero-statement-wrapper">
        <div className="statement-crosshair">
          <span className="marker-plus">+</span>
        </div>
        <p className="hero-statement-text">
          {PORTFOLIO_CONFIG.tagline}
        </p>
      </div>

      {/* ─── Right Floating Cards ─── */}
      <div className="hero-cards-wrapper">
        {/* Top Card: Featured Work (Ultrahuman) */}
        <div
          className="hero-floating-card uh-featured-card"
          onClick={() => scrollToSection("selected-works")}
          role="button"
          tabIndex={0}
          title="View Featured Work"
        >
          <div className="uh-card-thumb">
            <img
              src={PORTFOLIO_CONFIG.zentixHeroCard.deviceImage}
              alt="Hardware & Backend"
              className="uh-thumb-img"
            />
          </div>
          <div className="uh-card-footer">
            <span className="uh-title">{PORTFOLIO_CONFIG.zentixHeroCard.title}</span>
            <span className="uh-category mono">{PORTFOLIO_CONFIG.zentixHeroCard.category}</span>
          </div>
        </div>

        {/* Bottom Card: Let's Talk */}
        <div
          className="hero-floating-card talk-contact-card"
          onClick={() => {
            if (onOpenContact) onOpenContact();
            else scrollToSection("footer");
          }}
          role="button"
          tabIndex={0}
          title="Get in touch"
        >
          <div className="talk-avatar-col">
            <img
              src={PORTFOLIO_CONFIG.portraitImage}
              alt="Avatar"
              className="talk-avatar-img"
            />
          </div>
          <div className="talk-content-col">
            <span className="talk-tag mono">{PORTFOLIO_CONFIG.contactCard.badge}</span>
            <span className="talk-fullname">{PORTFOLIO_CONFIG.contactCard.name}</span>
            <span className="talk-jobrole mono">{PORTFOLIO_CONFIG.contactCard.role}</span>
          </div>
          <div className="talk-action-col">
            <span className="talk-icon-asterisk">✱</span>
            <div className="talk-icon-arrow">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M1 13L13 1M13 1H3M13 1V11" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ─── PARALLAX LAYER 3 (fastest): Foreground Solid White Headline ─── */}
      <div
        className="hero-foreground-headline"
        style={{ transform: `translate3d(0, ${-fgTextY}px, 0)` }}
      >
        <span className="headline-copyright mono">{PORTFOLIO_CONFIG.copyrightYear}</span>
        <h1 className="headline-firstname">{PORTFOLIO_CONFIG.name}</h1>
      </div>
    </section>
  );
};
