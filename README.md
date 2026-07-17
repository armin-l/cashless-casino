# Cashless Casino 🎰

A full-stack web-based casino simulation featuring multiple games, real-time notifications, and premium UI themes — all using **fake virtual currency (VC)**. No real money involved.

## Architecture

```
cashless-casino/
├── backend/                    # Python FastAPI server
│   ├── main.py                 # API entrypoint (FastAPI)
│   ├── src/
│   │   ├── database.py         # InMemoryDatabase (user balances)
│   │   ├── logger_utils.py     # CasinoLogger singleton
│   │   ├── roulette_engine.py  # European roulette game logic
│   │   ├── blackjack_engine.py # Blackjack game logic (6-deck shoe)
│   │   ├── effects_engine.py   # Spin animation / sound effect engine
│   │   ├── websocket_manager.py  # WebSocket connection manager
│   │   ├── win_feed.py         # Global real-time win feed
│   │   └── leaderboard_engine.py  # Player stats & leaderboards
│   ├── tests/                  # All backend tests (14 pytest packages)
│   └── requirements.txt        # fastapi, uvicorn, websockets, pydantic...
├── frontend/                   # React/Next.js + Tailwind CSS
│   ├── src/lib/api.ts          # API client for all backend endpoints
│   ├── src/lib/websocket.ts    # WSManager with auto-reconnect
│   └── tests/                  # Vitest test suite (api, websocket, components)
├── docker-compose.yml           # Api + Postgres + Redis services
```

## Games Available

| Game | Endpoints | Description |
|------|-----------|-------------|
| **Slots** | `POST /games/slots/spin` | 3-reel classic with symbol matching (10x payout) |
| **Roulette** | `POST /games/roulette/spin` | European single-zero wheel. Supports straight, red/black, odd/even, dozens, columns, range bets |
| **Blackjack** | `POST /games/blackjack/deal`, `/hit`, `/stand`, `/double_down` | 6-deck shoe, dealer hits soft 17, blackjack pays 3:2 |

## API Endpoints

### Health & Auth
- `GET /` — Service health check
- `GET /auth/me` — Current user placeholder

### Wallet & Economy
- `GET /wallet/balance?user_id=` — User balance
- `POST /economy/deposit?amount=&method=` — Fake deposit mock flow

### Games
- `POST /games/slots/spin?bet_amount=&user_id=`
- `POST /games/roulette/spin?bet_type=&bet_amount=&user_id=&bet_number=`
- `POST /games/blackjack/deal?bet_amount=&user_id=`
- `POST /games/blackjack/hit?hand_id=`
- `POST /games/blackjack/stand?hand_id=`
- `POST /games/blackjack/double_down?hand_id=`

### Leaderboards & Win Feed
- `GET /leaderboard/{type}?limit=10` — `total_winnings`, `session_wins`, `games_played`, `biggest_win`
- `GET /user/stats?user_id=` — Per-user stats
- `POST /economy/record_game` — Record bet/payout to leaderboard
- `GET /user/leaderboard?user_id=` — User's rank across all leaderboards

### Animations & Sound Effects
- `GET /animation/spin?game_type=slots|roulette&reel_count=&spin_duration_ms=`
- `POST /sounds/queue?user_id=&sound_type=`

### WebSocket
- `WS /ws/{user_id}` — Real-time win feed push to all connected users

## How to Run

### Backend (FastAPI)

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Or with uv:
uv pip install -r requirements.txt

# Run the dev server on port 8000
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Then open `http://localhost:8000/docs` for interactive API docs, or `http://localhost:8000/redoc` for the redoc version.

### Frontend (Next.js)

```bash
cd frontend

# Install dependencies
npm install    # or: yarn / pnpm / bun install

# Run dev server on port 3000
npm run dev
```

Open `http://localhost:3000` in your browser. The frontend connects to the backend at `http://localhost:8000` by default (override via `NEXT_PUBLIC_API_BASE`).

### Docker Compose

Start everything with a single command:

```bash
docker-compose up --build
```

This brings up:
- **API** on port 8000
- **PostgreSQL** on port 5432
- **Redis** on port 6379

## Testing

### Backend (Python)

```bash
cd backend

# Run all tests
uv run pytest -v

# Run linting
uv run ruff check .
```

147 tests covering: slots, roulette, blackjack, effects engine, win feed, and leaderboards. All tests pass ✅

### Frontend (TypeScript/React)

```bash
cd frontend
npm test    # Runs vitest
```

## Virtual Currency (VC)

All money is simulated virtual currency. The deposit flow is a mock "credit card" payment that instantly credits VC to your account. Withdrawals simulate processing delays for UX realism. There are **no real financial transactions**.
