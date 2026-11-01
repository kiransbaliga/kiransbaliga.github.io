# AI Coding Agent Instructions

Concise, project-specific guidance for this repo (React + TypeScript + Vite portfolio deployed to GitHub Pages). Keep responses focused, reflect existing patterns, and avoid inventing unverified architecture.

## Tech + Build Workflow
- Stack: React 18 + TypeScript (strict) + Vite. CSS (plain) with some custom animations; `sass` is installed but not yet used in code.
- Entry: `src/main.tsx` mounts `<App/>` inside `<BrowserRouter>`.
- Routing: Only one route currently (`""` -> `HomePage`). Extend by adding `<Route path="/new" element={<Component/>} />` inside `App.tsx`.
- Scripts (`package.json`):
  - `npm run dev` – start Vite dev server (HMR).
  - `npm run build` – `tsc` type check then Vite build (outputs `dist`).
  - `npm run deploy` – builds then publishes `dist` via `gh-pages` (see `base` config note below).
- Vite config: `vite.config.ts` sets `base: '/<repo>/'` (placeholder). For GitHub Pages custom domain / username site, adjust to repo name or `/` as needed before deploying.

## Data + Content Model
- All dynamic display content is hard‑coded in `src/constants/data.ts` exporting: `data` (experience timeline), `about`, `work`, `projects`.
- Media: External GitHub raw URLs and a game image from itch.io. When adding new media prefer lightweight, optimized (webp/png) links. Keep consistent shape (fields: `media`, `type: 'image'|'video'`, optional `link`, `description`).
- Modal uses the `data` array index; ensure indices stable if reordering (or refactor to use an `id` field if frequent mutations are planned).

## Component Patterns
- Co-located component folders: each under `src/components/<name>/` with `.tsx` + `.css` (plain CSS; no CSS Modules). Maintain this convention.
- State handled locally with React hooks; no global state manager. Introduce context only if >2 sibling trees require the same state.
- Components are simple, synchronous, no suspense/async boundaries.
- Scroll / cursor side-effects use `useEffect` with manual DOM style mutations (e.g., `RecordPlayer`, `HomePage`, `Scrollable`). If extending, prefer refs + style changes (to match style) or move to CSS animations when possible.

## Notable Components
- `Scrollable`: Wraps vertical content section with heading (via `StickyNavBar`). Appends a clone of the first child when scrolled to bottom (creates infinite scroll effect). If adding expensive children, guard against unbounded DOM growth.
- `Experience`: Opens `Modal` with rich details from `data`. Mobile optimization: excludes a specific `index==4` item; preserve this conditional or refactor to a data-driven `isMobileHidden` flag.
- `RecordPlayer`: Spins outer text image when audio plays. Animation speed toggled by modifying `style.animation`. Keep animation names consistent with `RecordPlayer.css` if adjusting timings.
- `Gallery`: Cycles through provided image links on each click; maintains `selected` index modulo array length. Extend for preload or fade effects without breaking current click-to-cycle behavior.

## Styling Conventions
- Global styles in `src/index.css` and `App.css`; per-component styles imported directly in component files.
- Class names are kebab-case. Avoid introducing conflicting global selectors. Prefer scoping by parent class where possible.
- Inline styles used sparingly for dynamic positioning (custom cursor, vinyl position). Continue that pattern for highly dynamic values.

## Animation / Interaction
- Uses `aos` (Animate On Scroll) initialized once in `HomePage` with `duration: 2000`. Any element with `data-aos="fade"` (see showcase items) will animate. If adding new animation types ensure AOS CSS (imported by library) supports them; configure in same `useEffect` block or extract to a dedicated hook if complexity grows.
- Custom cursor text overlay controlled via `cursorRef`; visibility toggled on mouse enter/leave of gallery/showcase media.

## Accessibility / UX Notes
- Some interactive divs lack semantic roles (`RecordPlayer`, showcase items). If modifying, either keep pattern for visual parity or improve by adding `role` and keyboard handlers—be consistent across similar elements.
- Auto-playing muted videos (`video` tags in showcases). Maintain `muted` to avoid unexpected audio; for new videos consider `playsInline loop` for smoother UX.

## Deployment Considerations
- Ensure `vite.config.ts` `base` matches GitHub Pages path BEFORE running `deploy`. Example: user/`kiransbaliga.github.io` root site should typically use `base: '/'`; a project page would use `'/project-repo/'`.
- `gh-pages` publishes from `dist`; no CI config present. Manual deploy via script.

## TypeScript Practices
- Strict mode enabled. Avoid `any`; leverage inferred types. For prop interfaces, place near component (current pattern) and export only if reused.
- DOM refs typed explicitly (e.g., `useRef<HTMLDivElement>(null)`). Follow this; do not cast with `as` unless unavoidable.

## Extending Routes / Pages
1. Create folder under `src/pages/NewPage/` with `NewPage.tsx` + optional CSS.
2. Import and add `<Route path="/new" element={<NewPage/>} />` in `App.tsx`.
3. Link via `<a href="/new">` (full reload) or preferably `<Link to="/new">` after importing from `react-router-dom` (not yet used—introduce consistently if starting navigation revamp).

## Performance Watchpoints
- Infinite cloning in `Scrollable` can grow DOM indefinitely. If adding large sections, add a cap (e.g., track cloned count and stop or remove oldest nodes).
- Multiple listeners added in `HomePage` (scroll, mousemove). If adding more, consolidate or debounce if jank appears.
- Large images from GitHub raw URLs load unoptimized. Consider adding local optimized assets if build size/perf becomes a concern.

## Safe Change Checklist (before PR / deploy)
- `npm run build` passes (type check + bundle).
- No console noise (remove stray `console.log`—e.g., `Scrollable` currently logs; remove if production hardening is desired).
- Verify `base` path after changes affecting routing/assets.
- Manually test mobile (logic branches on `window.innerWidth < 768`).

## Adding New Structured Content Example
```ts
// In data.ts
projects.push({
  media: 'https://raw.githubusercontent.com/.../new.png',
  type: 'image',
  link: 'https://example.com',
  description: 'Short description in same narrative style.',
});
```
No additional wiring required—`HomePage` maps `projects` automatically.

## When Unsure
- Prefer inspecting existing similar component folder and mirror structure.
- Ask clarifying question only if behavior cannot be inferred from existing patterns.

(End of instructions – provide feedback if any section needs elaboration.)
