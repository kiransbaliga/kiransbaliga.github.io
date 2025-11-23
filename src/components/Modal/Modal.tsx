import "./Modal.css";
import { data } from "../../constants/data";
import ReactMarkdown from "react-markdown";

interface ModalProps {
  dataId: number;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const Modal = ({ dataId, isOpen = true, setIsOpen }: ModalProps) => {
  const item = data[dataId] ?? data[2];
  return (
    <div className={`modal-entire ${isOpen ? "open" : "hide"}`}>
      <a
        href="#"
        className={`close ${isOpen ? "open" : "hide"}`}
        onClick={() => setIsOpen(false)}
      >
        Close
      </a>
      <div className={`modal ${isOpen ? "open" : "hide"}`}>
        <div className="modal-content">
          {item.type === "video" && (
            <video className="modal-media" controls autoPlay>
              <source src={item.media} type="video/mp4" />
              Your browser does not support the video tag.
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
            <h2>{item.title}</h2>
            <div className="modal-job">
              <p>{item.position}</p>
              <p>{item.year}</p>
            </div>
            <ReactMarkdown>{item.description}</ReactMarkdown>
            <span>#{item.tags.join(", #")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
