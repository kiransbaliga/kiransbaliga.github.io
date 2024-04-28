import { useEffect, useRef } from "react";
import Experience from "../../components/Experience/Experience";
import RecordPlayer from "../../components/recordPlayer/RecordPlayer";
import "./HomePage.css";
import Scrollable from "../../components/scrollable/Scrollable";
import { about, projects, work } from "../../constants/data";
import AOS from 'aos';
import Gallery from "../../components/gallery/Gallery";
const HomePage = () => {
  const vinylRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    AOS.init(
      {
        duration: 2000,
      }
    );
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      if (vinylRef.current) {
        const scrollPosition =
          window.scrollY || document.documentElement.scrollTop;
        console.log("🚀 ~ handleScroll ~ scrollPosition:", scrollPosition);
        vinylRef.current.style.left = scrollPosition > 0 ? "-10%" : "17%";
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <>
      {/* home section */}
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
                    <a
                      href="https://instagram.com/kiransbaliga"
                      target="_blank"
                    >
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
          THE VIDEO STAR. RADIO KILLED THE VIDEO STAR RADIO KILLED THE VIDEO
          STAR. RADIO KILLED THE VIDEO STAR RADIO KILLED THE VIDEO STAR. RADIO
          KILLED THE VIDEO STAR
        </div>
        <div className="experience">
          <Experience />
        </div>
      </div>
      <div className="about-section">
        <Scrollable heading="About">
          <div className="myself">
            <Gallery links={about.me} />
            </div>
            {about.description.map((item, index) => (
              <div className="about-content" key={index}>{item}
            </div>
            ))}
            <div className="events">
              <Gallery links={about.pics}/>
            </div>
            <div className="volunteering">
              {about.volunteering.map((item, index) => (
                <div className="volunteer-item" key={index}>
                  <div className="volunteer-position">{item.position}</div>
                  <div className="volunteer-title">{item.title}</div>
                  <div className="volunteer-year">{item.year}</div>
                </div>
              ))}
            </div>

            <div className="other-pics">
              <Gallery links={about.images}/>
            </div>

        </Scrollable>
        <Scrollable heading="Work">
          {work.map((item, index) => (
            <div className="showcase" data-aos="fade" key={index}>
              <div className="showcase-media">
                {item.type === "image" ? (
                  <img src={item.media} alt="" />
                ) : (
                  <video src={item.media} autoPlay muted></video>
                )}
              </div>
              <div className="showcase-description">{item.description}</div>
            </div>
          ))}
        </Scrollable>

        <Scrollable heading="Projects">
          {projects.map((item, index) => (
            <div className="showcase" data-aos="fade"key={index}>
              <div className="showcase-media">
                {item.type === "image" ? (
                  <img src={item.media} alt="" />
                ) : (
                  <video src={item.media} autoPlay muted></video>
                )}
              </div>
              <div className="showcase-description">{item.description}</div>
            </div>
          ))}
        </Scrollable>
      </div>
    </>
  );
};
export default HomePage;
