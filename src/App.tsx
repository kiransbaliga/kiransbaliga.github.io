import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import content from "./data/siteContent.json";
import scrollSnapConfig from "./config/scrollSnapConfig";

gsap.registerPlugin(ScrollToPlugin);

type Project = (typeof content.projects)[number];
type Experience = (typeof content.experience)[number];

const CustomCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let rafId: number;
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setIsVisible(true);

      const target = (e.target as HTMLElement).closest(
        "a, button, .work-card, [data-cursor]"
      );
      setIsHovered(Boolean(target));
      setCursorText(
        target?.getAttribute("data-cursor") ||
          (target?.closest(".work-card") ? "VIEW" : "")
      );
    };

    const handleMouseLeave = () => setIsVisible(false);

    const animate = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      setPos({ x: currentX, y: currentY });
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`custom-cursor ${isHovered ? "is-hovered" : ""} ${
        cursorText ? "has-text" : ""
      }`}
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
      }}
      aria-hidden="true"
    >
      {cursorText && <span className="cursor-label">{cursorText}</span>}
    </div>
  );
};

const useReveal = () => {
  const location = useLocation();
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (entry) =>
            entry.isIntersecting && entry.target.classList.add("is-visible")
        ),
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );

    const elements = document.querySelectorAll("[data-reveal]");
    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        element.classList.add("is-visible");
      } else {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [location.pathname]);
};

