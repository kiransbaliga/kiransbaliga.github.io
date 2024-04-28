import React from "react";
import "./Scrollable.css";
import StickyNavBar from "../stickey-navbar/StickyNavBar";
interface ScrollableProps {
  heading: string;
    children?: React.ReactNode;
}
const Scrollable = ({ heading, children }: ScrollableProps) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);

  return (
    <div ref={scrollRef} className="scrollable">
      <StickyNavBar heading={heading}></StickyNavBar>
          <div className="scrollable-contents">{children}</div>
    </div>
  );
};

export default Scrollable;
