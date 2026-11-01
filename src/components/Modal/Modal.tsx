import { useEffect, useRef } from "react";
import "./Modal.css";
import { data } from "../../constants/data";
import ReactMarkdown from "react-markdown";

interface ModalProps {
  dataId: number;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const Modal = ({ dataId, isOpen, setIsOpen }: ModalProps) => {
  const item = data[dataId];
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<Element | null>(null);

  // Escape to close + restore focus + lock background scroll while open.
  useEffect(() => {
    if (!isOpen) return;
    lastFocused.current = document.activeElement;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      (lastFocused.current as HTMLElement | null)?.focus?.();
    };
  }, [isOpen, setIsOpen]);

  return (
    <div
      className={`modal ${isOpen ? "open" : "hide"}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-hidden={!isOpen}
      onClick={(e) => {
        // Only the backdrop (this element itself) closes — not clicks inside the panel.
        if (e.target === e.currentTarget) setIsOpen(false);
      }}
    >
      <button
        type="button"
        ref={closeRef}
        className="close"
        onClick={() => setIsOpen(false)}
        aria-label="Close"
      >
        Close ✕
      </button>
      {item && (
        <div className="modal-content">
          {item.type === "video" && (
            <video className="modal-media" controls autoPlay>
              <source src={item.media} type="video/mp4" />
            </video>
          )}
          {item.type === "image" && (
            <img className="modal-media" src={item.media} alt={item.title} />
          )}
          {item.type === "youtube" && (
            <iframe
              className="modal-media"
              src={item.media}
              title={item.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}

          <div className="modal-details">
            <h2 id="modal-title">{item.title}</h2>
            <div className="modal-job">
              <p>{item.position}</p>
              <p>{item.year}</p>
            </div>
            <ReactMarkdown>{item.description}</ReactMarkdown>
            <span className="modal-tags">#{item.tags.join(", #")}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