const useWorkSnap = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!scrollSnapConfig.enabled) return;

    // Disable scroll snapping on mobile / phones (touch screens or viewports < minWidth)
    if (scrollSnapConfig.disableOnMobile) {
      const isNarrow = window.innerWidth < scrollSnapConfig.minWidth;
      const isTouch = window.matchMedia("(pointer: coarse)").matches;
      if (isNarrow || isTouch) return;
    }

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let isTweening = false;
    let scrollTimer: ReturnType<typeof setTimeout> | null = null;
    let tween: gsap.core.Tween | null = null;
    let lastScrollY = window.scrollY;
    let scrollDirection = 0; // 1 = down, -1 = up

    const getSnapTargets = (): number[] => {
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      if (maxScroll <= 0) return [0];

      const targets: number[] = [0];

      // Work section cards in .home-work-side
      const cards = document.querySelectorAll<HTMLElement>(".home-work-side .experience-card");
      cards.forEach((card) => {
        const top = card.getBoundingClientRect().top + window.scrollY - scrollSnapConfig.cardOffsetTop;
        if (top > 0 && top <= maxScroll) {
          targets.push(Math.round(top));
        }
      });

      // View all work link
      const viewAll = document.querySelector<HTMLElement>(".view-all-work-wrap");
      if (viewAll) {
        const top = viewAll.getBoundingClientRect().top + window.scrollY - (window.innerHeight - viewAll.offsetHeight) / 2;
        if (top > 0 && top <= maxScroll) {
          targets.push(Math.round(top));
        }
      }

      // Footer
      const footer = document.querySelector<HTMLElement>(".site-footer");
      if (footer) {
        targets.push(maxScroll);
      }

      return Array.from(new Set(targets)).sort((a, b) => a - b);
    };

    const snapToNearestTarget = () => {
      if (isTweening) return;

      const currentY = window.scrollY;
      const targets = getSnapTargets();
      if (targets.length <= 1) return;

      // Find segment targets[i] <= currentY <= targets[i+1]
      let targetY = targets[0];

      if (currentY <= targets[0]) {
        targetY = targets[0];
      } else if (currentY >= targets[targets.length - 1]) {
        targetY = targets[targets.length - 1];
      } else {
        let i = 0;
        while (i < targets.length - 1 && targets[i + 1] < currentY) {
          i++;
        }
        const low = targets[i];
        const high = targets[i + 1];
        const span = high - low;
        const progress = span > 0 ? (currentY - low) / span : 0;

        const thresh = Math.max(0.05, Math.min(0.5, scrollSnapConfig.threshold));
        if (scrollDirection > 0) {
          // Scrolling down: if advanced past threshold of segment, ease into next target
          targetY = progress > thresh ? high : low;
        } else if (scrollDirection < 0) {
          // Scrolling up: if retracted past threshold of segment, ease into previous target
          targetY = progress < (1 - thresh) ? low : high;
        } else {
          targetY = progress > 0.5 ? high : low;
        }
      }

      // If already within 4px, don't trigger tween
      if (Math.abs(currentY - targetY) <= 4) return;

      isTweening = true;
      tween?.kill();

      const scrollObj = { y: window.scrollY };
      tween = gsap.to(scrollObj, {
        y: targetY,
        duration: scrollSnapConfig.duration,
        ease: scrollSnapConfig.ease,
        overwrite: "auto",
        onUpdate: () => {
          window.scrollTo(0, scrollObj.y);
          lastScrollY = scrollObj.y;
        },
        onComplete: () => {
          isTweening = false;
        },
        onInterrupt: () => {
          isTweening = false;
        }
      });
    };

    const handleScroll = () => {
      if (isTweening) return;
      const currentY = window.scrollY;

      const delta = currentY - lastScrollY;
      if (Math.abs(delta) > 2) {
        scrollDirection = delta > 0 ? 1 : -1;
        lastScrollY = currentY;
      }

      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        snapToNearestTarget();
      }, scrollSnapConfig.debounceMs);
    };

    const handleUserInteraction = () => {
      if (isTweening && tween) {
        tween.kill();
        isTweening = false;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleUserInteraction, { passive: true });
    window.addEventListener("touchstart", handleUserInteraction, { passive: true });
    window.addEventListener("pointerdown", handleUserInteraction, { passive: true });
    window.addEventListener("keydown", handleUserInteraction, { passive: true });

    return () => {
      if (scrollTimer) clearTimeout(scrollTimer);
      tween?.kill();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
      window.removeEventListener("pointerdown", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
    };
  }, []);
};

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Kiran S Baliga home">
          {content.site.shortName}
        </Link>
        <button
          className={`menu-button ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="site-menu"
        >
          <span />
          <span />
        </button>
      </header>
      <div
        id="site-menu"
        className={`menu-panel ${menuOpen ? "open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <nav onClick={() => setMenuOpen(false)}>
          <Link to="/">
            Home <span>01</span>
          </Link>
          <a href="/#work">
            Work & Case Studies <span>02</span>
          </a>
          <Link to="/work">
            Work & Archive <span>03</span>
          </Link>
          <Link to="/info">
            About <span>04</span>
          </Link>
          <a
            href="/resume.pdf"
            download="Kiran_S_Baliga_Resume.pdf"
          >
            Resume <span>05 ↓</span>
          </a>
          <a
            href={content.site.blog}
            target="_blank"
            rel="noreferrer noopener"
          >
            Blog <span>06</span>
          </a>
          <Link to="/services">
            Services <span>07</span>
          </Link>
          <a href="#contact">
            Contact <span>08</span>
          </a>
        </nav>
        <p>
          {content.site.location} · {content.site.availability}
        </p>
      </div>
    </>
  );
};

