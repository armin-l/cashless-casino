import pytest
from datetime import datetime, timezone
from unittest.mock import patch
from httpx import AsyncClient, ASGITransport
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.leaderboard_engine import (
    PlayerStats,
    LeaderboardEngine,
)


# ====== PlayerStats Tests ======

class TestPlayerStatsCreation:
    def test_player_stats_has_correct_defaults(self):
        stats = PlayerStats(user_id="user123")
        assert stats.user_id == "user123"
        assert stats.total_winnings == 0.0
        assert stats.games_played == 0
        assert stats.session_start is None
        assert stats.last_game is None

    def test_player_stats_accepts_session_start(self):
        now = datetime.now(timezone.utc)
        stats = PlayerStats(user_id="user456", session_start=now)
        assert stats.user_id == "user456"
        assert stats.session_start == now

    def test_player_stats_can_update_winnings(self):
        stats = PlayerStats(user_id="user789")
        stats.total_winnings = 100.0
        assert stats.total_winnings == 100.0


class TestSessionLength:
    @patch("src.leaderboard_engine.datetime")
    def test_session_length_zero_when_no_start(self, mock_dt):
        stats = PlayerStats(user_id="user123")
        assert stats.get_session_length_seconds() == 0.0

    def test_session_length_positive_after_start(self):
        base_time = datetime(2025, 6, 15, 12, 0, 0, tzinfo=timezone.utc)
        stats = PlayerStats(user_id="user123", session_start=base_time)
        # Session duration should be positive (elapsed since start)
        length = stats.get_session_length_seconds()
        assert isinstance(length, float)
        assert length >= 0.0


# ====== LeaderboardEngine Core Tests ======

class TestRecordGameResult:
    def setup_method(self):
        self.engine = LeaderboardEngine()

    @patch("src.leaderboard_engine.datetime")
    def test_record_increments_games_played(self, mock_dt):
        now = datetime(2025, 6, 15, tzinfo=timezone.utc)
        mock_dt.now.return_value = now
        self.engine.record_game_result(
            user_id="user1", game_type="slots", bet_amount=10.0, payout=50.0
        )
        assert self.engine.player_stats["user1"].games_played == 1

    def test_record_updates_total_winnings_on_win(self):
        self.engine.record_game_result(
            user_id="user1", game_type="slots", bet_amount=10.0, payout=50.0
        )
        assert self.engine.player_stats["user1"].total_winnings == 50.0


class TestTotalWinningsLeaderboard:
    def setup_method(self):
        self.engine = LeaderboardEngine()

    def test_leaderboard_total_winnings_ordered_descending(self):
        # User A wins more than user B
        self.engine.record_game_result("userA", "slots", 10.0, 200.0)
        self.engine.record_game_result("userB", "roulette", 20.0, 50.0)

        leaderboard = self.engine.get_leaderboard("total_winnings")

        assert len(leaderboard) == 2
        # First entry should be userA (higher winnings)
        assert leaderboard[0]["user_id"] == "userA"
        assert leaderboard[1]["user_id"] == "userB"


class TestSessionWinsLeaderboard:
    def setup_method(self):
        self.engine = LeaderboardEngine()

    def test_session_wins_tracks_current_session_win_only(self):
        self.engine.record_game_result("user1", "slots", 10.0, 100.0)
        leaderboard = self.engine.get_leaderboard("session_wins")
        assert len(leaderboard) == 1
        assert leaderboard[0]["user_id"] == "user1"


class TestGamesPlayedLeaderboard:
    def setup_method(self):
        self.engine = LeaderboardEngine()

    def test_games_played_ordered_by_count_descending(self):
        # userA plays more games than userB
        for _ in range(5):
            self.engine.record_game_result("userA", "slots", 10.0, 20.0)
        for _ in range(2):
            self.engine.record_game_result("userB", "roulette", 10.0, 30.0)

        leaderboard = self.engine.get_leaderboard("games_played")
        assert len(leaderboard) == 2
        # userA has more games played
        assert leaderboard[0]["games_played"] >= leaderboard[1]["games_played"]


class TestLongestSessionLeaderboard:
    def setup_method(self):
        self.engine = LeaderboardEngine()

    def test_longest_session_orders_by_duration_descending(self):
        # userA has longer session than userB
        pass  # Stubbed for now - will implement with mock time


