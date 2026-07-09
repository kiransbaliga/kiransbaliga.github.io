import { useCallback, useEffect, useRef, useState } from "react";
import Experience from "../../components/Experience/Experience";
import RecordPlayer from "../../components/recordPlayer/RecordPlayer";
import Preloader from "../../components/Preloader/Preloader";
import "./HomePage.css";
import Scrollable, {
  ScrollableHandle,
} from "../../components/scrollable/Scrollable";
import { about, projects, work, Showcase } from "../../constants/data";
import Gallery from "../../components/gallery/Gallery";
import { useIsMobile, usePrefersReducedMotion } from "../../hooks/useMedia";
import { useMagnetic } from "../../hooks/useMagnetic";

const CYCLE_HEIGHT = 3000; // virtual wheel distance for one full content loop
const DIVIDER_TEXT =
  "RADIO KILLED THE VIDEO STAR. RADIO KILLED THE VIDEO STAR. ";

const ShowcaseCard = ({
  item,
  onEnter,
  onLeave,
}: {
  item: Showcase;
  onEnter: () => void;
  onLeave: () => void;
}) => (
  <article className="showcase">
    <a
      className="showcase-media"
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      aria-label={`Open: ${item.description.slice(0, 60)}`}
    >
      {item.type === "image" ? (
        <img
          src={item.media}
          alt={item.description.slice(0, 90)}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <video
          src={item.media}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          aria-label="Project preview"
        ></video>
      )}
    </a>
    <p className="showcase-description">{item.description}</p>
  </article>
);

