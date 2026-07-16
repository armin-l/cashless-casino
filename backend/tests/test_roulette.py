import pytest
from unittest.mock import patch
from httpx import AsyncClient, ASGITransport
import sys
import os

# Add backend to python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.roulette_engine import RouletteEngine


@pytest.fixture
def engine():
    return RouletteEngine()


class TestRouletteEngineColor:
    def test_green_zero(self, engine):
        assert engine.get_color(0) == "green"

    def test_red_numbers(self, engine):
        for num in [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]:
            assert engine.get_color(num) == "red", f"Expected red for {num}"

    def test_black_numbers(self, engine):
        black = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35]
        for num in black:
            assert engine.get_color(num) == "black", f"Expected black for {num}"


class TestRouletteSpin:
    def test_spin_returns_valid_number(self):
        with patch("random.randint") as mock_rand:
            mock_rand.return_value = 17
            engine = RouletteEngine()
            result = engine.spin()
            assert isinstance(result, int)
            assert 0 <= result <= 36

    def test_spin_calls_random_int(self):
        with patch("random.randint", return_value=5) as mock_rand:
            engine = RouletteEngine()
            engine.spin()
            mock_rand.assert_called_once_with(0, 36)


class TestStraightBetPayout:
    def test_straight_win_payout(self, engine):
        payout = engine.calculate_payout("straight", 10.0, winning_number=7, bet_parameter=[7])
        assert payout == 350.0

    def test_straight_loss_payout(self, engine):
        payout = engine.calculate_payout("straight", 10.0, winning_number=5, bet_parameter=[7])
        assert payout == 0.0


class TestColorBetsPayout:
    def test_red_win(self, engine):
        payout = engine.calculate_payout("red", 10.0, winning_number=7)
        assert payout == 20.0

    def test_black_loss_on_red(self, engine):
        payout = engine.calculate_payout("black", 10.0, winning_number=7)
        assert payout == 0.0

    def test_green_zero_color_bet_loss(self, engine):
        payout = engine.calculate_payout("red", 10.0, winning_number=0)
        assert payout == 0.0


class TestOddEvenPayout:
    def test_odd_win(self, engine):
        payout = engine.calculate_payout("odd", 10.0, winning_number=7)
        assert payout == 20.0

    def test_even_loss_on_odd(self, engine):
        payout = engine.calculate_payout("even", 10.0, winning_number=7)
        assert payout == 0.0

    def test_green_zero_odd_even_loss(self, engine):
        payout = engine.calculate_payout("odd", 10.0, winning_number=0)
        assert payout == 0.0


class TestRangeBetsPayout:
    def test_1_to_18_win(self, engine):
        payout = engine.calculate_payout("low", 10.0, winning_number=12)
        assert payout == 20.0

    def test_19_to_36_loss_on_low(self, engine):
        payout = engine.calculate_payout("low", 10.0, winning_number=25)
        assert payout == 0.0

    def test_19_to_36_win(self, engine):
        payout = engine.calculate_payout("high", 10.0, winning_number=25)
        assert payout == 20.0

    def test_green_zero_range_loss(self, engine):
        payout = engine.calculate_payout("low", 10.0, winning_number=0)
        assert payout == 0.0


class TestDozenBetsPayout:
    def test_dozen_1_win(self, engine):
        payout = engine.calculate_payout("dozen", 10.0, winning_number=5, bet_parameter=1)
        assert payout == 30.0

    def test_dozen_2_win(self, engine):
        payout = engine.calculate_payout("dozen", 10.0, winning_number=18, bet_parameter=2)
        assert payout == 30.0

    def test_dozen_3_win(self, engine):
        payout = engine.calculate_payout("dozen", 10.0, winning_number=28, bet_parameter=3)
        assert payout == 30.0

    def test_dozen_loss(self, engine):
        payout = engine.calculate_payout("dozen", 10.0, winning_number=5, bet_parameter=2)
        assert payout == 0.0

    def test_dozen_green_zero_loss(self, engine):
        payout = engine.calculate_payout("dozen", 10.0, winning_number=0, bet_parameter=1)
        assert payout == 0.0


class TestColumnBetsPayout:
    def test_column_1_win(self, engine):
        # Column 1: 1, 4, 7, ..., 34 (numbers where num % 3 == 1)
        payout = engine.calculate_payout("column", 10.0, winning_number=4, bet_parameter=1)
        assert payout == 30.0

    def test_column_2_win(self, engine):
        # Column 2: 2, 5, 8, ..., 35 (numbers where num % 3 == 2)
        payout = engine.calculate_payout("column", 10.0, winning_number=5, bet_parameter=2)
        assert payout == 30.0

    def test_column_3_win(self, engine):
        # Column 3: 3, 6, 9, ..., 36 (numbers where num % 3 == 0 and num > 0)
        payout = engine.calculate_payout("column", 10.0, winning_number=6, bet_parameter=3)
        assert payout == 30.0

    def test_column_loss(self, engine):
        payout = engine.calculate_payout("column", 10.0, winning_number=4, bet_parameter=2)
        assert payout == 0.0

    def test_column_green_zero_loss(self, engine):
        payout = engine.calculate_payout("column", 10.0, winning_number=0, bet_parameter=1)
        assert payout == 0.0


