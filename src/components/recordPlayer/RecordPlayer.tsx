import { useEffect, useRef, useState } from "react";
import Record from "../../assets/record.png";
import RecordText from "../../assets/record-text.png";
import "./RecordPlayer.css";
import { usePrefersReducedMotion } from "../../hooks/useMedia";

const SLOW = 8; // deg/sec — idle spin
const FAST = 44; // deg/sec — while playing

const RecordPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const wrapperRef = useRef<HTMLImageElement>(null);
  const playingRef = useRef(false);
  const reducedMotion = usePrefersReducedMotion();

  const toggle = () => setIsPlaying((p) => !p);

  useEffect(() => {
    playingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Smoothly ease the angular velocity between SLOW and FAST instead of
  // swapping animation-duration (which makes the spin jump).
  useEffect(() => {
    if (reducedMotion) return;
    let raf = 0;
    let last = performance.now();
    let angle = 0;
    let speed = SLOW;
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const target = playingRef.current ? FAST : SLOW;
      // exponential ease toward target (~0.5s time constant)
      speed += (target - speed) * Math.min(dt * 2, 1);
      angle = (angle + speed * dt) % 360;
      if (wrapperRef.current) {
        wrapperRef.current.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isPlaying}
      aria-label={isPlaying ? "Pause music" : "Play music"}
      className="RecordPlayer"
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      }}
    >
      <img
        ref={wrapperRef}
        className="wrapper-text"
        src={RecordText}
        alt=""
        aria-hidden="true"
      />
      <img className="RecordImage" src={Record} alt="Vinyl record" />
      <audio
        ref={audioRef}
        preload="none"
        src="https://github.com/kiransbaliga/kiransbaliga/raw/main/video-killed-the-radio-start.mp3"
      />
    </div>
  );
};

export default RecordPlayer;
