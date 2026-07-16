from typing import Dict, List, Optional, Any
from datetime import datetime, timezone
from dataclasses import dataclass
from collections import defaultdict


@dataclass
class PlayerStats:
    user_id: str
    total_winnings: float = 0.0
    session_start: Optional[datetime] = None
    games_played: int = 0
    last_game: Optional[str] = None

    def get_session_length_seconds(self) -> float:
        """Calculate current session length in seconds"""
        if self.session_start is None:
            return 0.0
        now = datetime.now(timezone.utc)
        delta = now - self.session_start
        return delta.total_seconds()


class LeaderboardEngine:
    """Tracks player statistics and generates leaderboards"""

    def __init__(self):
        self.player_stats: Dict[str, PlayerStats] = {}
        self.biggest_wins: Dict[str, float] = {}  # user_id -> max single net win
        self.recent_wins_by_user: Dict[str, List[tuple]] = defaultdict(list)
        self.session_winnings: Dict[str, float] = defaultdict(float)

    def _ensure_player(self, user_id: str):
        """Create PlayerStats if not exists"""
        if user_id not in self.player_stats:
            self.player_stats[user_id] = PlayerStats(
                user_id=user_id, session_start=datetime.now(timezone.utc)
            )

    def record_game_result(
        self,
        user_id: str,
        game_type: str,
        bet_amount: float,
        payout: float,  # net payout (positive = win, negative = loss)
        session_duration_seconds: float = 0.0,
    ) -> dict:
        """Record a game result and update all tracking metrics."""
        self._ensure_player(user_id)

        stats = self.player_stats[user_id]
        stats.games_played += 1
        stats.total_winnings += payout
        stats.last_game = game_type

        # Track biggest single net win (only positive payouts count as "wins")
        if payout > self.biggest_wins.get(user_id, 0.0):
            self.biggest_wins[user_id] = payout

        # Track session winnings for current active session
        if stats.session_start is not None:
            self.session_winnings[user_id] += max(payout, 0.0)

        # Track recent wins (24h window) with timestamps
        now = datetime.now(timezone.utc)
        self.recent_wins_by_user[user_id].append((now, payout))

        return {
            "user_id": user_id,
            "game_type": game_type,
            "payout": payout,
        }

    def get_leaderboard(self, leaderboard_type: str, limit: int = 10) -> List[dict]:
        """Get a ranked leaderboard by the given type."""
        raw_entries: list[dict] = []
        for uid, s in self.player_stats.items():
            entry: dict[str, Any] = {
                "user_id": uid,
                "games_played": s.games_played,
                "total_winnings": s.total_winnings,
                "biggest_win": self.biggest_wins.get(uid, 0.0),
            }

            if leaderboard_type == "session_wins":
                entry["session_wins"] = self.session_winnings.get(uid, 0.0)

            raw_entries.append(entry)

        # Sort descending and assign rank
        if not raw_entries:
            return []

        sort_key_map = {
            "total_winnings": lambda e: e["total_winnings"],
            "session_wins": lambda e: e.get("session_wins", 0.0),
            "games_played": lambda e: e["games_played"],
            "biggest_win": lambda e: e.get("biggest_win", 0.0),
        }

        sort_key = sort_key_map.get(leaderboard_type, lambda e: 0)
        raw_entries.sort(key=sort_key, reverse=True)
        result = raw_entries[:limit]

        for i, entry in enumerate(result):
            entry["rank"] = i + 1

        return result

    def get_user_stats(self, user_id: str) -> dict:
        """Get current stats for a specific user."""
        if user_id not in self.player_stats:
            self._ensure_player(user_id)

        stats = self.player_stats[user_id]
        recent_total = sum(p for _, p in self.recent_wins_by_user.get(user_id, []))

        return {
            "user_id": user_id,
            "total_winnings": stats.total_winnings,
            "games_played": stats.games_played,
            "last_game": stats.last_game or "none",
            "session_length_seconds": stats.get_session_length_seconds(),
            "biggest_win": self.biggest_wins.get(user_id, 0.0),
            "recent_winnings_24h": recent_total,
        }


# Module-level singleton for use in FastAPI endpoints
engine = LeaderboardEngine()