const Footer = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(content.site.email)?.catch(() => undefined);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer id="contact" className="site-footer">
      <div className="footer-heading">
        Let's build
        <br />
        <em>something at scale.</em>
      </div>
      <p className="footer-subtext">
        Backend & AI Engineer. Open to full-time engineering roles, remote positions, and relocation.
      </p>
      <div className="footer-contact">
        <a href={`mailto:${content.site.email}`} className="footer-email-link">
          {content.site.email} <span>↗</span>
        </a>
        <button
          onClick={handleCopyEmail}
          className={`copy-email-btn ${copied ? "is-copied" : ""}`}
          aria-label="Copy email address to clipboard"
        >
          {copied ? "✓ Copied!" : "Copy email"}
        </button>
        <a
          href="/resume.pdf"
          download="Kiran_S_Baliga_Resume.pdf"
          className="btn-primary"
          style={{ minHeight: "44px", padding: "10px 22px" }}
          data-cursor="RESUME"
        >
          Download Resume <span>↓</span>
        </a>
      </div>
      <p className="footer-services-note">
        Looking for client web design, WordPress migration, or custom MVP scoping?{" "}
        <Link to="/services">View Client Services & Web Consulting ↗</Link>
      </p>
      <div className="footer-bottom">
        <span>{content.site.copyright} · {content.site.location}</span>
        <span>
          <a
            href={content.site.linkedin}
            target="_blank"
            rel="noreferrer noopener"
          >
            LinkedIn
          </a>
          <a
            href={content.site.github}
            target="_blank"
            rel="noreferrer noopener"
          >
            GitHub
          </a>
          <a
            href={content.site.npm}
            target="_blank"
            rel="noreferrer noopener"
          >
            NPM
          </a>
          <a
            href={content.site.pypi}
            target="_blank"
            rel="noreferrer noopener"
          >
            PyPI
          </a>
          {content.site.twitter && (
            <a
              href={content.site.twitter}
              target="_blank"
              rel="noreferrer noopener"
            >
              Twitter/X
            </a>
          )}
        </span>
      </div>
    </footer>
  );
};

const ExperienceCard = ({ job, index }: { job: Experience; index: number }) => {
  const isCaseStudy = "isCaseStudy" in job && Boolean(job.isCaseStudy);
  const subCompany = "subCompany" in job ? (job.subCompany as string | undefined) : undefined;
  const metricSummary = "metricSummary" in job ? (job.metricSummary as string | undefined) : undefined;
  const toolingLinks = "toolingLinks" in job ? (job.toolingLinks as { label: string; url: string }[] | undefined) : undefined;

  return (
    <Link
      data-reveal
      className={`work-card experience-card experience-${job.slug} ${isCaseStudy ? "is-case-study" : ""}`}
      to={`/work/experience/${job.slug}`}
    >
      <div className="gallery-meta">
        <div>
          {isCaseStudy && <span className="case-study-badge-tag">Case Study</span>}
          <div className="card-title-group">
            <h3>{job.company}</h3>
            {subCompany && <span className="card-subcompany">({subCompany})</span>}
          </div>
          <span className="card-role">{job.role}</span>
        </div>
        <span className="gallery-number">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="work-image">
        <img src={job.image} alt={`${job.company} project`} loading="lazy" />
      </div>
      <div className="work-card-copy">
        <div>
          <span>
            {job.period} · {job.location}
          </span>
        </div>
        <span className="arrow view-case-study-callout">
          {isCaseStudy ? "View case study ↗" : "View experience ↗"}
        </span>
      </div>
      {metricSummary && (
        <div className="work-card-metrics">
          <span>{metricSummary}</span>
        </div>
      )}
      <p className="card-summary">{job.summary}</p>
      {toolingLinks && toolingLinks.length > 0 && (
        <div className="card-tooling-pills" onClick={(e) => e.stopPropagation()}>
          {toolingLinks.map((tl) => (
            <a
              key={tl.label}
              href={tl.url}
              target="_blank"
              rel="noreferrer noopener"
              className="tooling-pill"
              onClick={(e) => e.stopPropagation()}
            >
              {tl.label}
            </a>
          ))}
        </div>
      )}
    </Link>
  );
};

const ProjectCard = ({ project, index }: { project: Project; index: number }) => (
  <Link
    data-reveal
    className="work-card project-card"
    to={`/work/${project.slug}`}
    style={{ "--accent": project.accent } as React.CSSProperties}
  >
    <div className="gallery-meta">
      <div>
        <h3>{project.title}</h3>
        <span>{project.category}</span>
      </div>
      <span className="gallery-number">
        {String(index + 1).padStart(2, "0")}
      </span>
    </div>
    <div className="work-image project-work-image">
      <img src={project.image} alt={project.title} loading="lazy" />
    </div>
    <div className="work-card-copy">
      <div>
        <span>{project.category}</span>
      </div>
      <span className="arrow">View project ↗</span>
    </div>
    <p>{project.description}</p>
  </Link>
);

