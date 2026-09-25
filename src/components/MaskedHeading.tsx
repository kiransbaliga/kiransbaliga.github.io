import React, { useCallback, useEffect, useId, useMemo, useRef, CSSProperties } from 'react';
import { gsap } from 'gsap';

import './MaskedHeading.css';

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

export interface MaskedHeadingProps {
  text?: string;
  tag?: any;
  mediaType?: 'image' | 'video';
  src?: string;
  poster?: string;
  fillScale?: number;
  parallax?: number;
  drift?: number;
  brightness?: number;
  saturation?: number;
  grayscale?: boolean;
  reveal?: 'rise' | 'wipe' | 'fade' | 'none';
  duration?: number;
  stagger?: number;
  trigger?: 'view' | 'mount' | 'hover';
  align?: 'left' | 'center' | 'right';
  weight?: number | string;
  tracking?: number;
  lineHeight?: number;
  textScale?: number;
  fontSize?: number | string;
  outline?: boolean;
  outlineColor?: string;
  outlineWidth?: number;
  className?: string;
  style?: CSSProperties;
  [key: string]: any;
}

const MaskedHeading: React.FC<MaskedHeadingProps> = ({
  text = 'Designed in the details',
  tag = 'h2',
  mediaType = 'image',
  src = '',
  poster = '',
  fillScale = 1.25,
  parallax = 26,
  drift = 18,
  brightness = 1,
  saturation = 1,
  grayscale = false,
  reveal = 'rise',
  duration = 1.1,
  stagger = 0.09,
  trigger = 'view',
  align = 'center',
  weight = 700,
  tracking = -0.03,
  lineHeight = 1.06,
  textScale = 0.115,
  fontSize,
  outline = false,
  outlineColor = '#151514',
  outlineWidth = 1.5,
  className = '',
  style,
  ...rest
}) => {
  const rootRef = useRef<HTMLElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const revealRef = useRef<HTMLSpanElement>(null);
  const mediaRef = useRef<HTMLSpanElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const baseRefs = useRef<(HTMLElement | null)[]>([]);
  const glyphRefs = useRef<(SVGTextElement | null)[]>([]);
  const outlineGlyphRefs = useRef<(SVGTextElement | null)[]>([]);
  const tweenRef = useRef<any>(null);
  const offsetRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  const clipId = `mh-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const words = useMemo(() => String(text).split(/\s+/).filter(Boolean), [text]);

  const settingsRef = useRef<any>({});
  settingsRef.current = { fillScale, parallax, drift, brightness, saturation, grayscale, textScale, fontSize };

  const place = useCallback(() => {
    const root = rootRef.current;
    const media = mediaRef.current;
    if (!root || !media) return;
    const s = settingsRef.current;
    const W = root.clientWidth;
    const H = root.clientHeight;
    const off = offsetRef.current;

    const maxX = Math.max(0, ((s.fillScale - 1) / 2) * W);
    const maxY = Math.max(0, ((s.fillScale - 1) / 2) * H);

    media.style.transform = `translate3d(${clamp(off.x, -maxX, maxX).toFixed(2)}px, ${clamp(off.y, -maxY, maxY).toFixed(2)}px, 0) scale(${s.fillScale})`;
    media.style.filter = `brightness(${s.brightness}) saturate(${s.saturation})${s.grayscale ? ' grayscale(1)' : ''}`;
  }, []);

  const sync = useCallback(() => {
    const root = rootRef.current;
    const measure = measureRef.current;
    if (!root || !measure) return;
    const s = settingsRef.current;

    if (s.fontSize) {
      root.style.fontSize = typeof s.fontSize === 'number' ? `${s.fontSize}px` : s.fontSize;
    } else if (s.textScale > 0) {
      root.style.fontSize = `${clamp(root.clientWidth * s.textScale, 20, 200).toFixed(1)}px`;
    }

    const cs = window.getComputedStyle(measure);
    const probe = document.createElement('canvas').getContext('2d');
    for (let i = 0; i < wordRefs.current.length; i += 1) {
      const box = wordRefs.current[i];
      const base = baseRefs.current[i];
      const glyph = glyphRefs.current[i];
      if (!box || !base || !glyph) continue;

      let baselineY = box.offsetTop + box.offsetHeight / 2;
      let dominantBaseline = 'central';

      if (probe) {
        probe.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        if ('letterSpacing' in probe) (probe as any).letterSpacing = cs.letterSpacing;
        const text = box.innerText.trim();
        const m = probe.measureText(text);
        const inkHeight = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
        if (inkHeight > 0) {
          baselineY = box.offsetTop + (box.offsetHeight - inkHeight) / 2 + m.actualBoundingBoxAscent;
          dominantBaseline = 'alphabetic';
        }
      }

      glyph.setAttribute('x', `${box.offsetLeft}`);
      glyph.setAttribute('y', `${baselineY}`);
      glyph.setAttribute('dominant-baseline', dominantBaseline);
      glyph.style.fontFamily = cs.fontFamily;
      glyph.style.fontSize = cs.fontSize;
      glyph.style.fontWeight = cs.fontWeight;
      glyph.style.fontStyle = cs.fontStyle;
      glyph.style.letterSpacing = cs.letterSpacing;

      const outlineGlyph = outlineGlyphRefs.current[i];
      if (outlineGlyph) {
        outlineGlyph.setAttribute('x', `${box.offsetLeft}`);
        outlineGlyph.setAttribute('y', `${baselineY}`);
        outlineGlyph.setAttribute('dominant-baseline', dominantBaseline);
        outlineGlyph.style.fontFamily = cs.fontFamily;
        outlineGlyph.style.fontSize = cs.fontSize;
        outlineGlyph.style.fontWeight = cs.fontWeight;
        outlineGlyph.style.fontStyle = cs.fontStyle;
        outlineGlyph.style.letterSpacing = cs.letterSpacing;
      }
    }
    place();
  }, [place]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(root);
    if ((document as any).fonts?.ready) (document as any).fonts.ready.then(sync).catch(() => {});

    let raf = 0;
    let last = performance.now();
    let clock = 0;

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      clock += dt;
      const s = settingsRef.current;
      const off = offsetRef.current;

      const dx = Math.sin(clock * 0.21) * s.drift;
      const dy = Math.cos(clock * 0.17) * s.drift * 0.6;

      const ease = 1 - Math.exp(-dt / 0.18);
      off.x += (off.tx + dx - off.x) * ease;
      off.y += (off.ty + dy - off.y) * ease;

      place();
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent | MouseEvent) => {
      const s = settingsRef.current;
      if (s.parallax <= 0) return;
      const r = root.getBoundingClientRect();
      if (r.bottom < -100 || r.top > window.innerHeight + 100) return;

      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const nx = (e.clientX - cx) / Math.max(r.width, 180);
      const ny = (e.clientY - cy) / Math.max(r.height * 2, 120);

      offsetRef.current.tx = clamp(nx, -1, 1) * -s.parallax;
      offsetRef.current.ty = clamp(ny, -1, 1) * -s.parallax;
    };

    const onLeave = () => {
      offsetRef.current.tx = 0;
      offsetRef.current.ty = 0;
    };

    const s = settingsRef.current;
    if (s.parallax > 0 || s.drift > 0) {
      window.addEventListener('pointermove', onMove as any, { passive: true });
      document.addEventListener('mouseleave', onLeave);
      raf = requestAnimationFrame(frame);
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onMove as any);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [place, sync]);

  useEffect(() => {
    sync();
  }, [sync, words, tag, align, weight, tracking, lineHeight, textScale]);

  useEffect(() => {
    const root = rootRef.current;
    const layer = revealRef.current;
    if (!root || !layer) return;
    const glyphs = glyphRefs.current.filter(Boolean);
    if (!glyphs.length) return;

    const riseDistance = () => (parseFloat(window.getComputedStyle(root).fontSize) || 48) * 1.15;

    const settle = () => {
      gsap.set(glyphs, { y: 0 });
      gsap.set(layer, { opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)' });
    };

    const rest = () => {
      if (reveal === 'rise') {
        gsap.set(glyphs, { y: riseDistance() });
      } else if (reveal === 'wipe') {
        gsap.set(layer, { clipPath: 'inset(0% 100% 0% 0%)' });
      } else if (reveal === 'fade') {
        gsap.set(layer, { opacity: 0, scale: 1.08 });
      }
    };

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reveal === 'none' || reduce) {
      settle();
      return;
    }

    const play = () => {
      tweenRef.current?.kill();
      if (reveal === 'rise') {
        gsap.set(layer, { opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)' });
        tweenRef.current = gsap.fromTo(
          glyphs,
          { y: riseDistance() },
          { y: 0, duration, stagger, ease: 'power4.out', overwrite: 'auto' }
        );
      } else if (reveal === 'wipe') {
        gsap.set(glyphs, { y: 0 });
        const state = { p: 100 };
        tweenRef.current = gsap.to(state, {
          p: 0,
          duration,
          ease: 'power3.inOut',
          overwrite: 'auto',
          onUpdate: () => {
            if (layer) layer.style.clipPath = `inset(0% ${state.p}% 0% 0%)`;
          }
        });
      } else {
        gsap.set(glyphs, { y: 0 });
        tweenRef.current = gsap.fromTo(
          layer,
          { opacity: 0, scale: 1.08 },
          { opacity: 1, scale: 1, duration, ease: 'power3.out', overwrite: 'auto' }
        );
      }
    };

    if (trigger === 'hover') {
      settle();
      root.addEventListener('pointerenter', play);
      return () => {
        root.removeEventListener('pointerenter', play);
        tweenRef.current?.kill();
      };
    }

    if (trigger === 'view') {
      settle();
      rest();
      const io = new IntersectionObserver(
        entries => {
          if (entries.some(e => e.isIntersecting)) {
            play();
            io.disconnect();
          }
        },
        { threshold: 0.25 }
      );
      io.observe(root);
      return () => {
        io.disconnect();
        tweenRef.current?.kill();
      };
    }

    play();
    return () => tweenRef.current?.kill();
  }, [reveal, trigger, duration, stagger, words]);

  const Tag = tag || 'h2';

  return (
    <Tag
      ref={rootRef}
      className={`masked-heading ${className}`.trim()}
      style={{
        textAlign: align,
        fontWeight: weight,
        letterSpacing: `${tracking}em`,
        lineHeight,
        ...style
      }}
      {...rest}
    >
      <span ref={measureRef} className="masked-heading__measure">
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            ref={el => {
              wordRefs.current[i] = el;
            }}
            className="masked-heading__word"
          >
            {word}
            <i
              ref={el => {
                baseRefs.current[i] = el;
              }}
              className="masked-heading__baseline"
            />
          </span>
        ))}
      </span>

      <svg className="masked-heading__defs" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            {words.map((word, i) => (
              <text
                key={`${word}-${i}`}
                ref={el => {
                  glyphRefs.current[i] = el;
                }}
              >
                {word}
              </text>
            ))}
          </clipPath>
        </defs>
      </svg>

      <span ref={revealRef} className="masked-heading__reveal">
        <span className="masked-heading__clip" style={{ clipPath: `url(#${clipId})` }}>
          <span ref={mediaRef} className="masked-heading__media">
            {mediaType === 'video' ? (
              <video className="masked-heading__source" src={src} poster={poster} autoPlay muted loop playsInline />
            ) : (
              <img className="masked-heading__source" src={src} alt="" draggable={false} />
            )}
          </span>
        </span>
      </span>

      {outline && (
        <svg
          className="masked-heading__outline-svg"
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            overflow: 'visible',
            pointerEvents: 'none',
            zIndex: 2
          }}
        >
          {words.map((word, i) => (
            <text
              key={`outline-${word}-${i}`}
              ref={el => {
                outlineGlyphRefs.current[i] = el;
              }}
              fill="none"
              stroke={outlineColor}
              strokeWidth={outlineWidth}
            >
              {word}
            </text>
          ))}
        </svg>
      )}
    </Tag>
  );
};

export default MaskedHeading;
