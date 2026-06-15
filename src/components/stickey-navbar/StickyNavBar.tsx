import "./StickyNavBar.css";

interface StickyNavBarProps {
  heading: string;
  index?: string;
}

const StickyNavBar = ({ heading, index }: StickyNavBarProps) => {
  return (
    <h2 className="sticky-heading">
      {index && <span className="sticky-index">{index}</span>}
      <span className="sticky-label">{heading}</span>
    </h2>
  );
};

export default StickyNavBar;
