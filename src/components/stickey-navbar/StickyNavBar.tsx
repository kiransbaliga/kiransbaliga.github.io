import "./StickyNavBar.css";

interface StickyNavBarProps {
  heading: string;
}

const StickyNavBar = ({ heading }: StickyNavBarProps) => {
 

  

  return <div className="sticky-heading">{heading}</div>;
};

export default StickyNavBar;
