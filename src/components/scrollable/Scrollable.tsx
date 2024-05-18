import React, { useEffect } from "react";
import "./Scrollable.css";
import StickyNavBar from "../stickey-navbar/StickyNavBar";
interface ScrollableProps {
  heading: string;
    children?: React.ReactNode;
}
const Scrollable = ({ heading, children }: ScrollableProps) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleScrollForScrollable  = () => {
        console.log("scrolling");
        const {scrollTop, scrollHeight, clientHeight} = scrollRef.current!;
        console.log("here ", scrollTop, scrollHeight, clientHeight)
        if(scrollTop + clientHeight >= scrollHeight){
          console.log('Reached end of scrollable');
          contentRef.current!.appendChild(contentRef.current!.firstElementChild!.cloneNode(true));
        }
      };
      scrollRef.current?.addEventListener('scroll', handleScrollForScrollable);
      return () => {
        scrollRef.current?.removeEventListener('scroll', handleScrollForScrollable);
      };
    }, []);

  return (
    <div ref={scrollRef} className="scrollable">
      <StickyNavBar heading={heading}></StickyNavBar>
          <div ref={contentRef} className="scrollable-contents">{children}</div>
    </div>
  );
};

export default Scrollable;
