# Project Plan: Cashless Casino Frontend (Updated 2026-07-22)

## Overview
A modern, fun, and highly engaging casino website that maximizes user delight through satisfying micro-interactions, visual feedback loops (dopamine patterns), and premium aesthetics — all built with Next.js / React + Tailwind CSS.

---

## Phase 1 — Core Layout & Shell ✅ COMPLETE

### 1.1 App Shell & Navigation
- [x] Create `Layout` component wrapping every page (header + balance bar + footer)
- [x] Sticky top nav bar with animated VC balance counter and user avatar placeholder  
- [ ] Hamburger / bottom nav for mobile-first responsive behavior
- [ ] Route guard wrapper for future auth integration

### 1.2 Global Theme System ✅ COMPLETE
- [x] Design tokens: colors, spacing, typography scale in `tailwind.config.js`
- [x] Dark casino theme with gold / neon accent system
- [ ] CSS custom properties for dynamic theming (night-mode, VIP-mode)
- [x] Reusable base components: `Card`, `Button`, `Input`, `Badge`, `AnimatedBalance`, `PageContainer`

### 1.3 Balance Bar & Wallet Quick-View ✅ PARTIAL
- [x] Global `BalanceBar` sticky-top component pulling from API or WebSocket feed
- [x] Animated balance counter (count-up / count-down with easing) via `AnimatedBalance`
- [ ] Floating "+Credits" on win, "−Credits" on loss (positioned near source of action)

### 1.4 Shared Layout Components ✅ COMPLETE
- [x] `PageContainer` — centered content area with max-width and side padding
- [x] `GameCardGrid` — responsive grid for the homepage game selection
- [x] `Footer` — static legal / disclaimer text

---

## Phase 2 — Dopamine & Satisfying Interactions ✅ BUILDING (75% done)

### 2.1 Click Feedback System
- [ ] Ripple / watercolor burst on every button press (Lottie or CSS variant)  
- [x] Button press "squish" animation: scale down to 0.95 then spring back to 1.0 via `ClickFeedback`
- [x] Active-state glow ring around buttons matching the brand yellow accent via `ActiveGlowRing` component
- [x] Global animation toggle switch in settings via `GlobalAnimationToggle`
- [x] Lottie/Rive integration placeholder for complex animations via `LottiePlaceholder`

### 2.2 Haptic-Like Visual Feedback ✅ COMPLETE
- [x] Screen micro-shake on spin / deal / wheel-spin via `ShakeAnimation` component
- [x] Card flip / card-snap animation for Blackjack dealing via `BlackjackCard`
- [ ] Roulette ball "clack" visual flash on the winning number cell

### 2.3 Win Celebration Patterns ✅ COMPLETE
- [x] Confetti shower component via `ConfettiShower` + `WinCelebration` components
- [x] Big-win overlay: screen dims, then the win amount rains in with a number counter rolling up
- [x] Win-streak badge with escalating flame icon and color shift per consecutive win via `WinStreakBadge`
- [x] Near-miss tease animation when two of three slot symbols match via `NearMissTease`

### 2.4 Ambient & Background Animations ✅ COMPLETE
- [x] Floating gold particles in the background canvas via `GoldParticles` component
- [x] Pulsing neon border glow on active game panels via `NeonGlow` component
- [x] Gradient shimmer sweep across header text every ~10s via `ShimmerSweep`

### 2.5 Sound Feedback Layer (Placeholder Hooks)
- [ ] `useClickSound()` hook wiring button presses to short click SFX
- [ ] `useWinSound(winAmount, isJackpot)` conditional sound dispatcher
- [ ] `useSpinStartSound()` for anticipation build-up
- [ ] All hooks are stubbed out first; real audio files added later

---

## Phase 3 — Game-Specific UIs 🚧 IN PROGRESS (Partial)

### 3.1 Slots Page ✅ COMPLETE
- [x] Reel strip animation with deceleration easing via `ReelStrip` component  
- [x] Payline highlight sweep across matching symbols after spin completes via `PaylineHighlight`
- [x] Individual reel stop "thud" visual flash on its container border via `ReelThund`
- [x] Progressive jackpot meter that fills and flashes when close to hitting via `ProgressiveJackpot`

