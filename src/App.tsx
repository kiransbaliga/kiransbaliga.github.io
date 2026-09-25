import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import content from "./data/siteContent.json";
import TechText from "./components/TechText";
import MaskedHeading from "./components/MaskedHeading";
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
          <Link to="/work">
            Work <span>02</span>
          </Link>
          <Link to="/info">
            About <span>03</span>
          </Link>
          <a
            href={content.site.blog}
            target="_blank"
            rel="noreferrer noopener"
          >
            Blog <span>04</span>
          </a>
          <a href="#contact">
            Contact <span>05</span>
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
        <em>something useful.</em>
      </div>
      <p className="footer-subtext">
        Available for freelance product engineering, MVPs, and AI systems consulting.
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
      </div>
      <div className="footer-bottom">
        <span>{content.site.copyright}</span>
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

const ExperienceCard = ({ job, index }: { job: Experience; index: number }) => (
  <Link
    data-reveal
    className={`work-card experience-card experience-${job.slug}`}
    to={`/work/experience/${job.slug}`}
  >
    <div className="gallery-meta">
      <div>
        <h3>{job.company}</h3>
        <span>{job.role}</span>
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
      <span className="arrow">View experience ↗</span>
    </div>
    <p>{job.summary}</p>
  </Link>
);

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
          <h1 className="hero-heading-tech" aria-label={content.home.headline}>
            <div className="hero-tech-line hero-tech-line-1">
              <div className="hero-tech-part-ibuild">
                <TechText
                  text="I BUILD"
                  fontFamily="'Barlow Condensed', sans-serif"
                  fontWeight={700}
                  letterSpacing={-0.045}
                  color="#151514"
                  accentColor="#151514"
                  align="left"
                  sweepOffset={0}
                  speed={0.95}
                  dashLength={4}
                  dashGap={2}
                  specks={12}
                  scaleToFit={false}
                />
              </div>
              <div className="hero-tech-part-systems">
                <MaskedHeading
                  text="SYSTEMS"
                  tag="span"
                  mediaType="image"
                  src="/portfolio/systems-image.jpg"
                  fillScale={1.35}
                  parallax={28}
                  drift={0}
                  brightness={1.15}
                  saturation={1.35}
                  reveal="none"
                  trigger="mount"
                  duration={0}
                  fontSize="inherit"
                  textScale={0}
                  weight={700}
                  tracking={-0.045}
                  lineHeight={1}
                  outline={true}
                  outlineColor="#151514"
                  outlineWidth={1.5}
                  className="hero-masked-systems"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif"
                  }}
                />
              </div>
            </div>
            <div className="hero-tech-line hero-tech-line-2">
              <TechText
                text="THAT POWER THE PRODUCTS"
                fontFamily="'Barlow Condensed', sans-serif"
                fontWeight={700}
                letterSpacing={-0.045}
                color="#151514"
                accentColor="#151514"
                align="left"
                sweepOffset={2.4}
                speed={1.05}
                dashLength={4}
                dashGap={2}
                specks={14}
                scaleToFit={false}
              />
            </div>
            <div className="hero-tech-line hero-tech-line-3">
              <TechText
                text="PEOPLE USE EVERY DAY."
                fontFamily="'Barlow Condensed', sans-serif"
                fontWeight={700}
                letterSpacing={-0.045}
                color="#151514"
                accentColor="#151514"
                align="left"
                sweepOffset={4.8}
                speed={0.9}
                dashLength={4}
                dashGap={2}
                specks={14}
                scaleToFit={false}
              />
            </div>
          </h1>
          <div className="hero-meta">
            <p>{content.home.intro}</p>
            <div className="hero-links">
              <a href={`mailto:${content.site.email}`} className="btn-primary">
                {content.home.primaryAction} <span>→</span>
              </a>
              <Link to="/info" className="btn-secondary">
                {content.home.secondaryAction} <span>→</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="hero-footer">
          <span>{content.site.location}</span>
          <a href="#work" className="hero-scroll-btn">
            Scroll <span>↓</span>
          </a>
        </div>
      </section>

      <section id="work" className="work-section home-work-section">
        <div className="section-intro">
          <span className="eyebrow">Selected scale & client work</span>
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
          <h2>Services</h2>
          {content.services.map((service) => (
            <InfoService
              key={service.title}
              title={service.title}
              items={service.items}
            />
          ))}
        </div>
        <div className="info-overview-facts">
          <h2>Experience</h2>
          {content.experience.map((job) => (
            <ExperienceRow key={job.company} job={job} />
          ))}
        </div>
        <div className="info-overview-contact">
          <h2>Contact & Connect</h2>
          <a className="info-email" href={`mailto:${content.site.email}`}>
            {content.site.email}
          </a>
          <a
            className="info-cv"
            href={`mailto:${content.site.email}?subject=Project%20Inquiry%20/%20Resume%20Request`}
          >
            Resume / Inquiry ↗
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
        </div>
      </section>
      <section className="info-faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          {content.faqs.map(([question, answer]) => (
            <article data-reveal key={question}>
              <h3>{question}</h3>
              <p>{answer}</p>
            </article>
          ))}
        </div>
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
  chapters: {
    title: string;
    body: string;
    link?: string;
    linkLabel?: string;
  }[];
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
  chapters
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
                  0{idx + 1}
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
              <p className="story-chapter-body">{chapter.body}</p>
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

const ExperiencePage = ({ job }: { job: Experience }) => (
  <CaseStudyPage
    title={job.company}
    kicker={`${job.role} · ${job.location} · ${job.period}`}
    eyebrow={`${job.role} · ${job.period}`}
    summary={job.summary}
    headline={job.headline}
    accent={job.accent}
    banner={job.banner || job.image}
    link={job.link}
    gallery={job.gallery}
    chapters={job.chapters}
  />
);

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
        {path === "/info" ? (
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