const HomePage = () => {
  const isFromMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();

  const [showAlert, setShowAlert] = useState(true);
  const [socialsOpen, setSocialsOpen] = useState(false);
  const [aboutInView, setAboutInView] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const handleIntroDone = useCallback(() => setIntroDone(true), []);

  const socialsBtnRef = useMagnetic<HTMLButtonElement>(0.4, 70);
  const vinylRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const [cursorText, setCursorText] = useState("");

  const scrollable1Ref = useRef<ScrollableHandle>(null);
  const scrollable2Ref = useRef<ScrollableHandle>(null);
  const scrollable3Ref = useRef<ScrollableHandle>(null);
  const aboutSectionRef = useRef<HTMLElement>(null);
  const scrollPosRef = useRef(0);
  const isAboutSnappedRef = useRef(false);

  const onMouseEnterGallery = () => setCursorText("Next");
  const onMouseLeave = () => setCursorText("");
  const onMouseEnterShowcase = () => setCursorText("Open");

  // Auto-dismiss the mobile hint after 10s (proper effect with cleanup).
  useEffect(() => {
    if (!isFromMobile) return;
    const t = setTimeout(() => setShowAlert(false), 10000);
    return () => clearTimeout(t);
  }, [isFromMobile]);

  // Close the socials menu on outside-click / Escape.
  useEffect(() => {
    if (!socialsOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSocialsOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (!nameRef.current?.contains(e.target as Node)) setSocialsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [socialsOpen]);

  // Vinyl parallax — rAF-throttled, passive, bail when unchanged.
  useEffect(() => {
    let ticking = false;
    let lastLeft = "";
    const apply = () => {
      ticking = false;
      if (!vinylRef.current) return;
      const scrolled = (window.scrollY || document.documentElement.scrollTop) > 0;
      const left = scrolled ? "-24%" : "14%";
      if (left !== lastLeft) {
        vinylRef.current.style.left = left;
        lastLeft = left;
      }
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(apply);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    apply();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Custom cursor — desktop + motion-OK only, rAF-throttled via transform.
  useEffect(() => {
    if (isFromMobile || reducedMotion) return;
    let ticking = false;
    let x = 0;
    let y = 0;
    const apply = () => {
      ticking = false;
      if (cursorRef.current) {
        cursorRef.current.style.left = `${x + 14}px`;
        cursorRef.current.style.top = `${y + 14}px`;
      }
    };
    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(apply);
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [isFromMobile, reducedMotion]);

  // Cursor-reactive vinyl — subtle 3D tilt toward the pointer.
  useEffect(() => {
    if (isFromMobile || reducedMotion) return;
    const el = vinylRef.current;
    if (!el) return;
    let raf = 0;
    let rx = 0;
    let ry = 0;
    const apply = () => {
      raf = 0;
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    };
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      ry = ((e.clientX - (r.left + r.width / 2)) / window.innerWidth) * 18;
      rx = -((e.clientY - (r.top + r.height / 2)) / window.innerHeight) * 18;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isFromMobile, reducedMotion]);

  // Track whether the content section is fully snapped into view.
  useEffect(() => {
    const el = aboutSectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        const snapped = entry.intersectionRatio >= 0.95;
        if (snapped && !isAboutSnappedRef.current) {
          // Always (re)start the loop from the top, never mid-cycle.
          scrollPosRef.current = 0;
          scrollable1Ref.current?.setScrollProgress(0);
          scrollable2Ref.current?.setScrollProgress(0);
          scrollable3Ref.current?.setScrollProgress(0);
        }
        isAboutSnappedRef.current = snapped;
        setAboutInView(snapped);
      },
      { threshold: [0, 0.5, 0.95, 1] }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Wheel-driven infinite scroll — desktop only, gated on the section being snapped.
  useEffect(() => {
    if (isFromMobile) return;
    const aboutSection = aboutSectionRef.current;
    if (!aboutSection) return;

    let ticking = false;
    const pushProgress = () => {
      ticking = false;
      const progress = (scrollPosRef.current % CYCLE_HEIGHT) / CYCLE_HEIGHT;
      scrollable1Ref.current?.setScrollProgress(progress);
      scrollable2Ref.current?.setScrollProgress(progress);
      scrollable3Ref.current?.setScrollProgress(progress);
    };

    const handleWheel = (e: WheelEvent) => {
      // Until the section is fully snapped in, let native scroll-snap own the gesture.
      if (!isAboutSnappedRef.current) return;
      // At the very top scrolling up -> release to native scroll (snaps back to hero).
      if (scrollPosRef.current <= 0 && e.deltaY < 0) {
        scrollPosRef.current = 0;
        return;
      }
      e.preventDefault();
      scrollPosRef.current += e.deltaY;
      if (scrollPosRef.current < 0) scrollPosRef.current = 0;
      if (scrollPosRef.current >= CYCLE_HEIGHT)
        scrollPosRef.current %= CYCLE_HEIGHT;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(pushProgress);
      }
    };

    aboutSection.addEventListener("wheel", handleWheel, { passive: false });
    return () => aboutSection.removeEventListener("wheel", handleWheel);
  }, [isFromMobile]);

  return (
    <>
      <Preloader onDone={handleIntroDone} />
      {isFromMobile && showAlert && (
        <p className="mobile-alert">
          Please view on desktop for the full experience.
        </p>
      )}

      {/* desktop snap spacer that holds the hero's scroll space (hero itself is fixed) */}
      {!isFromMobile && (
        <div className="hero-snap" aria-hidden="true"></div>
      )}

      <header className={`home-layout ${introDone ? "revealed" : ""}`}>
        <div className="hero-section">
          <div className="details">
            <div className="name" ref={nameRef}>
              <h1 className="name-title" aria-label="kiransbaliga">
                {"kiransbaliga".split("").map((c, i) => (
                  <span
                    key={i}
                    className="char"
                    style={{ animationDelay: `${i * 0.04}s` }}
                  >
                    {c}
                  </span>
                ))}
              </h1>
              <button
                type="button"
                ref={socialsBtnRef}
                className="socials"
                aria-expanded={socialsOpen}
                aria-controls="socials-menu"
                onClick={() => setSocialsOpen((v) => !v)}
              >
                @kiransbaliga
                <span className="plusicon" aria-hidden="true">
                  +
                </span>
              </button>
              <nav
                id="socials-menu"
                className={`menu-socials ${socialsOpen ? "open" : ""}`}
                aria-label="Contact and social links"
              >
                <ul>
                  <li>
                    <a
                      href="mailto:kiransbaliga@gmail.com"
                      aria-label="Send email to Kiran S Baliga"
                    >
                      Email
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://baliga.dev/resume"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="View Kiran S Baliga's resume"
                    >
                      Resume
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://blog.baliga.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Read Kiran S Baliga's blog"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/kiransbaliga"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Kiran S Baliga on GitHub"
                    >
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
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://linkedin.com/in/kiransbaliga"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Kiran S Baliga on LinkedIn"
                    >
                      linkedin
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
            <p className="designation">
              <span>Full Stack Developer</span>
              <span className="place">Bangalore, India</span>
            </p>
          </div>
          {!isFromMobile && (
            <span className="scroll-hint" data-hidden={aboutInView}>
              scroll <span aria-hidden="true">↓</span>
            </span>
          )}
        </div>
        {!isFromMobile && (
          <div className="divider-text" aria-hidden="true">
            <span className="divider-track">
              {DIVIDER_TEXT.repeat(6)}
              {DIVIDER_TEXT.repeat(6)}
            </span>
          </div>
        )}
        <div className="experience">
          <Experience isFromMobile={isFromMobile} />
        </div>
      </header>

      <main ref={aboutSectionRef} className="about-section">
        <Scrollable ref={scrollable1Ref} heading="About" index="01">
          <div className="myself">
            <Gallery
              onMouseEnter={onMouseEnterGallery}
              onMouseLeave={onMouseLeave}
              links={about.me}
            />
          </div>
          {about.description.map((item, index) => (
            <p className="about-content" key={index}>
              {item}
            </p>
          ))}
          <div className="events">
            <Gallery
              onMouseEnter={onMouseEnterGallery}
              onMouseLeave={onMouseLeave}
              links={about.pics}
            />
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
            <Gallery
              onMouseEnter={onMouseEnterGallery}
              onMouseLeave={onMouseLeave}
              links={about.images}
            />
          </div>
        </Scrollable>

        <Scrollable ref={scrollable2Ref} heading="Work" index="02">
          {work.map((item, index) => (
            <ShowcaseCard
              key={index}
              item={item}
              onEnter={onMouseEnterShowcase}
              onLeave={onMouseLeave}
            />
          ))}
        </Scrollable>

        <Scrollable ref={scrollable3Ref} heading="Projects" index="03">
          {projects.map((item, index) => (
            <ShowcaseCard
              key={index}
              item={item}
              onEnter={onMouseEnterShowcase}
              onLeave={onMouseLeave}
            />
          ))}
        </Scrollable>
      </main>

      {!isFromMobile && !reducedMotion && (
        <div
          ref={cursorRef}
          aria-hidden="true"
          className="cursor-gallery"
          data-visible={cursorText !== ""}
        >
          {cursorText}
        </div>
      )}
      {!isFromMobile && (
        <div ref={vinylRef} className="vinyl">
          <RecordPlayer />
        </div>
      )}
    </>
  );
};
export default HomePage;
