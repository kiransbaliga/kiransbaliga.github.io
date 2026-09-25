import React from "react";
import { EXPERIENCE } from "../data/portfolioData";
import "./Experience.css";

export const Experience: React.FC = () => {
  return (
    <section className="experience-section" id="experience-section">
      <div className="experience-container">
        {/* Section Header */}
        <div className="exp-label-row">
          <div className="label-left">
            <span className="marker-plus" style={{ color: "var(--hero-bg)" }}>+</span>
            <span className="exp-label-text mono">EXPERIENCE</span>
          </div>
          <span className="exp-count mono">{String(EXPERIENCE.length).padStart(2, "0")} ROLES</span>
        </div>

        {/* Timeline */}
        <div className="exp-timeline">
          {EXPERIENCE.map((exp, index) => (
            <article key={index} className="exp-entry">
              <div className="exp-entry-left">
                <span className="exp-year mono">{exp.year}</span>
                <div className="timeline-dot-line">
                  <div className="timeline-dot"></div>
                  {index < EXPERIENCE.length - 1 && <div className="timeline-line"></div>}
                </div>
              </div>

              <div className="exp-entry-right">
                <div className="exp-entry-header">
                  <h3 className="exp-company">{exp.company}</h3>
                  <span className="exp-position mono">{exp.position}</span>
                </div>

                <p className="exp-description">{exp.description}</p>

                <div className="exp-tags">
                  {exp.tags.map((tag) => (
                    <span key={tag} className="exp-tag mono">{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