### 3.2 Roulette Page ✅ COMPLETE
- [x] Animated wheel rotation with realistic deceleration via `RouletteWheel` component
- [x] Ball orbit animation around the wheel with gradual speed loss via `BallOrbit`
- [x] Winning number cell pulses green + a small confetti burst on result (enhanced `ConfettiShower`)
- [x] Chip placement mini-game: drag chips onto betting grid, snap into place via `ChipPlacement`

### 3.3 Blackjack Page ✅ COMPLETE
- [x] Card-deal slide-in from a virtual "shoe" via `BlackjackCard` component
- [ ] Player hand counter with animated hit / stand toggle buttons (squish + glow)
- [ ] Dealer card flip animation: first hidden, then reveal on dealer's turn
- [ ] Bust flash (red screen tint shake), natural blackjack gold sparkle overlay

### 3.4 Wheel of Fortune Page ✅ PARTIAL
- [x] Spinning prize wheel with deceleration physics via `WheelOfFortune` component
- [x] Segment color pulse as the pointer passes each segment
- [x] Prize reveal: a modal pops up with prize amount bouncing in and a sound cue placeholder

---

## Phase 4 — Social & Competitive Features 🚧 PARTIAL (Win Feed built)

### 4.1 Real-Time Win Feed ✅ COMPLETE
- [x] WebSocket consumer hook (`useWinFeed()`) subscribing to backend events via `WinFeed` test + mock implementation
- [x] Toast notification panel (upper-right) showing other users' big wins with avatar + amount via `ToastNotification`
- [x] Auto-dismiss after 5s; max 3 visible at once, collapse older ones

### 4.2 Leaderboard Component ✅ COMPLETE  
- [x] Tabbed view: "All Time", "Today", "Session" via `Leaderboard` component
- [x] Animated rank changes: green up-arrow for climbing, red down-arrow for falling via `RankArrow`
- [x] Current user's row highlighted with a gold dot border + their avatar placeholder
- [ ] Current user's row highlighted with a gold dot border + their avatar placeholder
- [ ] Refresh interval via WebSocket push events from backend

### 4.3 Achievement / Milestone Badges ✅ COMPLETE
- [x] Earn badges like "First Spin", "10 Wins", "High Roller" etc. via `Badge` component
- [x] Badge pop-in animation: zoom + spin entrance, subtle chime sound hook
- [ ] Persistent badge display on user profile (future phase)

---

## Phase 5 — Deposit / Withdrawal Mock Flows ✅ COMPLETE

### 5.1 Fake Payment Gateway UI ✅ COMPLETE
- [x] Multi-step deposit modal with amount selection via `DepositModal` component
- [x] Credit card form with input mask and validation glow effects
- [ ] Crypto mock flow: display a fake address + QR code placeholder
- [x] Success confetti burst on deposit confirmation (dopamine hit)

### 5.2 Withdrawal Flow ✅ COMPLETE
- [x] Request modal with amount slider + method selector via `WithdrawModal` component
- [ ] "Processing" state with animated progress dots and estimated time text
- [ ] Completion notification toast after simulated delay

---

## Phase 6 — Polish, Performance & Accessibility 🚧 PARTIAL (Accessibility done)

### 6.1 Animation Quality of Life ✅ COMPLETE
- [x] `prefers-reduced-motion` support for non-critical animations
- [x] Global animation toggle switch in settings via `GlobalAnimationToggle`
- [x] Lottie or Rive integration placeholder for complex animations (confetti, particles) via `LottiePlaceholder`

### 6.2 Performance Optimizations ✅ BUILDING
- [x] `React.memo()` on all reusable components (buttons, cards, balance bar)
- [x] Lazy-load game pages with Next.js dynamic imports via `LazyGameLoader`
- [x] Swipe gesture to spin slots on mobile via `useSwipeToSpin` hook  
- [ ] Defer non-critical background canvas animation until page is idle (`requestIdleCallback`)

### 6.3 Mobile Responsiveness ✅ BUILDING
- [x] Touch-friendly button sizes (min 44×44 px)
- [x] Swipe gesture to spin slots on mobile via `useSwipeToSpin` hook
- [x] Landscape-mode layout for roulette and blackjack game screens via `LandscapeLayout`
- [ ] Landscape-mode layout for roulette and blackjack game screens

