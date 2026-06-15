import { useEffect, useRef, useState } from "react";
import "./Exprerience.css";
import { data } from "../../constants/data";
import Modal from "../Modal/Modal";
import { usePrefersReducedMotion } from "../../hooks/useMedia";
import { useMagnetic } from "../../hooks/useMagnetic";

const skillTags = [
  "Ruby On Rails",
  "NodeJS",
  "fastAPI",
  "Django",
  "React",
  "Flutter",
  "Python",
  "Ruby",
  "AI",
  "Figma",
  "PostgreSQL",
  "MongoDB",
  "AWS",
  "UI/UX",
  "Cpp",
  "Java",
  "PhotoShop",
  "Premiere Pro",
];

const Experience = ({ isFromMobile }: { isFromMobile: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [cursorXY, setCursorXY] = useState({ x: 0, y: 0 });
  const expDataRef = useRef<HTMLDivElement>(null);
  const resumeRef = useMagnetic<HTMLAnchorElement>(0.3, 80);
  const reducedMotion = usePrefersReducedMotion();
  const showFollower = !isFromMobile && !reducedMotion;

  useEffect(() => {
    if (!showFollower) return;
    const handleMouseMove = (event: MouseEvent) => {
      if (!expDataRef.current) return;
      const rect = expDataRef.current.getBoundingClientRect();
      setCursorXY({ x: event.clientX - rect.left, y: event.clientY - rect.top });
    };
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [showFollower]);

  const openEntry = (index: number) => {
    setSelectedIndex(index);
    setIsOpen(true);
  };

  return (
    <>
      <Modal isOpen={isOpen} dataId={selectedIndex} setIsOpen={setIsOpen} />
      <div ref={expDataRef} className="exp-data">
        {showFollower && (
          <span
            className="cursor-follower"
            aria-hidden="true"
            style={{ left: cursorXY.x, top: cursorXY.y }}
          ></span>
        )}
        {data.map((item, index) => (
          <button
            type="button"
            className="exp-item"
            key={item.title}
            aria-haspopup="dialog"
            onClick={() => openEntry(index)}
          >
            <span className="year">{item.year}</span>
            <span className="title">{item.title}</span>
            <span className="position">{item.position}</span>
            <span className="tags">{item.tags.join(", ")}</span>
          </button>
        ))}
        <div className="skills-wrapper">
          <div className="skills">
            <span>skills</span>
            <div className="skill-tags">{skillTags.join(", ")}</div>
          </div>

          <a
            ref={resumeRef}
            href="https://baliga.dev/resume"
            target="_blank"
            rel="noopener noreferrer"
            className="resume-link"
          >
            Resume ↗
          </a>
        </div>
      </div>
    </>
  );
};

export default Experience;
