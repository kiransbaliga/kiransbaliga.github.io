import { useEffect, useRef, useState } from "react";
import "./Preloader.css";

const shouldSkipIntro = () =>
  typeof window === "undefined" ||
  sessionStorage.getItem("introSeen") === "1" ||
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type Phase = "loading" | "exit" | "done";

const Preloader = ({ onDone }: { onDone: () => void }) => {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<Phase>(() =>
    shouldSkipIntro() ? "done" : "loading"
  );
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (shouldSkipIntro()) {
      onDoneRef.current();
      return;
    }

    const DURATION = 1100;
    const start = performance.now();
    let raf = 0;
    let exitTimer = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        sessionStorage.setItem("introSeen", "1");
        setPhase("exit");
        exitTimer = window.setTimeout(() => {
          setPhase("done");
          onDoneRef.current();
        }, 750);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(exitTimer);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div className={`preloader ${phase === "exit" ? "exit" : ""}`} aria-hidden="true">
      <div className="preloader-inner">
        <span className="preloader-name">
          {"kiransbaliga".split("").map((c, i) => (
            <span
              key={i}
              className="preloader-char"
              style={{ animationDelay: `${i * 0.045}s` }}
            >
              {c}
            </span>
          ))}
        </span>
      </div>
      <span className="preloader-count">{String(count).padStart(3, "0")}</span>
      <div
        className="preloader-bar"
        style={{ transform: `scaleX(${count / 100})` }}
      />
    </div>
  );
};

export default Preloader;
