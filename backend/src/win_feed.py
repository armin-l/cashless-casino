import asyncio
from typing import Dict, List
from datetime import datetime, timezone
from dataclasses import dataclass, field
import uuid


@dataclass
class WinEvent:
    event_id: str
    user_id: str
    game_type: str  # "slots", "roulette", "blackjack"
    win_amount: float
    payout_multiplier: float
    timestamp: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

    def to_dict(self) -> dict:
        return {
            "event_id": self.event_id,
            "user_id": self.user_id,
            "game_type": self.game_type,
            "win_amount": self.win_amount,
            "payout_multiplier": self.payout_multiplier,
            "timestamp": self.timestamp.isoformat(),
        }


class GlobalWinFeed:
    """Real-time global win feed - broadcasts wins across all connected users"""

    def __init__(self):
        self.feed_buffer: List[WinEvent] = []  # recent wins for history
        self.max_feed_size: int = 100  # keep last N events
        self.subscribers: Dict[str, asyncio.Queue] = {}  # user_id -> queue of messages

    async def record_win(
        self,
        user_id: str,
        game_type: str,
        win_amount: float,
        payout_multiplier: float,
        notify_others: bool = True,
    ) -> WinEvent:
        """Record a win event and broadcast to other connected users"""
        event = WinEvent(
            event_id=str(uuid.uuid4()),
            user_id=user_id,
            game_type=game_type,
            win_amount=win_amount,
            payout_multiplier=payout_multiplier,
        )

        # Add to buffer with max size enforcement
        self.feed_buffer.append(event)
        if len(self.feed_buffer) > self.max_feed_size:
            del self.feed_buffer[:len(self.feed_buffer) - self.max_feed_size]

        # Broadcast to other subscribers (not the recording user)
        if notify_others:
            msg = event.to_dict()
            for sub_user_id, queue in self.subscribers.items():
                if sub_user_id != user_id:
                    try:
                        queue.put_nowait(msg)
                    except asyncio.QueueFull:
                        pass

        return event

    async def subscribe(self, user_id: str) -> asyncio.Queue:
        """Subscribe a user to receive real-time win feed updates"""
        queue = asyncio.Queue(maxsize=50)
        self.subscribers[user_id] = queue
        return queue

    async def unsubscribe(self, user_id: str):
        """Unsubscribe from win feed"""
        if user_id in self.subscribers:
            del self.subscribers[user_id]

    async def get_recent_wins(self, limit: int = 20) -> List[dict]:
        """Get the most recent win events for history/leaderboard display"""
        recent = list(reversed(self.feed_buffer[-limit:])) if len(self.feed_buffer) > limit else self.feed_buffer[:]
        return [event.to_dict() for event in recent]

    async def clear_feed(self):
        """Clear the entire feed (for testing/reset)"""
        self.feed_buffer.clear()


# Helper to determine if a win is "notable" (should be broadcast globally)
def is_notable_win(win_amount: float, bet_amount: float) -> bool:
    """Returns True for wins >= 5x the original bet or minimum threshold of $10"""
    return win_amount >= bet_amount * 5 or win_amount >= 10.0
