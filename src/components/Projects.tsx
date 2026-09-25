import React, { useState, useRef, useEffect, useCallback } from "react";
import { PROJECTS, ProjectData } from "../data/portfolioData";
import { CaseStudyModal } from "./CaseStudyModal";
import "./Projects.css";

const AUTO_SCROLL_DURATION = 6000; // 6 seconds per slide

export const Projects: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<ProjectData | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const trackRef = useRef<HTMLDivElement>(null);
  const progressStartTimeRef = useRef<number>(Date.now());
  const animationFrameRef = useRef<number | null>(null);

  const scrollToCard = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, PROJECTS.length - 1));
    setActiveIndex(clamped);
    setProgress(0);
    progressStartTimeRef.current = Date.now();

    if (trackRef.current) {
      const card = trackRef.current.children[clamped] as HTMLElement;
      if (card) {
        const containerWidth = trackRef.current.offsetWidth;
        const cardLeft = card.offsetLeft;
        const cardWidth = card.offsetWidth;
        const scrollTarget = cardLeft - (containerWidth - cardWidth) / 2;
        trackRef.current.scrollTo({
          left: scrollTarget,
          behavior: "smooth",
        });
      }
    }
  }, []);

  const nextSlide = useCallback(() => {
    const next = (activeIndex + 1) % PROJECTS.length;
    scrollToCard(next);
  }, [activeIndex, scrollToCard]);

  const prevSlide = useCallback(() => {
    const prev = activeIndex === 0 ? PROJECTS.length - 1 : activeIndex - 1;
    scrollToCard(prev);
  }, [activeIndex, scrollToCard]);

  // Auto-scroll loop with smooth progress bar
  useEffect(() => {
    if (isPaused || selectedCaseStudy !== null) {
      return;
    }

    progressStartTimeRef.current = Date.now() - (progress / 100) * AUTO_SCROLL_DURATION;

    const tick = () => {
      const elapsed = Date.now() - progressStartTimeRef.current;
      const currentProgress = Math.min((elapsed / AUTO_SCROLL_DURATION) * 100, 100);
      setProgress(currentProgress);

      if (elapsed >= AUTO_SCROLL_DURATION) {
        nextSlide();
      } else {
        animationFrameRef.current = requestAnimationFrame(tick);
      }
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activeIndex, isPaused, selectedCaseStudy, nextSlide, progress]);

  // Manual scroll detection
  const handleScroll = useCallback(() => {
    if (!trackRef.current) return;
    const container = trackRef.current;
    const containerCenter = container.scrollLeft + container.offsetWidth / 2;
    let closest = 0;
    let closestDist = Infinity;
    Array.from(container.children).forEach((child, i) => {
      const el = child as HTMLElement;
      if (el.classList.contains("carousel-end-spacer")) return;
      const cardCenter = el.offsetLeft + el.offsetWidth / 2;
      const dist = Math.abs(containerCenter - cardCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    if (closest !== activeIndex) {
      setActiveIndex(closest);
      setProgress(0);
      progressStartTimeRef.current = Date.now();
    }
  }, [activeIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selectedCaseStudy) return;
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [nextSlide, prevSlide, selectedCaseStudy]);

  return (
    <section
      className="projects-section"
      id="selected-works"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ─── Section Header ─── */}
      <div className="projects-header">
        <div className="section-label-row">
          <div className="label-left">
            <span className="marker-plus">+</span>
            <span className="section-label-text mono">02 // SELECTED WORK</span>
            <span className="auto-scroll-indicator mono">
              {isPaused ? "PAUSED" : "AUTO-SCROLLING"}
            </span>
          </div>
          <div className="carousel-nav">
            <span className="carousel-counter mono">
              {String(activeIndex + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
            </span>
            <button
              className="carousel-arrow"
              onClick={prevSlide}
              aria-label="Previous project"
            >
              ←
            </button>
            <button
              className="carousel-arrow"
              onClick={nextSlide}
              aria-label="Next project"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* ─── Carousel Track ─── */}
      <div
        className="carousel-track"
        ref={trackRef}
        onScroll={handleScroll}
      >
        {PROJECTS.map((project, index) => (
          <SplitProjectCard
            key={project.id}
            project={project}
            isActive={index === activeIndex}
            onOpenCaseStudy={() => setSelectedCaseStudy(project)}
          />
        ))}
        <div className="carousel-end-spacer" aria-hidden="true"></div>
      </div>

      {/* ─── Bottom Segmented Progress Bar (Matching 3rd Image) ─── */}
      <div className="carousel-progress-footer">
        <div className="segmented-progress-bars">
          {PROJECTS.map((p, i) => (
            <button
              key={p.id}
              className={`progress-bar-segment ${i === activeIndex ? "active" : ""} ${i < activeIndex ? "completed" : ""}`}
              onClick={() => scrollToCard(i)}
              aria-label={`Go to ${p.title}`}
            >
              <div
                className="segment-fill"
                style={{
                  width:
                    i === activeIndex
                      ? `${progress}%`
                      : i < activeIndex
                      ? "100%"
                      : "0%",
                }}
              ></div>
            </button>
          ))}
        </div>
        <div className="progress-counter-wrap mono">
          <span className="active-idx">{String(activeIndex + 1).padStart(2, "0")}</span>
          <span className="sep-slash">/</span>
          <span className="total-idx">{String(PROJECTS.length).padStart(2, "0")}</span>
        </div>
      </div>

      {/* ─── Case Study Modal ─── */}
      <CaseStudyModal
        project={selectedCaseStudy}
        onClose={() => setSelectedCaseStudy(null)}
      />
    </section>
  );
};

/* ─── Split Project Card (Left Content, Right Visuals — Matching 3rd Image) ─── */
interface CardProps {
  project: ProjectData;
  isActive: boolean;
  onOpenCaseStudy: () => void;
}

const SplitProjectCard: React.FC<CardProps> = ({ project, isActive, onOpenCaseStudy }) => {
  const [activeView, setActiveView] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const views = [
    { label: "Architecture", id: "arch" },
    { label: "Dashboard", id: "dash" },
    { label: "Telemetry", id: "telemetry" },
    { label: "Pipeline", id: "pipeline" },
  ];

  const handleSimulate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 1200);
  };

  return (
    <article className={`split-showcase-card ${isActive ? "card-active" : ""}`}>
      {/* ─── LEFT COLUMN: Text & Actions ─── */}
      <div className="card-left-col">
        <div className="card-top-meta">
          <div className="tag-group">
            <span className="category-pill mono">{project.category}</span>
            <span className="live-preview-tag mono">
              <span className="live-dot">●</span> Live preview
            </span>
          </div>
          <span className="card-big-number mono">{project.categoryNumber}</span>
        </div>

        <div className="card-body-content">
          <h3 className="card-product-title">{project.title}</h3>
          <p className="card-product-subhead">{project.subtitle}</p>

          <div className="card-highlight-callout">
            <span className="callout-square-bullet">■</span>
            <p className="callout-text">{project.description}</p>
          </div>
        </div>

        <div className="card-action-row">
          {project.link && project.link !== "#" && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="action-btn-primary mono"
            >
              Try it live ↗
            </a>
          )}
          <button
            className="action-btn-secondary mono"
            onClick={onOpenCaseStudy}
          >
            The story →
          </button>
        </div>
      </div>

      {/* ─── RIGHT COLUMN: Canvas Showcase & Views ─── */}
      <div className="card-right-col">
        <div className="right-canvas-wrapper">
          {/* Top Fullscreen expand button */}
          <button
            className="canvas-expand-btn"
            onClick={onOpenCaseStudy}
            title="Expand Case Study & Architecture"
            aria-label="Expand case study"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 2H14M14 2V6M14 2L9 7M6 14H2M2 14V10M2 14L7 9" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Canvas View Content based on activeView */}
          <div className="canvas-interactive-display">
            {activeView === 0 && (
              /* View 0: Interactive Architecture Browser Frame */
              <div className="mockup-browser-window">
                <div className="mockup-window-bar">
                  <div className="window-mac-dots">
                    <span className="w-dot dot-r"></span>
                    <span className="w-dot dot-y"></span>
                    <span className="w-dot dot-g"></span>
                  </div>
                  <span className="window-url mono">app.{project.id}.io/workspace</span>
                  <span className="window-status mono">● ACTIVE</span>
                </div>
                <div className="mockup-window-body">
                  <div className="mockup-inner-header">
                    <div>
                      <h5 className="mockup-core-title mono">{project.architecture.code}</h5>
                      <p className="mockup-core-subhead mono">{project.architecture.subhead}</p>
                    </div>
                    <button
                      className={`mockup-run-btn mono ${isSimulating ? "running" : ""}`}
                      onClick={handleSimulate}
                    >
                      {isSimulating ? "RUNNING..." : "RUN"}
                    </button>
                  </div>
                  <div className="mockup-metrics-row">
                    {project.architecture.metrics.map((m, idx) => (
                      <div key={idx} className="mockup-metric-box">
                        <span className="m-label mono">{m.label}</span>
                        <span className="m-val mono">{m.value}</span>
                        <div className="m-bar-bg">
                          <div
                            className="m-bar-fill"
                            style={{
                              width: `${m.progress}%`,
                              background: idx === 0 ? "var(--hero-bg)" : idx === 1 ? "#10b981" : "#6366f1",
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeView === 1 && (
              /* View 1: Real Visual Media or Interactive Dashboard */
              <div className="mockup-dashboard-view">
                {project.image ? (
                  <div className="mockup-image-frame">
                    <img src={project.image} alt={project.title} className="mockup-visual-img" />
                  </div>
                ) : (
                  <div className="mockup-preview-card">
                    <div className="preview-card-header">
                      <span className="preview-badge mono">MONITORING</span>
                      <span className="preview-time mono">LIVE REPLICATION</span>
                    </div>
                    <div className="preview-card-stats">
                      <span className="stat-big mono">99.98%</span>
                      <span className="stat-label">SLA Uptime Across 15 Regions</span>
                    </div>
                    <div className="preview-mini-pipeline">
                      {project.techStack.map((t) => (
                        <span key={t} className="tech-chip mono">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeView === 2 && (
              /* View 2: Telemetry Metrics Grid */
              <div className="mockup-telemetry-view">
                <div className="telemetry-grid">
                  {project.caseStudy.results.map((res, i) => (
                    <div key={i} className="telemetry-card">
                      <span className="telemetry-num mono">0{i + 1}</span>
                      <p className="telemetry-text">{res}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeView === 3 && (
              /* View 3: Pipeline Flow Nodes */
              <div className="mockup-pipeline-view">
                <div className="pipeline-flow-diagram">
                  {project.architecture.pipelineNodes.map((node, i) => (
                    <React.Fragment key={i}>
                      <div className={`diagram-node-box mono ${node.active ? "node-active" : ""}`}>
                        <span className="d-dot" style={{ background: node.color || "var(--hero-bg)" }}></span>
                        <span>{node.label}</span>
                      </div>
                      {i < project.architecture.pipelineNodes.length - 1 && (
                        <span className="diagram-arrow mono">⟶</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Floating Device Accent (Like Mobile Phone floating in 3rd image!) */}
          <div className="floating-mobile-accent" onClick={onOpenCaseStudy}>
            <div className="mobile-accent-header">
              <span className="mobile-speaker"></span>
            </div>
            <div className="mobile-accent-body">
              <span className="mobile-label mono">{project.role}</span>
              <h6 className="mobile-title">{project.title}</h6>
              <div className="mobile-status-dot">
                <span className="pulse-green"></span>
                <span className="mono">Synced</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Thumbnail Switcher (Exact to 3rd image) */}
        <div className="right-thumbnails-bar">
          <div className="thumbnails-group">
            {views.map((v, i) => (
              <button
                key={v.id}
                className={`thumb-btn ${i === activeView ? "active" : ""}`}
                onClick={() => setActiveView(i)}
                aria-label={v.label}
              >
                <div className="thumb-preview-mini">
                  <span className="mini-icon">{i === 0 ? "◫" : i === 1 ? "▤" : i === 2 ? "▦" : "☷"}</span>
                </div>
              </button>
            ))}
          </div>
          <span className="views-count-label mono">{views.length} views</span>
        </div>
      </div>
    </article>
  );
};
