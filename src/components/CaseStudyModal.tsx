import React, { useEffect } from "react";
import { ProjectData } from "../data/portfolioData";
import "./CaseStudyModal.css";

interface CaseStudyModalProps {
  project: ProjectData | null;
  onClose: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const { caseStudy } = project;

  return (
    <div className="case-study-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="case-study-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Chrome */}
        <div className="case-study-chrome">
          <div className="chrome-meta mono">
            <span className="chrome-badge">{project.categoryNumber} / CASE STUDY</span>
            <span className="chrome-sep">/</span>
            <span className="chrome-title">{project.title.toUpperCase()}</span>
          </div>
          <div className="chrome-actions">
            {project.link && project.link !== "#" && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="chrome-ext-btn mono"
              >
                LIVE LINK ↗
              </a>
            )}
            <button className="chrome-close-btn mono" onClick={onClose} aria-label="Close modal">
              ESC ✕
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="case-study-scroll-content">
          {/* Header */}
          <div className="case-study-hero">
            <div className="case-study-tagline mono">
              <span>{project.category}</span>
              <span className="dot-sep">•</span>
              <span>ROLE: {project.role}</span>
            </div>
            <h2 className="case-study-headline">{caseStudy.headline}</h2>
            <p className="case-study-summary">{caseStudy.summary}</p>
          </div>

          {/* Key Metrics / Snapshot Bar */}
          <div className="case-study-metrics-row">
            {project.architecture.metrics.map((metric, idx) => (
              <div key={idx} className="metric-box">
                <span className="metric-box-label mono">{metric.label}</span>
                <span className="metric-box-val mono">{metric.value}</span>
              </div>
            ))}
          </div>

          {/* The Challenge */}
          <section className="case-study-section">
            <div className="section-title-wrap">
              <span className="marker-plus">+</span>
              <h3 className="section-title mono">THE PROBLEM & CHALLENGE</h3>
            </div>
            <p className="section-body-text">{caseStudy.challenge}</p>
          </section>

          {/* Architecture & How It Was Built */}
          <section className="case-study-section">
            <div className="section-title-wrap">
              <span className="marker-plus">+</span>
              <h3 className="section-title mono">HOW IT WAS BUILT & ARCHITECTURE</h3>
            </div>
            <ul className="architecture-list">
              {caseStudy.architecture.map((item, idx) => (
                <li key={idx} className="architecture-item">
                  <span className="arch-bullet mono">[{String(idx + 1).padStart(2, "0")}]</span>
                  <span className="arch-text">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Pipeline Flow Visual */}
          <section className="case-study-section">
            <div className="section-title-wrap">
              <span className="marker-plus">+</span>
              <h3 className="section-title mono">SYSTEM PIPELINE FLOW</h3>
            </div>
            <div className="pipeline-flow-box">
              {project.architecture.pipelineNodes.map((node, i) => (
                <React.Fragment key={i}>
                  <div className={`pipeline-node-chip mono ${node.active ? "active" : ""}`}>
                    <span className="node-indicator" style={{ background: node.color || "var(--hero-bg)" }}></span>
                    <span>{node.label}</span>
                  </div>
                  {i < project.architecture.pipelineNodes.length - 1 && (
                    <span className="flow-arrow mono">⟶</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </section>

          {/* Outcomes & Impact */}
          <section className="case-study-section">
            <div className="section-title-wrap">
              <span className="marker-plus">+</span>
              <h3 className="section-title mono">RESULTS & IMPACT</h3>
            </div>
            <div className="results-grid">
              {caseStudy.results.map((res, idx) => (
                <div key={idx} className="result-card">
                  <span className="result-check mono">✓</span>
                  <p className="result-text">{res}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Technical Stack Details */}
          <section className="case-study-section">
            <div className="section-title-wrap">
              <span className="marker-plus">+</span>
              <h3 className="section-title mono">TECHNOLOGY DECISIONS</h3>
            </div>
            <div className="stack-table">
              {caseStudy.stackDetails.map((item, idx) => (
                <div key={idx} className="stack-row">
                  <span className="stack-tech mono">{item.technology}</span>
                  <span className="stack-purpose">{item.purpose}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Footer of modal */}
          <div className="case-study-footer-action">
            <p className="modal-cta-copy mono">Interested in building something similar?</p>
            <div className="modal-cta-btns">
              <a
                href="mailto:kiransbaliga@gmail.com"
                className="modal-cta-primary mono"
              >
                GET IN TOUCH ↗
              </a>
              {project.link && project.link !== "#" && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-cta-secondary mono"
                >
                  VISIT PROJECT REPO ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
