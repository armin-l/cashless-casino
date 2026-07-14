# Project Plan: Cashless Casino

## Overview
"Cashless Casino" is a web-based simulation of a high-end casino experience. The goal is to provide the thrill and atmosphere of a real gambling site using exclusively **fake money**. There are no real financial transactions involved; the "payment" flow is purely for simulating the user journey of depositing and withdrawing virtual credits.

## Core Objectives
- **Immersive Experience**: High-fidelity UI/UX featuring dark themes, animations, and premium aesthetics to mimic a real casino environment.
- **Simulated Economy**: A robust system for managing "Virtual Credits" (VC).
- **Zero Risk**: No real money integration; all transactions are simulated via a mock gateway.
- **Game Variety**: Implementation of multiple classic casino games with distinct logic and UI.

## Key Components

### 1. User System & Authentication
- **Mock Authentication**: User registration and login to track balances and game history.
- **User Profiles**: Displaying user rank, total wins, and current VC balance.

### 2. Simulated Economy (The "Cashless" Flow)
- **Fake Deposits**: A multi-step flow simulating credit card or crypto deposits that instantly credits the user with virtual currency.
- **Fake Withdrawals**: A request system where "withdrawals" are processed after a simulated delay, demonstrating the UX of real-world payouts.
- **Transaction History**: A ledgers of all virtual wins, losses, and fake transactions.

### 3. The Games Library
All games will follow a standardized "Bet -> Result -> Payout/Loss" state machine.

| Game Type | Description | Implementation Focus |
| :--- | :--- | :--- |
| **Slots** | Classic 3-reel or modern 5-reel machines with varying paylines. | Random Number Generation (RNG), spinning animations, and win patterns. |
| **Roulette** | European-style single-zero wheel. | Physics-based ball animation, betting on colors/numbers/dozens. |

| **Card Games** | Blackjack or Baccarat. | Card dealing logic, dealer AI, and hand evaluation algorithms. |
| **Wheel of Fortune** | A spinning prize wheel with various multipliers and "jackpot" arcs. | Smooth deceleration physics and weighted probability segments. |

### 4. Tech Stack (Proposed)
- **Frontend**: React or Next.js for a highly reactive UI; Tailwind CSS for styling; Framer Motion for animations/smooth transitions.
- **Backend**: Node.js (Express) or Python (FastAPI) to handle game logic, RNG, and balance state.
- **Database**: PostgreSQL or MongoDB to persist user balances and transaction logs.
- **Real-time Updates**: WebSockets (Socket.io) for live game states and real-time "winning" notifications across the platform.

## Development Roadmap

### Phase 1: Foundation (The Core Engine)
- [x] Setup project repository and mono-repo structure.
- [x] Implement basic API for user authentication and balance management.
- [x] Create the simulation engine for "deposits" and "withdrawals".

### Phase 2: The Games (MVP)
- [x] Develop **Wheel of Fortune** (easiest implementation/high visual impact).
- [x] Develop **Slots** (core casino mechanic).
- [ ] Integration of basic betting logic into the user balance system.

### Phase 3: Complexity Scaling
- [ ] Implement **Roulette** and **Card Games**.
- [ ] Add advanced animations and sound effects.
- [ ] Enhance UI with "Casino Premium" themes (Neon, Gold, Dark Velvet).

### Phase 4: Polish & Social Features
- [ ] Global Win Feed (real-time notifications of other users winning).
- [ ] Leaderboards based on total winnings and session length.
- [ ] Final performance optimization and stress testing the RNG logic.