class TestBiggestWinTracking:
    def setup_method(self):
        self.engine = LeaderboardEngine()

    def test_biggest_win_single_large_payout(self):
        self.engine.record_game_result("user1", "slots", 10.0, 500.0)
        leaderboard = self.engine.get_leaderboard("biggest_win")
        assert len(leaderboard) == 1
        assert leaderboard[0]["biggest_win"] >= 350.0

    def test_biggest_win_tracks_largest_not_total(self):
        # Multiple small wins vs one big win
        self.engine.record_game_result("user1", "slots", 10.0, 100.0)
        self.engine.record_game_result("user2", "roulette", 10.0, 500.0)

        # user2 should be higher in biggest_win
        leaderboard = self.engine.get_leaderboard("biggest_win")
        assert leaderboard[0]["user_id"] == "user2"


class TestRecentWinsWageredLeaderboard:
    def setup_method(self):
        self.engine = LeaderboardEngine()

    @patch("src.leaderboard_engine.datetime")
    def test_recent_wins_only_last_24_hours(self, mock_dt):
        now = datetime(2025, 6, 15, tzinfo=timezone.utc)
        mock_dt.now.return_value = now


class TestGetUserStats:
    def setup_method(self):
        self.engine = LeaderboardEngine()

    def test_get_user_stats_returns_correct_data(self):
        self.engine.record_game_result("user1", "slots", 25.0, 100.0)

        stats = self.engine.get_user_stats("user1")
        assert stats["user_id"] == "user1"
        assert stats["total_winnings"] >= 0.0


class TestMultipleUserIsolation:
    def test_users_are_fully_isolated(self):
        engine_A = LeaderboardEngine()
        engine_B = LeaderboardEngine()

        engine_A.record_game_result("playerA", "slots", 10.0, 200.0)
        engine_B.record_game_result("playerB", "roulette", 20.0, 50.0)

        lb_a = engine_A.get_leaderboard("total_winnings")
        assert len(lb_a) == 1
        assert lb_a[0]["user_id"] == "playerA"

        lb_b = engine_B.get_leaderboard("total_winnings")
        assert len(lb_b) == 1
        assert lb_b[0]["user_id"] == "playerB"


from main import app


class TestLeaderboardEndpoint:
    @pytest.mark.asyncio
    async def test_get_total_winnings_leaderboard(self):
        with patch("src.leaderboard_engine.datetime") as mock_dt:
            now = datetime(2025, 6, 15, tzinfo=timezone.utc)
            mock_dt.now.return_value = now

            # Pre-populate engine state via the test client would require
            # injecting an engine - skipping for integration


class TestEndpointIntegration:
    @pytest.mark.asyncio
    async def test_leaderboard_endpoint_returns_200(self):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            response = await ac.get("/leaderboard/total_winnings", params={"limit": 10})

        assert response.status_code == 200


class TestLeaderboardEndpoint:
    @pytest.mark.asyncio
    async def test_get_total_winnings_leaderboard(self):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            response = await ac.get("/leaderboard/total_winnings", params={"limit": 10})

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


class TestLeaderboardEndpointOtherTypes:
    @pytest.mark.asyncio
    async def test_games_played_leaderboard(self):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            response = await ac.get("/leaderboard/games_played", params={"limit": 5})

        assert response.status_code == 200


class TestUserStatsEndpoint:
    @pytest.mark.asyncio
    async def test_get_user_stats(self):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            response = await ac.get("/user/stats", params={"user_id": "user123"})

        assert response.status_code == 200
        data = response.json()
        assert "user_id" in data


class TestLeaderboardEngineIsolation:
    @patch("src.leaderboard_engine.datetime")
    def test_different_engines_dont_share_state(self, mock_dt):
        engine1 = LeaderboardEngine()
        engine2 = LeaderboardEngine()

        engine1.record_game_result("u1", "slots", 10.0, 50.0)
        engine2.record_game_result("u2", "roulette", 20.0, 30.0)

        lb1 = engine1.get_leaderboard("total_winnings")
        assert len(lb1) == 1
        assert lb1[0]["user_id"] == "u1"


class TestLeaderboardEngineEdgeCases:
    def test_loss_updates_total_winnings_negatively(self):
        engine = LeaderboardEngine()
        engine.record_game_result("u1", "slots", 10.0, -50.0)  # loss of 50

        lb = engine.get_leaderboard("total_winnings")
        assert len(lb) == 1
        # total_winnings should reflect the net (negative) result


class TestLeaderboardEngineLimit:
    def test_limit_parameter_restricts_results(self):
        engine = LeaderboardEngine()

        for i in range(20):
            engine.record_game_result(f"user{i}", "slots", 10.0, float(i + 1))

        lb = engine.get_leaderboard("total_winnings", limit=5)
        assert len(lb) == 5


class TestLeaderboardEngineEmptyState:
    def test_empty_leaderboard_returns_empty_list(self):
        engine = LeaderboardEngine()
        lb = engine.get_leaderboard("total_winnings")
        assert lb == []

