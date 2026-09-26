/**
 * Scroll Snap Configuration
 * ------------------------------------------------------------------
 * You can edit any of these variables to customize and experiment
 * with the feel, speed, and responsiveness of the home page snapping.
 */

export interface ScrollSnapConfig {
  /**
   * Whether smooth scroll snapping is enabled.
   * Set to false to disable all snapping and allow free native scrolling.
   */
  enabled: boolean;

  /**
   * GSAP Easing type for the snap animation.
   * Options you can experiment with:
   *  - "power2.inOut" (smooth ease-in, gentle deceleration)
   *  - "power1.inOut" (subtle, very soft ease-in and ease-out)
   *  - "sine.inOut"   (organic sine wave easing, very relaxed)
   *  - "power3.out"   (instant start, long cinematic coast)
   *  - "power2.out"   (smooth standard deceleration)
   *  - "expo.out"     (high initial speed with dramatic soft landing)
   */
  ease: string;

  /**
   * Duration of the snap animation in seconds.
   * Examples:
   *  - 0.8  (faster, snappier)
   *  - 1.1  (medium, graceful)
   *  - 1.4  (very slow, cinematic glide)
   */
  duration: number;

  /**
   * Progress threshold (from 0.05 to 0.5) to advance to the next target.
   * For example, 0.20 means:
   *  - When scrolling down: if you scroll past 20% of the distance to the next card,
   *    it will ease into the next card. Otherwise, it returns to the current card.
   *  - When scrolling up: if you scroll past 20% back toward the previous card,
   *    it will ease into the previous card.
   * A lower number (e.g. 0.15) makes it easier to jump to the next card.
   * A higher number (e.g. 0.35) requires more scrolling effort to advance.
   */
  threshold: number;

  /**
   * Delay in milliseconds to wait after the user stops scrolling before the snap animation begins.
   * Allows touch / trackpad momentum to settle naturally.
   * Examples:
   *  - 100 (triggers almost immediately after scroll stops)
   *  - 160 (waits slightly longer for inertia to finish)
   */
  debounceMs: number;

  /**
   * Vertical offset in pixels from the top of the viewport when snapping to work cards.
   * Default is 124 (aligns card header just under the sticky section title).
   */
  cardOffsetTop: number;

  /**
   * Whether to disable scroll snapping on mobile / phones (touch screens or small viewports).
   * Set to true (recommended) so mobile users get natural, uninterrupted touch scrolling.
   */
  disableOnMobile: boolean;

  /**
   * Minimum viewport width in pixels required for scroll snapping to activate.
   * Viewports below this width will use standard native scrolling. Default: 768.
   */
  minWidth: number;
}

export const scrollSnapConfig: ScrollSnapConfig = {
  enabled: true,
  ease: "sine.inOut",       // Experiment: "power2.inOut", "sine.inOut", "power1.inOut", "power3.out"
  duration: 1.25,           // Duration in seconds (increase for slower, decrease for faster)
  threshold: 0.18,          // 18% scroll progress triggers the next snap target
  debounceMs: 140,          // Wait 140ms after scroll settles before gliding
  cardOffsetTop: 124,       // 124px header offset for work cards
  disableOnMobile: true,    // Disabled on mobile/phone screens for natural touch scrolling
  minWidth: 768,            // Only snap on viewports 768px or wider
};

export default scrollSnapConfig;
