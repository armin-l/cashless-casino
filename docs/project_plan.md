# Project Plan: Cashless Casino Frontend

## Overview
A modern, fun, and highly engaging casino website that maximizes user delight through satisfying micro-interactions, visual feedback loops (dopamine patterns), and premium aesthetics — all built with Next.js / React + Tailwind CSS.

---

## Phase 1 — Core Layout & Shell

### 1.1 App Shell & Navigation
- [x] Create `Layout` component wrapping every page (header + balance bar + footer) — **done: Layout composes BalanceBar + Footer sub-components**
- [ ] Sticky top nav bar with animated VC balance counter and user avatar placeholder
- [ ] Hamburger / bottom nav for mobile-first responsive behavior
- [ ] Route guard wrapper for future auth integration

### 1.2 Global Theme System
- [x] Design tokens: colors, spacing, typography scale in `tailwind.config.js` — **done: custom colors + keyframes defined**
- [x] Dark casino theme with gold / neon accent system — **done: bg-gradient-to-b from-gray-950 to-gray-900 pattern throughout**
- [ ] CSS custom properties for dynamic theming (night-mode, VIP-mode)
- [x] Reusable `Button` base component — **done: Button.tsx with gold gradient + active scale**

### 1.3 Balance Bar & Wallet Quick-View
- [x] Global `BalanceBar` sticky-top component pulling from API — **done: polls /wallet/balance every 5s, composable in Layout**
- [x] Animated balance counter (count-up / count-down with easing) — **done: AnimatedBalance hook uses easeOutExpo**
- [ ] Floating "+Credits" on win, "−Credits" on loss (positioned near source of action)

### 1.4 Shared Layout Components
- [x] `PageContainer` — centered content area with max-width and side padding — **done: used in HomePage**
- [x] `GameCardGrid` — responsive grid for the homepage game selection — **done: HomePage uses GameCardGrid/GAMES data**
- [x] `Footer` — static legal / disclaimer text — **done: Footer composable in Layout**

---

## Phase 2 — Dopamine & Satisfying Interactions (The Fun Layer)

### 2.1 Click Feedback System
- [x] Ripple / watercolor burst on every button press — **done: useRipple hook + ripple animation**
- [x] Button press "squish" animation: scale down to 0.95 then spring back to 1.0 — **done: active scale + spring-back keyframe, useSquish hook**
- [ ] Active-state glow ring around buttons matching the brand yellow accent

### 2.2 Haptic-Like Visual Feedback
- [ ] Screen micro-shake on spin / deal / wheel-spin (CSS keyframe `@keyframes shake`)
- [ ] Card flip / card-snap animation for Blackjack dealing
- [ ] Roulette ball "clack" visual flash on the winning number cell

### 2.3 Win Celebration Patterns
- [x] Big-win overlay with rolling number counter — **done: WinCelebration component with dimmed overlay + sparkles**
- [x] Floating "+Credits"/"−Credits" notifications — **done: WinFloat component with auto-dismiss, conditional rendering**
- [ ] Confetti shower component (library or custom canvas-based)
- [ ] Win-streak badge with escalating flame icon and color shift per consecutive win
- [ ] Near-miss tease animation when two of three slot symbols match

### 2.4 Ambient & Background Animations
- [ ] Floating gold particles in the background canvas (subtle, non-distracting)
- [ ] Pulsing neon border glow on active game panels
- [x] Gradient shimmer sweep across header text — **done: shimmer keyframe defined in tailwind config**

### 2.5 Sound Feedback Layer (Placeholder Hooks)
- [ ] `useClickSound()` hook wiring button presses to short click SFX
- [ ] `useWinSound(winAmount, isJackpot)` conditional sound dispatcher
- [ ] `useSpinStartSound()` for anticipation build-up
- [ ] All hooks are stubbed out first; real audio files added later

---

## Phase 3 — Game-Specific UIs with Rich Animations

### 3.1 Slots Page (upgrade current `pages/games/slots.tsx`)
- [ ] Reel strip animation: each reel scrolls vertically with deceleration easing
- [ ] Individual reel stop "thud" visual flash on its container border
- [ ] Payline highlight sweep across matching symbols after spin completes
- [ ] Progressive jackpot meter that fills and flashes when close to hitting

### 3.2 Roulette Page
- [ ] Animated wheel rotation with realistic deceleration (CSS `cubic-bezier` curve)
- [ ] Ball orbit animation around the wheel with gradual speed loss
- [ ] Winning number cell pulses green + a small confetti burst on result
- [ ] Chip placement mini-game: drag chips onto betting grid, snap into place