class TestInsufficientBalance:
    @pytest.mark.asyncio
    async def test_insufficient_balance_returns_400(self):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            response = await ac.post("/games/roulette/spin", params={
                "bet_type": "straight",
                "bet_number": 7,
                "bet_amount": 999999.0,
                "user_id": "user123"
            })

        assert response.status_code == 400


from main import app


class TestRouletteEndpoint:
    @pytest.mark.asyncio
    async def test_spin_endpoint_straight_win(self):
        with patch("src.roulette_engine.random.randint", return_value=7):
            async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
                response = await ac.post("/games/roulette/spin", params={
                    "bet_type": "straight",
                    "bet_number": 7,
                    "bet_amount": 10.0,
                    "user_id": "user123"
                })

        assert response.status_code == 200
        data = response.json()
        assert data["result"] in ("win", "loss")
        assert isinstance(data["payout"], float)
        assert data["winning_number"] == 7
        assert data["color"] in ("red", "black", "green")
        assert isinstance(data["balance"], float)

    @pytest.mark.asyncio
    async def test_spin_endpoint_red_win(self):
        with patch("src.roulette_engine.random.randint", return_value=7):
            async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
                response = await ac.post("/games/roulette/spin", params={
                    "bet_type": "red",
                    "bet_amount": 10.0,
                    "user_id": "user123"
                })

        assert response.status_code == 200
        data = response.json()
        assert data["result"] == "win"
        assert data["payout"] == 20.0

    @pytest.mark.asyncio
    async def test_spin_endpoint_loss(self):
        with patch("src.roulette_engine.random.randint", return_value=7):
            async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
                response = await ac.post("/games/roulette/spin", params={
                    "bet_type": "black",
                    "bet_amount": 10.0,
                    "user_id": "user123"
                })

        assert response.status_code == 200
        data = response.json()
        assert data["result"] == "loss"
        assert data["payout"] == 0.0

    @pytest.mark.asyncio
    async def test_spin_endpoint_dozen_win(self):
        with patch("src.roulette_engine.random.randint", return_value=5):
            async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
                response = await ac.post("/games/roulette/spin", params={
                    "bet_type": "dozen",
                    "bet_parameter": 1,
                    "bet_amount": 10.0,
                    "user_id": "user123"
                })

        assert response.status_code == 200
        data = response.json()
        assert data["result"] == "win"
        assert data["payout"] == 30.0

    @pytest.mark.asyncio
    async def test_spin_endpoint_column_win(self):
        with patch("src.roulette_engine.random.randint", return_value=4):
            async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
                response = await ac.post("/games/roulette/spin", params={
                    "bet_type": "column",
                    "bet_parameter": 1,
                    "bet_amount": 10.0,
                    "user_id": "user123"
                })

        assert response.status_code == 200
        data = response.json()
        assert data["result"] == "win"
        assert data["payout"] == 30.0

    @pytest.mark.asyncio
    async def test_spin_endpoint_odd_win(self):
        with patch("src.roulette_engine.random.randint", return_value=7):
            async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
                response = await ac.post("/games/roulette/spin", params={
                    "bet_type": "odd",
                    "bet_amount": 10.0,
                    "user_id": "user123"
                })

        assert response.status_code == 200
        data = response.json()
        assert data["result"] == "win"
        assert data["payout"] == 20.0

    @pytest.mark.asyncio
    async def test_spin_endpoint_even_loss_on_odd(self):
        with patch("src.roulette_engine.random.randint", return_value=7):
            async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
                response = await ac.post("/games/roulette/spin", params={
                    "bet_type": "even",
                    "bet_amount": 10.0,
                    "user_id": "user123"
                })

        assert response.status_code == 200
        data = response.json()
        assert data["result"] == "loss"
        assert data["payout"] == 0.0

    @pytest.mark.asyncio
    async def test_spin_endpoint_high_win(self):
        with patch("src.roulette_engine.random.randint", return_value=25):
            async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
                response = await ac.post("/games/roulette/spin", params={
                    "bet_type": "high",
                    "bet_amount": 10.0,
                    "user_id": "user123"
                })

        assert response.status_code == 200
        data = response.json()
        assert data["result"] == "win"
        assert data["payout"] == 20.0

    @pytest.mark.asyncio
    async def test_spin_endpoint_low_loss_on_high(self):
        with patch("src.roulette_engine.random.randint", return_value=25):
            async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
                response = await ac.post("/games/roulette/spin", params={
                    "bet_type": "low",
                    "bet_amount": 10.0,
                    "user_id": "user123"
                })

        assert response.status_code == 200
        data = response.json()
        assert data["result"] == "loss"
        assert data["payout"] == 0.0
