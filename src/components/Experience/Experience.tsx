import { useEffect, useRef, useState } from "react";
import "./Exprerience.css";
import { data } from "../../constants/data";
import Modal from "../Modal/Modal";

const skillTags = [
  "React",
  "Flutter",
  "NodeJS",
  "Python",
  "AI",
  "Figma",
  "fastAPI",
  "Django",
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
  const handleMouseMove = (event: { clientX: number; clientY: number }) => {
    if (!expDataRef.current) return;
    const rect = expDataRef.current.getBoundingClientRect();
    setCursorXY({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <Modal
        isOpen={isOpen}
        dataId={selectedIndex}
        setIsOpen={setIsOpen}
      ></Modal>
      <div ref={expDataRef} className="exp-data">
        {data.map((item, index) => (
          <div
            className="exp-item"
            key={index}
            onClick={() => {
              setSelectedIndex(index);
              setIsOpen(true);
            }}
          >
            <div className="year">{item.year}</div>
            <div className="title">{item.title}</div>
            <div className="position">{item.position}</div>
            <div className="exp-details">
              <div className="tags">
                <span className="tag">{item.tags.join(", ")}</span>
              </div>
            </div>
          </div>
        ))}
        <div className="skills-wrapper">
          <div className="skills">
            <span>skills</span>
            <div className="skill-tags">{skillTags.join(", ")}</div>
          </div>

          <a
            href="https://kiransbaliga.engineer/resume"
            target="blank"
            className="resume-link"
          >
            Resume ↗
            {!isFromMobile && (
              <div
                className="cursor-follower"
                style={{ left: cursorXY.x, top: cursorXY.y }}
              ></div>
            )}
          </a>
        </div>
      </div>
    </>
  );
};

export default Experience;