### 3.3 Blackjack Page
- [ ] Card-deal slide-in from a virtual "shoe" (card fanning out)
- [ ] Player hand counter with animated hit / stand toggle buttons (squish + glow)
- [ ] Dealer card flip animation: first hidden, then reveal on dealer's turn
- [ ] Bust flash (red screen tint shake), natural blackjack gold sparkle overlay

### 3.4 Wheel of Fortune Page
- [ ] Spinning prize wheel with deceleration physics (CSS or canvas-based)
- [ ] Segment color pulse as the pointer passes each segment
- [ ] Prize reveal: a modal pops up with prize amount bouncing in and a sound cue placeholder

---

## Phase 4 — Social & Competitive Features

### 4.1 Real-Time Win Feed
- [ ] WebSocket consumer hook (`useWinFeed()`) subscribing to backend events
- [ ] Toast notification panel (upper-right) showing other users' big wins with avatar + amount
- [ ] Auto-dismiss after 5s; max 3 visible at once, collapse older ones

### 4.2 Leaderboard Component
- [ ] Tabbed view: "All Time", "Today", "Session"
- [ ] Animated rank changes: green up-arrow for climbing, red down-arrow for falling
- [ ] Current user's row highlighted with a gold dot border + their avatar placeholder
- [ ] Refresh interval via WebSocket push events from backend

### 4.3 Achievement / Milestone Badges
- [ ] Earn badges like "First Spin", "10 Wins", "High Roller" etc.
- [ ] Badge pop-in animation: zoom + spin entrance, subtle chime sound hook
- [ ] Persistent badge display on user profile (future phase)

---

## Phase 5 — Deposit / Withdrawal Mock Flows

### 5.1 Fake Payment Gateway UI
- [ ] Multi-step deposit modal: select amount → choose method → confirm → success animation
- [ ] Credit card form with input mask and validation glow effects
- [ ] Crypto mock flow: display a fake address + QR code placeholder
- [ ] Success confetti burst on deposit confirmation (dopamine hit)

### 5.2 Withdrawal Flow
- [ ] Request modal with amount slider + method selector
- [ ] "Processing" state with animated progress dots and estimated time text
- [ ] Completion notification toast after simulated delay

---

## Phase 6 — Polish, Performance & Accessibility

### 6.1 Animation Quality of Life
- [ ] `prefers-reduced-motion` support: disable non-critical animations for accessibility
- [ ] Global animation toggle switch in settings (for users who find them overwhelming)
- [ ] Lottie or Rive integration placeholder for complex animations (confetti, particles)

### 6.2 Performance Optimizations
- [ ] `React.memo()` on all reusable components (buttons, cards, balance bar)
- [ ] Lazy-load game pages with Next.js dynamic imports (`next/dynamic`)
- [ ] Defer non-critical background canvas animation until page is idle (`requestIdleCallback`)

### 6.3 Mobile Responsiveness
- [ ] Touch-friendly button sizes (min 44×44 px)
- [ ] Swipe gesture to spin slots on mobile
- [ ] Landscape-mode layout for roulette and blackjack game screens

### 6.4 Testing & QA
- [ ] Visual regression test snapshots for all game pages (`playwright` or `percy`)
- [ ] Animation timing tests: verify all micro-interactions complete within 300ms threshold
- [ ] Lighthouse score target: ≥90 performance, accessibility, best practices

---

## Dependencies & Notes

| Phase | Depends On | Priority | Est. Effort |
| :--- | :--- | :--- | :--- |
| Phase 1 — Core Layout | None | P0 (Must) | ~2 days |
| Phase 2 — Dopamine Layer | Phase 1 | P0 (Must) | ~4 days |
| Phase 3 — Game UIs | Phase 1 | P1 (Should) | ~5 days |
| Phase 4 — Social Features | Backend WS ready | P1 (Should) | ~3 days |
| Phase 5 — Payment Flows | Phase 1, Backend APIs | P2 (Nice-to-have) | ~2 days |
| Phase 6 — Polish | All above | P2 (Nice-to-have) | ~2 days |

---

## Key Design Principles

1. **Every interaction should feel alive** — buttons squish, lists bounce, numbers roll up.
2. **Wins deserve a celebration** — big wins get full-screen overlays; small wins get subtle sparkles.
3. **Anticipation builds engagement** — spinning reels with staggered stops, roulette ball orbiting longer before dropping.
4. **Near-misses are teasing, not frustrating** — show a "so close!" animation that encourages one more spin.
5. **Ambient motion keeps the page alive** — particles, glows, shimmer sweeps; always subtle enough to ignore.
