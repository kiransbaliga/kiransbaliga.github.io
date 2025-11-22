import React, { forwardRef, useImperativeHandle, useRef } from "react";
import "./Scrollable.css";
import StickyNavBar from "../stickey-navbar/StickyNavBar";

interface ScrollableProps {
  heading: string;
  children?: React.ReactNode;
}

export interface ScrollableHandle {
  setScrollProgress: (progress: number) => void;
}

const Scrollable = forwardRef<ScrollableHandle, ScrollableProps>(
  ({ heading, children }, ref) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const set1Ref = useRef<HTMLDivElement>(null);
    const set2Ref = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      setScrollProgress: (progress: number) => {
        if (scrollRef.current && set1Ref.current && set2Ref.current) {
          const set1Top = set1Ref.current.offsetTop;
          const set2Top = set2Ref.current.offsetTop;
          const singleSetHeight = set2Top - set1Top;

          // progress is 0 to 1, representing one full cycle of the content
          // We use modulo 1 to ensure it stays within bounds if passed > 1
          const safeProgress = progress % 1;
          const targetScrollTop = safeProgress * singleSetHeight;

          scrollRef.current.scrollTop = targetScrollTop;
        } else {
          console.warn("Scrollable refs missing", heading);
        }
      },
    }));

    return (
      <div ref={scrollRef} className="scrollable">
        <StickyNavBar heading={heading}></StickyNavBar>
        <div className="scrollable-contents">
          <div ref={set1Ref}>{children}</div>
          <div ref={set2Ref}>{children}</div>
        </div>
      </div>
    );
  }
);

export default Scrollable;
