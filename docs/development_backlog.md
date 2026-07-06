# Detailed Development Backlog: Cashless Casino

This document contains a granular breakdown of all development tasks, organized into Epics and highly specific Subtasks. Each task is designed to be a single, atomic unit of work (a "micro-task").

---

## Epic 1: Foundation & Core Infrastructure
*Objective: Establish the architectural backbone and the fundamental user/money identity.*

### 1.1 Project Scaffolding & DevOps
- [ ] **Task 1.1.1**: Initialize Backend repository with Python (FastAPI) or Node.js environment.
- [ ] **Task 1.1.2**: Setup `docker-compose` for Local Development (Database, Redis, API).
- [ ] **Task 1.1.3**: Implement a standardized Logger in the backend to track all transactions and game events.
- [ ] **Task 1.1.4**: Set up a CI/CD pipeline (GitHub Actions) to run linting and unit tests on every push.
- [ ] **Task 1.1.5**: Define API documentation structure using Swagger/OpenAPI.

### 1.2 Internal Identity & Auth Service
- [ ] **Task 1.2.1**: Create `User` database schema (ID, username, hashed_password, email).
- [ ] **Task 1.2.2**: Implement `POST /auth/register` endpoint with password hashing (Argon2/BCrypt).
- [ ] *Task 1.2.3**: Implement `POST /auth/login` returning a JWT (JSON Web Token).
- [ ] **Task 1.2.4**: Create `GET /auth/me` protected middleware to validate user sessions.
- [ ] **Task 1.2.5**: Implement User Profile endpoint: `GET /users/{id}` showing username and avatar.

### 1.3 The Virtual Currency (VC) Ledger Engine
- [ ] **Task 1.3.1**: Create `Wallet` database schema linked to `User` (user_id, balance, last_updated).
- [ ] **Task 1.3.2**: Implement the `Transaction` ledger schema (id, user_id, amount, type [win, loss, deposit, withdrawal], timestamp).
- [ ] **Task 1.3.3**: Write an atomic `update_balance(user_id, amount)` function using SQL transactions to prevent race conditions.
- [ ] **Task 1.3.4**: Implement `GET /wallet/history` endpoint to fetch the user's recent transaction ledger.

---

## Epic 2: The Mock Economy Gateway
*Objective: Simulate the "Cashless" experience of moving fake money into the system.*

### 2.1 Simulated Deposit Pipeline
- [ ] **Task 2.1.1**: Create a `DepositRequest` schema (amount, payment_method [mock_card, mock_crypto]).
- [ ] **Task 2.1.2**: Implement `POST /economy/deposit` endpoint that accepts a request and triggers an async "processing" delay.
- [ ] **Task 2.1.3**: Create a "Mock Gateway Service" that waits (e.g., 5 seconds) before calling the Ledger Engine to update the balance.
- [ ] **Task 2.1.4**: Implement Frontend: A multi-step "Checkout" UI component with loading animations and success states.

### 2.2 Simulated Withdrawal Pipeline
- [ ] **Task 2.2.1**: Create `WithdrawalRequest` schema (amount, destination_address).
- [ ] **Task 2.2.2**: Implement `POST /economy/withdraw` endpoint with a "Pending Approval" status in the database.
- [ ] **Task 2.2.3**: Develop an automated background worker to mark withdrawals as "Completed" after a simulated cooldown period.
- [ ] **Task 2.2.4**: Create Frontend: A "Payout Dashboard" showing active and historical withdrawal requests.

---

## Epic 3: The Game Engine Framework (MVP)
*Objective: Implement the core logic for game mechanics using an Abstract Base Class pattern.*

### 3.1 Core Game Logic Framework
- [ ] **Task 3.1.1**: Design `AbstractGame` class in backend containing methods: `handle_bet()`, `calculate_outcome()`, and `apply_payout()`.
- [ ] **Task 3.1.2**: Implement a centralized `RNGService` (Pseudo-Random Number Generator) using cryptographically secure random seeds.
- [ ] **Task 3.1.3**: Create a WebSocket Hub for broadcasting "Global Win" events to all connected clients.

### 3.2 Wheel of Fortune (The First Game)
- [ ] **Task 3.2.1 (Backend)**: Define `WheelSegments` array (e.g., multipliers like x0.5, x2, or "Lose All").
- [ ] **Task 3.2.2 (Backend)**: Implement `POST /games/wheel/spin` which picks a segment and updates the user balance.
- [ ] **Task 3.2.3 (Frontend)**: Develop an SVG-based spinning wheel component with CSS transitions for deceleration.
- [ ] **Task 3.2.4 (Frontend)**: Integrate WebSocket listener to trigger "Win" overlays on client side when a spin completes.

### 3.3 Slot Machine Implementation
- [ ] **Task 3.3.1 (Backend)**: Define `SlotSymbols` set and a `PaylineMap` (mapping symbol combinations to rewards).
- [ ] **Task 3.3.2 (Backend)**: Implement `POST /games/slots/spin` logic for 3-reel randomized selection.
 
### 3.4 UI Component Library (Game Assets)
- [ ] **Task 3.4.1**: Build a `<BettingControls />` component (Input field for amount, "Spin" button).
- [ ] **Task 3.4.2**: Build an `<OutcomeAnnouncer />` modal/component for big win celebrations.
