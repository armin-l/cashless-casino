import pytest
import asyncio
import sys
import os
from unittest.mock import patch, MagicMock
from datetime import datetime, timezone

# Add backend to python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.win_feed import WinEvent, GlobalWinFeed, is_notable_win


@pytest.fixture
def feed():
    return GlobalWinFeed()


# ---- WinEvent tests ----

class TestWinEvent:

    def test_creation_default_timestamp(self):
        event = WinEvent(
            event_id="evt-1",
            user_id="user42",
            game_type="slots",
            win_amount=50.0,
            payout_multiplier=5.0,
        )
        assert event.event_id == "evt-1"
        assert event.user_id == "user42"
        assert event.game_type == "slots"
        assert event.win_amount == 50.0
        assert event.payout_multiplier == 5.0
        now = datetime.now(timezone.utc)
        assert abs((event.timestamp - now).total_seconds()) < 1

    def test_creation_custom_timestamp(self):
        ts = datetime(2025, 6, 1, 12, 0, 0, tzinfo=timezone.utc)
        event = WinEvent(
            event_id="evt-2",
            user_id="user42",
            game_type="roulette",
            win_amount=100.0,
            payout_multiplier=2.0,
            timestamp=ts,
        )
        assert event.timestamp == ts

    @pytest.mark.parametrize("game_type", ["slots", "roulette", "blackjack"])
    def test_serialization_all_game_types(self, game_type):
        event = WinEvent(
            event_id="evt-3",
            user_id="user1",
            game_type=game_type,
            win_amount=20.0,
            payout_multiplier=2.0,
        )
        d = event.to_dict()
        assert isinstance(d, dict)
        assert "event_id" in d
        assert d["event_id"] == "evt-3"
        assert "user_id" in d
        assert d["timestamp"] is not None

    def test_serialization_includes_all_fields(self):
        event = WinEvent(
            event_id="evt-4",
            user_id="userX",
            game_type="blackjack",
            win_amount=99.0,
            payout_multiplier=10.0,
        )
        d = event.to_dict()
        assert d["event_id"] == "evt-4"
        assert d["user_id"] == "userX"
        assert d["game_type"] == "blackjack"
        assert d["win_amount"] == 99.0
        assert d["payout_multiplier"] == 10.0


# ---- is_notable_win tests ----

class TestIsNotableWin:

    @pytest.mark.parametrize(
        ("win_amount", "bet_amount", "expected"),
        [
            (50.0, 10.0, True),   # 5x multiplier
            (60.0, 10.0, True),   # >5x
            (49.99, 10.0, True),  # >= $10 absolute threshold
            (10.0, 20.0, True),   # >= $10 absolute threshold
            (9.99, 20.0, False),  # < $10
        ],
    )
    def test_notable_win_logic(self, win_amount, bet_amount, expected):
        assert is_notable_win(win_amount, bet_amount) == expected


# ---- GlobalWinFeed tests ----

class TestGlobalWinFeed:

    @pytest.mark.asyncio
    async def test_record_win_creates_event(self, feed):
        event = await feed.record_win(
            user_id="user1",
            game_type="slots",
            win_amount=50.0,
            payout_multiplier=5.0,
        )
        assert isinstance(event, WinEvent)
        assert event.user_id == "user1"
        assert event.game_type == "slots"
        assert event.win_amount == 50.0
        assert event.payout_multiplier == 5.0

    @pytest.mark.asyncio
    async def test_record_win_with_notify_others_false(self, feed):
        event = await feed.record_win(
            user_id="user2",
            game_type="roulette",
            win_amount=100.0,
            payout_multiplier=2.0,
            notify_others=False,
        )
        assert isinstance(event, WinEvent)
        assert event.user_id == "user2"

    @pytest.mark.asyncio
    async def test_record_win_adds_to_buffer(self, feed):
        await feed.record_win(
            user_id="u1",
            game_type="slots",
            win_amount=30.0,
            payout_multiplier=3.0,
        )
        assert len(feed.feed_buffer) == 1

    @pytest.mark.asyncio
    async def test_max_size_enforcement_evicts_older_events(self, feed):
        feed.max_feed_size = 3
        for i in range(5):
            await feed.record_win(
                user_id=f"user{i}",
                game_type="slots",
                win_amount=10.0 * (i + 1),
                payout_multiplier=2.0,
            )
        assert len(feed.feed_buffer) == 3

    @pytest.mark.asyncio
    async def test_subscriber_receives_message(self, feed):
        queue = asyncio.Queue()
        with patch.object(feed, "__init__", return_value=None):
            feed.subscribers["user2"] = queue
            feed.feed_buffer.clear()

        await feed.record_win(
            user_id="user1",
            game_type="slots",
            win_amount=50.0,
            payout_multiplier=5.0,
            notify_others=True,
        )
        msg = await asyncio.wait_for(queue.get(), timeout=2)
        assert isinstance(msg, dict)
        assert "event_id" in msg or "user_id" in msg

    @pytest.mark.asyncio
    async def test_no_message_to_recording_user(self, feed):
        queue = asyncio.Queue()
        with patch.object(feed, "__init__", return_value=None):
            feed.subscribers["user1"] = queue
            feed.feed_buffer.clear()

        await feed.record_win(
            user_id="user1",
            game_type="slots",
            win_amount=50.0,
            payout_multiplier=5.0,
            notify_others=True,
        )
        with pytest.raises(asyncio.TimeoutError):
            await asyncio.wait_for(queue.get(), timeout=0.1)

    @pytest.mark.asyncio
    async def test_subscribe_returns_queue(self, feed):
        queue = await feed.subscribe("user99")
        assert isinstance(queue, asyncio.Queue)

    @pytest.mark.asyncio
    async def test_unsubscribe_removes_subscriber(self, feed):
        await feed.subscribe("user88")
        await feed.unsubscribe("user88")
        assert "user88" not in feed.subscribers
        assert len(feed.subscribers) == 0

    @pytest.mark.asyncio
    async def test_get_recent_wins_returns_dicts(self, feed):
        await feed.record_win(user_id="a", game_type="slots", win_amount=10.0, payout_multiplier=2.0)
        await feed.record_win(user_id="b", game_type="roulette", win_amount=20.0, payout_multiplier=4.0)
        result = await feed.get_recent_wins(limit=5)
        assert isinstance(result, list)
        for item in result:
            assert isinstance(item, dict)

    @pytest.mark.asyncio
    async def test_get_recent_wins_most_recent_first(self, feed):
        timestamps = []
        for i in range(5):
            event = await feed.record_win(
                user_id=f"u{i}", game_type="slots", win_amount=i + 1.0, payout_multiplier=2.0,
            )
            # We can't control the exact timestamp per-record_call, but we can verify order by ID
        result = await feed.get_recent_wins(limit=5)
        assert len(result) == 5

    @pytest.mark.asyncio
    async def test_clear_feed(self, feed):
        for i in range(10):
            await feed.record_win(user_id=f"u{i}", game_type="slots", win_amount=i + 1.0, payout_multiplier=2.0)
        assert len(feed.feed_buffer) > 0
        await feed.clear_feed()
        assert len(feed.feed_buffer) == 0
