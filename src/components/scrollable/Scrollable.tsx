import { forwardRef, useImperativeHandle, useRef } from "react";
import type { ReactNode } from "react";
import "./Scrollable.css";
import StickyNavBar from "../stickey-navbar/StickyNavBar";
import { useIsMobile } from "../../hooks/useMedia";

interface ScrollableProps {
  heading: string;
  index?: string;
  children?: ReactNode;
}

export interface ScrollableHandle {
  setScrollProgress: (progress: number) => void;
}

const Scrollable = forwardRef<ScrollableHandle, ScrollableProps>(
  ({ heading, index, children }, ref) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const set1Ref = useRef<HTMLDivElement>(null);
    const set2Ref = useRef<HTMLDivElement>(null);
    const isFromMobile = useIsMobile();

    useImperativeHandle(ref, () => ({
      setScrollProgress: (progress: number) => {
        if (scrollRef.current && set1Ref.current && set2Ref.current) {
          const singleSetHeight =
            set2Ref.current.offsetTop - set1Ref.current.offsetTop;
          const safeProgress = progress % 1;
          scrollRef.current.scrollTop = safeProgress * singleSetHeight;
        }
      },
    }));

    return (
      <section
        ref={scrollRef}
        className="scrollable"
        aria-label={heading}
      >
        <StickyNavBar heading={heading} index={index} />
        <div className="scrollable-contents">
          <div ref={set1Ref}>{children}</div>
          {!isFromMobile && <div ref={set2Ref}>{children}</div>}
        </div>
      </section>
    );
  }
);

export default Scrollable;
