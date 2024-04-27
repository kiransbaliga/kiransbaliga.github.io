import { useEffect, useRef } from "react";
import Experience from "../../components/Experience/Experience";
import RecordPlayer from "../../components/recordPlayer/RecordPlayer";
import "./HomePage.css";
const HomePage = () => {
  const vinylRef = useRef(null);
  useEffect(() => {
    const handleScroll = () => {
      if (vinylRef.current) {
        const scrollPosition = window.scrollY || document.documentElement.scrollTop;
        console.log("🚀 ~ handleScroll ~ scrollPosition:", scrollPosition)
        vinylRef.current.style.left = scrollPosition > 0 ? "20px" : "27%";
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div className="home-layout">
      <div className="hero-section">
        <div className="details">
          <div className="name">
            <span>kiransbaliga</span>
            <div className="socials">
              @kiransbaliga
              <span className="plusicon">+</span>
            </div>
            <div className="menu-socials">
              <ul>
                <li>
                  <a href="mailto:kiransbaliga@gmail.com" target="_blank">
                    Email
                  </a>
                </li>
                <li>
                  <a href="">Resume</a>
                </li>
                <li>
                  <a href="https://github.com/kiransbaliga" target="_blank">
                    {" "}
                    github
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com/kiransbaliga" target="_blank">
                    {" "}
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="https://linkedin.com/in/kiransbaliga">linkedin</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="designation">
            <span>Full Stack Developer</span>
            <span className="place">Kakkanad, Kochi</span>
          </div>
        </div>
        <div ref={vinylRef} className="vinyl">
          <RecordPlayer />
        </div>
      </div>
      <div className="divider-text">
        RADIO KILLED THE VIDEO STAR. RADIO KILLED THE VIDEO STAR RADIO KILLED
        THE VIDEO STAR. RADIO KILLED THE VIDEO STAR RADIO KILLED THE VIDEO STAR.
        RADIO KILLED THE VIDEO STAR RADIO KILLED THE VIDEO STAR. RADIO KILLED
        THE VIDEO STAR
      </div>
      <div className="experience">
        <Experience />
      </div>
    </div>
  );
};
export default HomePage;
