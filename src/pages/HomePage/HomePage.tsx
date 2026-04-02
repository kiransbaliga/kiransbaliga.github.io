import { useEffect, useRef, useState } from "react";
import Experience from "../../components/Experience/Experience";
import RecordPlayer from "../../components/recordPlayer/RecordPlayer";
import "./HomePage.css";
import Scrollable from "../../components/scrollable/Scrollable";
import { about, projects, work } from "../../constants/data";
import AOS from 'aos';
import Gallery from "../../components/gallery/Gallery";
const HomePage = () => {
  const [isFromMobile, setIsFromMobile] = useState(false);
  useEffect(() => {
    setIsFromMobile(window.innerWidth < 768);
  }, []);

  const alertRef = useRef<HTMLParagraphElement>(null);
  setTimeout(() => {
    if (alertRef.current)
      alertRef.current.style.display = 'none';
  }, 10000);

  const vinylRef = useRef<HTMLDivElement>(null);
  const [cursorText, setCursorText] = useState('Next');
  const [isCursorVisible, setIsCursorVisible] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  const onMouseEnterGallery = () => {
    setCursorText('Next')
    setIsCursorVisible(true);
    if (cursorRef.current)
      cursorRef.current.style.opacity = '1';
  }
  const onMouseLeave = () => {
    setIsCursorVisible(false);
    setCursorText('')
    if (cursorRef.current)
      cursorRef.current.style.opacity = '0';
  }

  const onMouseEnterShowcase = () => {
    setCursorText('Open')
    setIsCursorVisible(true);
    if (cursorRef.current)
      cursorRef.current.style.opacity = '1';
  }

  const openNewTabToLink = (link: string | undefined) => {
    if (link)
      window.open(link, '_blank');
  };


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
        // console.log("🚀 ~ handleScroll ~ scrollPosition:", scrollPosition);
        vinylRef.current.style.left = scrollPosition > 0 ? "-10%" : "17%";
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 10 + 'px';
        cursorRef.current.style.top = e.clientY + 10 + 'px';
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    }

  }, [])


  const scrollable1Ref = useRef<any>(null);
  const scrollable2Ref = useRef<any>(null);
  const scrollable3Ref = useRef<any>(null);
  const aboutSectionRef = useRef<HTMLDivElement>(null);
  const scrollPosRef = useRef(0);
  const CYCLE_HEIGHT = 3000; // Virtual height for one full loop

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // If we are scrolling up and at the top, let the page handle it
      if (scrollPosRef.current <= 0 && e.deltaY < 0) {
        scrollPosRef.current = 0;
        return;
      }

      // Otherwise, capture the scroll
      e.preventDefault();
      scrollPosRef.current += e.deltaY;

      if (scrollPosRef.current < 0) {
        scrollPosRef.current = 0;
      }

      // Keep scrollPos within one cycle range for easy exit
      if (scrollPosRef.current >= CYCLE_HEIGHT) {
        scrollPosRef.current %= CYCLE_HEIGHT;
      }

      const progress = (scrollPosRef.current % CYCLE_HEIGHT) / CYCLE_HEIGHT;

      scrollable1Ref.current?.setScrollProgress(progress);
      scrollable2Ref.current?.setScrollProgress(progress);
      scrollable3Ref.current?.setScrollProgress(progress);
    };

    const aboutSection = aboutSectionRef.current;
    if (aboutSection) {
      aboutSection.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (aboutSection) {
        aboutSection.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  return (
    <>
      {/* home section */}
      {isFromMobile && <p ref={alertRef} className="mobile-alert">Please view in desktop for enhanced experience!</p>}
      <div className="home-layout"  >
        <div className="hero-section">
          <div className="details">
            <div className="name">
              <h1>kiransbaliga</h1>
              <div className="socials">
                @kiransbaliga
                <span className="plusicon">+</span>
              </div>
              <div className="menu-socials">
                <ul>
                  <li>
                    <a href="mailto:kiransbaliga@gmail.com" target="_blank" rel="noopener noreferrer" aria-label="Send email to Kiran S Baliga">
                      Email
                    </a>
                  </li>
                  <li>
                    <a href="https://baliga.dev/resume" target="_blank" rel="noopener noreferrer" aria-label="View Kiran S Baliga's resume">Resume</a>
                  </li>
                  <li>
                    <a href="https://blog.baliga.dev" target="_blank" rel="noopener noreferrer" aria-label="Read Kiran S Baliga's Blog">Blog</a>
                  </li>
                  <li>
                    <a href="https://github.com/kiransbaliga" target="_blank" rel="noopener noreferrer" aria-label="Kiran S Baliga on GitHub">
                      {" "}
                      github
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://instagram.com/kiransbaliga"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Kiran S Baliga on Instagram"
                    >
                      {" "}
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a href="https://linkedin.com/in/kiransbaliga" target="_blank" rel="noopener noreferrer" aria-label="Kiran S Baliga on LinkedIn">linkedin</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="designation">
              <span>Full Stack Developer</span>
              <span className="place">Kakkanad, Kochi</span>
            </div>
          </div>

        </div>
        {!isFromMobile && <div className="divider-text">
          RADIO KILLED THE VIDEO STAR. RADIO KILLED THE VIDEO STAR RADIO KILLED
          THE VIDEO STAR. RADIO KILLED THE VIDEO STAR RADIO KILLED THE VIDEO
          STAR. RADIO KILLED THE VIDEO STAR RADIO KILLED THE VIDEO STAR. RADIO
          KILLED THE VIDEO STAR
        </div>}
        <div className="experience">
          <Experience isFromMobile={isFromMobile} />
        </div>
      </div>
      <div ref={aboutSectionRef} className="about-section">
        <Scrollable ref={scrollable1Ref} heading="About">
          <div className="myself">
            <Gallery onMouseEnter={onMouseEnterGallery} onMouseLeave={onMouseLeave} links={about.me} />
          </div>
          {about.description.map((item, index) => (
            <div className="about-content" key={index}>{item}
            </div>
          ))}
          <div className="events">
            <Gallery onMouseEnter={onMouseEnterGallery} onMouseLeave={onMouseLeave} links={about.pics} />
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
            <Gallery onMouseEnter={onMouseEnterGallery} onMouseLeave={onMouseLeave} links={about.images} />
          </div>

        </Scrollable>
        <Scrollable ref={scrollable2Ref} heading="Work">
          {work.map((item, index) => (
            <div className="showcase" data-aos="fade" key={index} >
              <div className="showcase-media" onMouseEnter={onMouseEnterShowcase} onMouseLeave={onMouseLeave} onClick={() => openNewTabToLink(item?.link)}>
                {item.type === "image" ? (
                  <img src={item.media} alt={item.description ? item.description.slice(0, 80) : "Work showcase"} />
                ) : (
                  <video src={item.media} autoPlay muted aria-label="Work showcase video"></video>
                )}
              </div>
              <div className="showcase-description">{item.description}</div>
            </div>
          ))}
        </Scrollable>

        <Scrollable ref={scrollable3Ref} heading="Projects">
          {projects.map((item, index) => (
            <div className="showcase" data-aos="fade" key={index} >
              <div className="showcase-media" onMouseEnter={onMouseEnterShowcase} onMouseLeave={onMouseLeave} onClick={() => openNewTabToLink(item?.link)}>
                {item.type === "image" ? (
                  <img src={item.media} alt={item.description ? item.description.slice(0, 80) : "Project showcase"} />
                ) : (
                  <video src={item.media} autoPlay muted aria-label="Project showcase video"></video>
                )}
              </div>
              <div className="showcase-description">{item.description}</div>
            </div>
          ))}
        </Scrollable>
      </div>
      <div ref={cursorRef} style={isCursorVisible ? { display: "block" } : { display: "none" }} className="cursor-gallery">{cursorText}</div>
      {!isFromMobile && <div ref={vinylRef} className="vinyl">
        <RecordPlayer />
      </div>}
    </>
  );
};
export default HomePage;