const Home = () => {
  useReveal();
  useWorkSnap();
  const [featuredExp, ...scrollingExp] = content.experience;

  return (
    <main className="home-page">
      <section className="hero">
        <div className="hero-copy">
          <div className="hero-status-pill" data-reveal>
            <span className="hero-status-beacon" aria-hidden="true" />
            <span>{content.home.statusLine}</span>
          </div>
          <h1>
            I build <span className="hero-word-systems">{content.home.outlineWord}</span> that power products at scale.
          </h1>
          <div className="hero-meta">
            <p>{content.home.intro}</p>
            <div className="hero-links">
              <a
                href="/resume.pdf"
                download="Kiran_S_Baliga_Resume.pdf"
                className="btn-primary"
                data-cursor="RESUME"
              >
                <svg
                  className="btn-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {content.home.primaryAction} <span>↓</span>
              </a>
              <a href="#work" className="btn-secondary">
                Selected Work & Case Studies <span>↓</span>
              </a>
              <Link to="/info" className="btn-secondary">
                {content.home.secondaryAction} <span>→</span>
              </Link>
              <a href={`mailto:${content.site.email}`} className="btn-secondary">
                Contact <span>↗</span>
              </a>
            </div>
          </div>
        </div>
        <div className="hero-footer">
          <span>{content.site.location}</span>
          <a href="#work" className="hero-scroll-btn">
            Work & Case Studies <span>↓</span>
          </a>
        </div>
      </section>

      <section id="work" className="work-section home-work-section">
        <div className="section-intro">
          <span className="eyebrow">01 / Selected Case Studies & Systems Work</span>
        </div>
        <div className="home-work-grid experience-work-grid">
          <div className="home-featured">
            <ExperienceCard job={featuredExp} index={0} />
          </div>
          <div className="home-work-side">
            {scrollingExp.map((job, index) => (
              <ExperienceCard key={job.slug} job={job} index={index + 1} />
            ))}
          </div>
        </div>

        <div className="view-all-work-wrap">
          <Link to="/work" className="btn-outline-wide">
            View all work & archive ({content.projects.length + content.experience.length}) →
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
};

const WorkIndex = () => {
  useReveal();
  const [filter, setFilter] = useState<"all" | "projects" | "experience">("all");

  const showProjects = filter === "all" || filter === "projects";
  const showExperience = filter === "all" || filter === "experience";

  return (
    <main className="work-index-page">
      <section className="work-index-heading">
        <div className="work-index-nav">
          <Link to="/" className="work-back-link">← Home</Link>
        </div>
        <div className="work-heading-flex">
          <h1>Work</h1>
          <div className="work-filter-pills" role="tablist" aria-label="Filter work items">
            <button
              className={`filter-pill ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All <span>({content.projects.length + content.experience.length})</span>
            </button>
            <button
              className={`filter-pill ${filter === "projects" ? "active" : ""}`}
              onClick={() => setFilter("projects")}
            >
              Projects <span>({content.projects.length})</span>
            </button>
            <button
              className={`filter-pill ${filter === "experience" ? "active" : ""}`}
              onClick={() => setFilter("experience")}
            >
              Experience <span>({content.experience.length})</span>
            </button>
          </div>
        </div>
      </section>

      <section className="work-gallery-section">
        <div className="work-gallery">
          {showExperience &&
            content.experience.map((job, index) => (
              <ExperienceCard key={job.slug} job={job} index={index} />
            ))}
          {showProjects &&
            content.projects.map((proj, index) => (
              <ProjectCard
                key={proj.slug}
                project={proj}
                index={showExperience ? content.experience.length + index : index}
              />
            ))}
        </div>
      </section>
      <Footer />
    </main>
  );
};

const InfoService = ({ title, items }: { title: string; items: string[] }) => (
  <div className="info-service">
    <h3>{title}</h3>
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

const Info = () => {
  useReveal();
  return (
    <main className="info-page">
      <section className="info-hero">
        <img
          className="info-portrait"
          src={content.site.portrait}
          alt={content.site.name}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = "/portfolio/kiran-portrait.png";
          }}
        />
        <div className="info-hero-copy">
          <span className="eyebrow">{content.about.label}</span>
          <h1>
            <span>{content.about.headline}</span>
            <em>{content.site.location}</em>
          </h1>
          <p>{content.about.subline}</p>
        </div>
      </section>
      <section className="info-overview">
        <div className="info-overview-services">
          <h2>Engineering Capabilities</h2>
          <div className="capabilities-grid">
            {content.engineeringCapabilities.map((cap) => (
              <div key={cap.title} className="capability-box">
                <h3>{cap.title}</h3>
                <ul>
                  {cap.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="info-overview-facts">
          <h2>Experience & Education</h2>
          {content.experience.map((job) => (
            <ExperienceRow key={job.company} job={job} />
          ))}
          <article className="experience-row">
            <div>
              <h3>APJ Abdul Kalam Technological University</h3>
              <span>B.Tech in Computer Science & Engineering (Minor ECE) · GPA 8.43</span>
            </div>
            <time>2023</time>
          </article>
        </div>
        <div className="info-overview-contact">
          <h2>Contact & Links</h2>
          <a
            className="info-cv"
            href="/resume.pdf"
            download="Kiran_S_Baliga_Resume.pdf"
            style={{ fontWeight: 600, color: "var(--text)" }}
          >
            Download Resume ↓
          </a>
          <a className="info-email" href={`mailto:${content.site.email}`}>
            {content.site.email}
          </a>
          <a
            className="info-cv"
            href={content.site.linkedin}
            target="_blank"
            rel="noreferrer noopener"
          >
            LinkedIn ↗
          </a>
          <a
            className="info-cv"
            href={content.site.github}
            target="_blank"
            rel="noreferrer noopener"
          >
            GitHub ↗
          </a>
          <a
            className="info-cv"
            href={content.site.npm}
            target="_blank"
            rel="noreferrer noopener"
          >
            NPM Registry ↗
          </a>
          <a
            className="info-cv"
            href={content.site.pypi}
            target="_blank"
            rel="noreferrer noopener"
          >
            PyPI Registry ↗
          </a>
        </div>
      </section>
      <section style={{ padding: "0 3.8vw 4vw" }}>
        <p className="footer-services-note">
          Looking for client web design, WordPress migration, or custom MVP scoping?{" "}
          <Link to="/services">View Client Services & Web Consulting ↗</Link>
        </p>
      </section>
      <Footer />
    </main>
  );
};

const ServicesPage = () => {
  useReveal();
  return (
    <main className="services-page">
      <section className="services-hero">
        <span className="eyebrow">Client Services & Web Consulting</span>
        <h1>Web Design, Development & Client Consulting</h1>
        <p>
          For founders, agencies, and businesses looking for custom web design, WordPress migrations, digital product architecture, and project scoping.
        </p>
      </section>

      <section className="services-grid-wrap">
        {content.freelance.services.map((service) => (
          <InfoService
            key={service.title}
            title={service.title}
            items={service.items}
          />
        ))}
      </section>

      <section className="info-faq" style={{ padding: "0 0 6vw" }}>
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          {content.freelance.faqs.map(([question, answer]) => (
            <article data-reveal key={question}>
              <h3>{question}</h3>
              <p>{answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="services-cta-banner" data-reveal>
        <div>
          <h2>Have a project in mind?</h2>
          <p>
            Tell me about your product requirements, timeline, or redesign goals and I'll provide a clear project scope.
          </p>
        </div>
        <a
          href={`mailto:${content.site.email}?subject=Project%20Inquiry%20/%20Scoping`}
          className="btn-banner"
        >
          Inquire for Project Scoping <span>↗</span>
        </a>
      </section>

      <Footer />
    </main>
  );
};

const ExperienceRow = ({ job }: { job: Experience }) => (
  <article className="experience-row">
    <div>
      <h3>{job.company}</h3>
      <span>
        {job.role} · {job.location}
      </span>
    </div>
    <time>{job.period}</time>
  </article>
);

type GalleryItem = {
  type?: string;
  src: string;
  fallback?: string;
  caption: string;
};

const AutoScrollGallery = ({ items }: { items: GalleryItem[] }) => {
  const repeated = Array.from(
    { length: Math.max(2, Math.ceil(4 / items.length)) },
    () => items
  ).flat();

  return (
    <div className="gallery-marquee" data-reveal>
      <div className="gallery-marquee-track">
        {[0, 1].map((groupIdx) => (
          <div
            key={groupIdx}
            className="gallery-marquee-group"
            aria-hidden={groupIdx === 1}
          >
            {repeated.map((item, idx) => (
              <figure key={`${groupIdx}-${idx}`} className="gallery-slide">
                <div className="gallery-slide-media">
                  {item.type === "video" ? (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                      onCanPlay={(e) => {
                        void e.currentTarget.play().catch(() => undefined);
                      }}
                    >
                      <source src={item.src} type="video/webm" />
                      {item.fallback && (
                        <source src={item.fallback} type="video/mp4" />
                      )}
                    </video>
                  ) : (
                    <img src={item.src} alt={item.caption} loading="lazy" />
                  )}
                </div>
                <figcaption className="gallery-slide-caption">
                  {item.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

type CaseStudyChapter = {
  title: string;
  kicker?: string;
  summary?: string;
  body?: string;
  link?: string;
  linkLabel?: string;
  workflow?: string[];
  workflowComparison?: {
    beforeTitle?: string;
    before: string[];
    afterTitle?: string;
    after: string[];
  };
  points?: string[];
  subsections?: {
    tag?: string;
    title: string;
    body: string;
    points?: string[];
  }[];
  table?: { area: string; impact: string }[];
  takeaways?: {
    title: string;
    body: string;
  }[];
};

type CaseStudyProps = {
  title: string;
  kicker: string;
  eyebrow: string;
  summary: string;
  headline: string;
  accent: string;
  banner: string;
  link: string;
  gallery: Project["gallery"];
  chapters: CaseStudyChapter[];
  metrics?: { value: string; label: string }[];
  toolingLinks?: { label: string; url: string }[];
};

const CaseStudyPage = ({
  title,
  kicker,
  eyebrow,
  summary,
  headline,
  accent,
  banner,
  link,
  gallery,
  chapters,
  metrics,
  toolingLinks
}: CaseStudyProps) => {
  useReveal();
  const domain = link.replace(/^https?:\/\/(www\.)?/, "").split("/")[0];

  return (
    <main className="project-page">
      <section
        className="project-hero"
        style={{ "--accent": accent } as React.CSSProperties}
      >
        <div className="project-hero-banner" aria-hidden="true">
          <img src={banner} alt="" />
        </div>
        <div className="project-kicker">
          <Link to="/work">← All work</Link>
          <span>{kicker}</span>
        </div>
        <h1>
          <a
            href={link}
            target="_blank"
            rel="noreferrer noopener"
            className="hero-title-link"
          >
            {title} <span className="hero-title-arrow">↗</span>
          </a>
        </h1>
        <p>{summary}</p>

        {metrics && metrics.length > 0 && (
          <div className="case-study-hero-metrics" data-reveal>
            {metrics.map((m, idx) => (
              <div key={idx} className="metric-box">
                <span className="metric-value">{m.value}</span>
                <span className="metric-label">{m.label}</span>
              </div>
            ))}
          </div>
        )}

        {toolingLinks && toolingLinks.length > 0 && (
          <div className="case-study-hero-tooling" data-reveal>
            <span className="tooling-heading">Tools & Registries:</span>
            <div className="tooling-links-wrap">
              {toolingLinks.map((tl) => (
                <a
                  key={tl.label}
                  href={tl.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="tooling-pill"
                >
                  {tl.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </section>
      <AutoScrollGallery items={gallery} />
      <section className="project-story">
        <div className="story-lead" data-reveal>
          <div className="story-lead-meta">
            <span className="eyebrow">{eyebrow}</span>
            <a
              href={link}
              target="_blank"
              rel="noreferrer noopener"
              className="story-site-link"
            >
              Visit {domain} ↗
            </a>
          </div>
          <h2>
            <a
              href={link}
              target="_blank"
              rel="noreferrer noopener"
              className="story-title-link"
            >
              {headline}
            </a>
          </h2>
        </div>
        <div className="story-chapters">
          {chapters.map((chapter, idx) => (
            <article className="story-chapter" data-reveal key={chapter.title}>
              <div className="story-chapter-header">
                <span className="story-chapter-index">
                  {chapter.kicker || `0${idx + 1}`}
                </span>
                <h3>
                  {chapter.link ? (
                    <a
                      href={chapter.link}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="story-chapter-title-link"
                    >
                      {chapter.title} <span>↗</span>
                    </a>
                  ) : (
                    chapter.title
                  )}
                </h3>
                {chapter.summary && (
                  <p className="story-chapter-summary">{chapter.summary}</p>
                )}
                {chapter.link && (
                  <a
                    href={chapter.link}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="story-chapter-link"
                  >
                    {chapter.linkLabel || `${chapter.link} ↗`}
                  </a>
                )}
              </div>

              <div className="story-chapter-content">
                {chapter.body && (
                  <p className="story-chapter-body">{chapter.body}</p>
                )}

                {chapter.workflow && chapter.workflow.length > 0 && (
                  <div className="chapter-workflow-box">
                    <span className="chapter-box-label">End-to-End Pipeline Workflow</span>
                    <div className="chapter-workflow-rail">
                      {chapter.workflow.map((step, sIdx) => (
                        <div key={sIdx} className="workflow-step-item">
                          <span className="workflow-step-pill">{step}</span>
                          {sIdx < chapter.workflow!.length - 1 && (
                            <span className="workflow-arrow" aria-hidden="true">→</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {chapter.workflowComparison && (
                  <div className="chapter-comparison-box">
                    <span className="chapter-box-label">Computation Architecture Migration</span>
                    <div className="comparison-cols-wrap">
                      <div className="comparison-col">
                        <span className="comparison-badge before">
                          {chapter.workflowComparison.beforeTitle || "Before · Server Batch Queue"}
                        </span>
                        <div className="comparison-rail">
                          {chapter.workflowComparison.before.map((step, sIdx) => (
                            <div key={sIdx} className="workflow-step-item">
                              <span className="workflow-step-pill">{step}</span>
                              {sIdx < chapter.workflowComparison!.before.length - 1 && (
                                <span className="workflow-arrow" aria-hidden="true">→</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="comparison-col">
                        <span className="comparison-badge after">
                          {chapter.workflowComparison.afterTitle || "After · On-Device KMP (Immediate)"}
                        </span>
                        <div className="comparison-rail">
                          {chapter.workflowComparison.after.map((step, sIdx) => (
                            <div key={sIdx} className="workflow-step-item">
                              <span className="workflow-step-pill active">{step}</span>
                              {sIdx < chapter.workflowComparison!.after.length - 1 && (
                                <span className="workflow-arrow" aria-hidden="true">→</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {chapter.points && chapter.points.length > 0 && (
                  <ul className="chapter-points-list">
                    {chapter.points.map((pt, pIdx) => (
                      <li key={pIdx}>{pt}</li>
                    ))}
                  </ul>
                )}

                {chapter.subsections && chapter.subsections.length > 0 && (
                  <div className="chapter-subsections-grid">
                    {chapter.subsections.map((sub, sIdx) => (
                      <div key={sIdx} className="chapter-subsection-card">
                        {sub.tag && <span className="subsection-tag">{sub.tag}</span>}
                        <h4>{sub.title}</h4>
                        <p>{sub.body}</p>
                        {sub.points && (
                          <ul className="subsection-points">
                            {sub.points.map((p, pi) => (
                              <li key={pi}>{p}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {chapter.table && chapter.table.length > 0 && (
                  <div className="chapter-table-wrap">
                    <table className="chapter-impact-table">
                      <thead>
                        <tr>
                          <th>Measurement / Area</th>
                          <th>Quantified Impact</th>
                        </tr>
                      </thead>
                      <tbody>
                        {chapter.table.map((row, rIdx) => (
                          <tr key={rIdx}>
                            <td className="table-area">{row.area}</td>
                            <td className="table-impact">{row.impact}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {chapter.takeaways && chapter.takeaways.length > 0 && (
                  <div className="chapter-takeaways-grid">
                    {chapter.takeaways.map((t, tIdx) => (
                      <div key={tIdx} className="chapter-takeaway-card">
                        <h4>{t.title}</h4>
                        <p>{t.body}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
};

const ProjectPage = ({ project }: { project: Project }) => (
  <CaseStudyPage
    title={project.title}
    kicker={project.category}
    eyebrow={project.category}
    summary={project.description}
    headline={project.headline}
    accent={project.accent}
    banner={project.banner || project.image}
    link={project.link}
    gallery={project.gallery}
    chapters={project.chapters}
  />
);

const ExperiencePage = ({ job }: { job: Experience }) => {
  const metrics = "metrics" in job ? (job.metrics as { value: string; label: string }[]) : undefined;
  const toolingLinks = "toolingLinks" in job ? (job.toolingLinks as { label: string; url: string }[]) : undefined;
  const subCompany = "subCompany" in job ? (job.subCompany as string | undefined) : undefined;

  return (
    <CaseStudyPage
      title={job.company}
      kicker={`${job.role}${subCompany ? ` · ${subCompany}` : ""} · ${job.location} · ${job.period}`}
      eyebrow={`${job.role}${subCompany ? ` (${subCompany})` : ""} · ${job.period}`}
      summary={job.summary}
      headline={job.headline}
      accent={job.accent}
      banner={job.banner || job.image}
      link={job.link}
      gallery={job.gallery}
      chapters={job.chapters}
      metrics={metrics}
      toolingLinks={toolingLinks}
    />
  );
};

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // Normalize path by stripping trailing slashes
  const path = location.pathname.replace(/\/+$/, "") || "/";
  const pathSegments = path.split("/").filter(Boolean);

  // Match experience: /work/experience/:slug or /experience/:slug
  const experienceSlug =
    (pathSegments[0] === "work" &&
      pathSegments[1] === "experience" &&
      pathSegments[2]) ||
    (pathSegments[0] === "experience" && pathSegments[1]) ||
    null;
  const experience = experienceSlug
    ? content.experience.find((item) => item.slug === experienceSlug)
    : null;

  // Match project: /work/:slug or /project/:slug or direct /:slug (if matching a project slug)
  const projectSlug =
    (pathSegments[0] === "work" &&
      pathSegments[1] &&
      pathSegments[1] !== "experience" &&
      pathSegments[1]) ||
    (pathSegments[0] === "project" && pathSegments[1]) ||
    (pathSegments.length === 1 &&
      content.projects.some((p) => p.slug === pathSegments[0]) &&
      pathSegments[0]) ||
    null;
  const project = projectSlug
    ? content.projects.find((item) => item.slug === projectSlug)
    : null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest("a");
      if (
        anchor?.pathname &&
        !anchor.hash &&
        anchor.origin === window.location.origin
      ) {
        event.preventDefault();
        navigate(anchor.pathname);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [navigate]);

  return (
    <div className="app-shell">
      <CustomCursor />
      <div className="noise-overlay" aria-hidden="true" />
      <Header />
      <div key={location.pathname} className="page-transition">
        {path === "/services" ? (
          <ServicesPage />
        ) : path === "/info" ? (
          <Info />
        ) : path === "/work" ? (
          <WorkIndex />
        ) : experience ? (
          <ExperiencePage job={experience} />
        ) : project ? (
          <ProjectPage project={project} />
        ) : (
          <Home />
        )}
      </div>
    </div>
  );
}