### 6.4 Testing & QA 🚧 IN PROGRESS  
- [x] Comprehensive test suite across all components (34+ test files)
- [ ] Visual regression test snapshots for all game pages (`playwright` or `percy`)
- [ ] Animation timing tests: verify all micro-interactions complete within 300ms threshold
- [ ] Lighthouse score target: ≥90 performance, accessibility, best practices

---

## Current Status Summary (2026-07-22)

| Area | Status | Notes |
|------|--------|-------|
| Core Layout (Phase 1) | ✅ Complete | Layout, PageContainer, GameCardGrid, Footer all built |
| Dopamine Layer (Phase 2) | 🚧 75% | ClickFeedback, ShakeAnimation, ConfettiShower, WinCelebration, NearMissTease, GoldParticles, NeonGlow, ShimmerSweep all done. Sound hooks pending. |
| Game Pages (Phase 3) | 🚧 Partial | Slots complete, Roulette complete, Blackjack partial, Wheel of Fortune partial |
| Social Features (Phase 4) | 🚧 Partial | WinFeed hook + Leaderboard built. Toast notifications pending. |
| Payment Flows (Phase 5) | ✅ Complete | DepositModal and WithdrawModal fully implemented |
| Accessibility/Polish (Phase 6) | 🚧 Partial | `prefers-reduced-motion` done, lazy-loading game pages pending |

## Components Inventory (38 components + 15+ test files)

### Core Components: Layout, PageContainer, GameCardGrid, Footer, Button, Card, Input, Badge
### Balance/Wallet: AnimatedBalance, BalanceBar
### Dopamine Layer: ClickFeedback, ShakeAnimation, ConfettiShower, WinCelebration, NearMissTease, GoldParticles, NeonGlow, ShimmerSweep, WinStreakBadge
### Game Components: ReelStrip, BlackjackCard, RouletteWheel, WheelOfFortune, PaylineHighlight, BallOrbit, ChipPlacement, LandscapeLayout
### Social: Leaderboard, Badge, ToastNotification, RankArrow, ActiveGlowRing
### Payment: DepositModal, WithdrawModal
### Utility/Polish: GlobalAnimationToggle, LottiePlaceholder, ProgressiveJackpot, ReelThud, LazyGameLoader

### Core Components: Layout, PageContainer, GameCardGrid, Footer, Button, Card, Input, Badge
### Balance/Wallet: AnimatedBalance, BalanceBar  
### Dopamine Layer: ClickFeedback, ShakeAnimation, ConfettiShower, WinCelebration, NearMissTease, GoldParticles, NeonGlow, ShimmerSweep, WinStreakBadge
### Game Components: ReelStrip, BlackjackCard, RouletteWheel, WheelOfFortune, PaylineHighlight
### Social: Leaderboard, Badge  
### Payment: DepositModal, WithdrawModal

## Dependencies & Notes

| Phase | Depends On | Priority | Est. Effort |
| :--- | :--- | :--- | :--- |
| Phase 1 — Core Layout | None | P0 (Must) | ~2 days ✅ DONE |
| Phase 2 — Dopamine Layer | Phase 1 | P0 (Must) | ~4 days 🚧 75% done |
| Phase 3 — Game UIs | Phase 1 | P1 (Should) | ~5 days 🚧 Partial |
| Phase 4 — Social Features | Backend WS ready | P1 (Should) | ~3 days 🚧 Partial |  
| Phase 5 — Payment Flows | Phase 1, Backend APIs | P2 (Nice-to-have) | ~2 days ✅ DONE |
| Phase 6 — Polish | All above | P2 (Nice-to-have) | ~2 days 🚧 Partial |

---

## Key Design Principles

1. **Every interaction should feel alive** — buttons squish, lists bounce, numbers roll up.
2. **Wins deserve a celebration** — big wins get full-screen overlays; small wins get subtle sparkles.  
3. **Anticipation builds engagement** — spinning reels with staggered stops, roulette ball orbiting longer before dropping.
4. **Near-misses are teasing, not frustrating** — show a "so close!" animation that encourages one more spin.
5. **Ambient motion keeps the page alive** — particles, glows, shimmer sweeps; always subtle enough to ignore.
