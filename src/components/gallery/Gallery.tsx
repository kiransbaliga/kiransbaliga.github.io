import { useState } from "react";
import "./Gallery.css";

interface GalleryProps {
  links: string[];
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const Gallery = ({ links, onMouseEnter, onMouseLeave }: GalleryProps) => {
  const [selected, setSelected] = useState(0);
  const next = () => setSelected((prev) => (prev + 1) % links.length);

  return (
    <button
      type="button"
      className="gallery"
      onClick={next}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label={`Photo ${selected + 1} of ${links.length} — tap for next`}
    >
      <img
        src={links[selected]}
        alt="Kiran S Baliga"
        loading="lazy"
        decoding="async"
        style={{ aspectRatio: 1 }}
      />
    </button>
  );
};

export default Gallery;
