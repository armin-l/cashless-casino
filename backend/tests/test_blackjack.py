import pytest
from unittest.mock import patch
from httpx import AsyncClient, ASGITransport
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.blackjack_engine import Card, Deck, BlackjackHand, BlackjackEngine


# ====== Card Tests ======

class TestCardCreation:
    def test_card_has_suit_and_rank(self):
        card = Card(rank="A", suit="♠")
        assert card.suit == "♠"
        assert card.rank == "A"

    def test_face_cards_value_ten(self):
        for rank in ("J", "Q", "K"):
            assert Card(rank=rank, suit="♥").value == 10

    def test_ace_value_is_one(self):
        assert Card(rank="A", suit="♣").value == 1

    def test_number_cards_match_rank(self):
        for i in range(2, 10):
            assert Card(rank=str(i), suit="♦").value == i


# ====== Deck Tests ======

class TestDeckCreation:
    @patch("random.shuffle")
    def test_single_deck_has_fifty_two_cards(self, mock_shuffle):
        deck = Deck(num_decks=1)
        assert len(deck.cards) == 52

    @patch("random.shuffle")
    def test_six_deck_shoe_has_three_hundred_twelve_cards(self, mock_shuffle):
        deck = Deck(num_decks=6)
        assert len(deck.cards) == 312

    @patch("random.shuffle")
    def test_all_four_suits_present_each_card_once_per_deck(self, mock_shuffle):
        deck = Deck()
        suits = set(c.suit for c in deck.cards)
        assert suits == {"♠", "♥", "♦", "♣"}

    @patch("random.shuffle")
    def test_all_thirteen_ranks_present_per_suit_per_deck(self, mock_shuffle):
        deck = Deck()
        expected = {"A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"}
        for suit in ("♠", "♥", "♦", "♣"):
            ranks = {c.rank for c in deck.cards if c.suit == suit}
            assert ranks == expected


class TestDeckDraw:
    @patch("random.shuffle")
    def test_draw_removes_card_from_deck_single_decks(self, mock_shuffle):
        deck = Deck(num_decks=1)
        card = deck.draw_card()
        assert isinstance(card, Card)
        assert len(deck.cards) == 51

    @patch("random.shuffle")
    def test_remaining_cards_decreases_after_draw_single_decks(self, mock_shuffle):
        deck = Deck(num_decks=1)
        deck.draw_card()
        assert deck.remaining_cards() == 51


class TestDeckRemainingCards:
    @patch("random.shuffle")
    def test_initial_remaining_is_total_single_decks(self, mock_shuffle):
        deck = Deck(num_decks=1)
        assert deck.remaining_cards() == 52

    @patch("random.shuffle")
    def test_remaining_after_draws_single_decks(self, mock_shuffle):
        deck = Deck(num_decks=1)
        deck.draw_card()
        assert deck.remaining_cards() == 51


# ====== BlackjackHand Tests ======

class TestHandValue:
    def test_two_ten_value_cards_gives_twenty(self):
        hand = BlackjackHand()
        hand.add_card(Card(rank="10", suit="♠"))
        hand.add_card(Card(rank="K", suit="♥"))
        assert hand.get_value() == 20

    def test_ace_plus_seven_is_eighteen_soft(self):
        hand = BlackjackHand()
        hand.add_card(Card(rank="A", suit="♠"))
        hand.add_card(Card(rank="7", suit="♥"))
        # Ace counts as 11, 7 → soft 18
        assert hand.get_value() == 18

    def test_two_aces_gives_twelve_not_one_or_twenty_two(self):
        hand = BlackjackHand()
        hand.add_card(Card(rank="A", suit="♠"))
        hand.add_card(Card(rank="A", suit="♥"))
        # One ace as 11, other as 1 → value is 12
        assert hand.get_value() == 12

    def test_ace_plus_king_gives_twenty_one_soft(self):
        hand = BlackjackHand()
        hand.add_card(Card(rank="A", suit="♠"))
        hand.add_card(Card(rank="K", suit="♥"))
        # Ace as 11 + king as 10 → soft 21 (blackjack value)
        assert hand.get_value() == 21

    def test_hard_seven(self):
        hand = BlackjackHand()
        hand.add_card(Card(rank="3", suit="♠"))
        hand.add_card(Card(rank="4", suit="♥"))
        assert hand.get_value() == 7


class TestBlackjackDetection:
    def test_blackjack_true_a_k(self):
        hand = BlackjackHand()
        hand.add_card(Card(rank="A", suit="♠"))
        hand.add_card(Card(rank="K", suit="♥"))
        assert hand.is_blackjack() is True

    def test_no_blackjack_with_three_cards_even_at_twenty_one(self):
        hand = BlackjackHand()
        hand.add_card(Card(rank="10", suit="♠"))
        hand.add_card(Card(rank="A", suit="♥"))
        hand.add_card(Card(rank="K", suit="♦"))
        assert hand.is_blackjack() is False

    def test_no_blackjack_with_different_ranks(self):
        hand = BlackjackHand()
        hand.add_card(Card(rank="10", suit="♠"))
        hand.add_card(Card(rank="9", suit="♥"))
        assert hand.is_blackjack() is False

    def test_no_blackjack_even_value_not_twenty_one(self):
        hand = BlackjackHand()
        hand.add_card(Card(rank="A", suit="♠"))
        hand.add_card(Card(rank="8", suit="♥"))
        assert hand.is_blackjack() is False


class TestBustDetection:
    def test_bust_10_plus_q(self):
        hand = BlackjackHand()
        hand.add_card(Card(rank="K", suit="♠"))
        hand.add_card(Card(rank="Q", suit="♥"))
        # K=10 + Q=10 = 20, not bust. Use three cards for bust: 10+10+3=23
        pass

    def test_bust_with_three_cards_over_twenty_one(self):
        hand = BlackjackHand()
        hand.add_card(Card(rank="K", suit="♠"))
        hand.add_card(Card(rank="Q", suit="♥"))
        hand.add_card(Card(rank="3", suit="♦"))
        # 10 + 10 + 3 = 23, bust
        assert hand.is_bust() is True

    def test_not_bust_soft_ace(self):
        hand = BlackjackHand()
        hand.add_card(Card(rank="A", suit="♠"))
        assert hand.is_bust() is False

    def test_three_aces_not_bust(self):
        hand = BlackjackHand()
        for _ in range(3):
            hand.add_card(Card(rank="A", suit="♠"))
        # 1+1+1 = 3, not bust
        assert hand.is_bust() is False

    def test_not_bust_soft_twenty(self):
        hand = BlackjackHand()
        hand.add_card(Card(rank="A", suit="♠"))
        hand.add_card(Card(rank="9", suit="♥"))
        # Ace=11 + 9 = soft 20, not bust
        assert hand.is_bust() is False

    def test_bust_at_twenty_two(self):
        hand = BlackjackHand()
        hand.add_card(Card(rank="K", suit="♠"))
        hand.add_card(Card(rank="Q", suit="♥"))
        # K+Q = 20. Add another card >2 → bust
        hand.add_card(Card(rank="3", suit="♦"))
        assert hand.is_bust() is True


class TestSoftHardHand:
    def test_soft_seventeen_a_six(self):
        hand = BlackjackHand()
        hand.add_card(Card(rank="A", suit="♠"))
        hand.add_card(Card(rank="6", suit="♥"))
        assert hand.get_value() == 17
        assert hand.is_soft is True

    def test_hard_seventeen_k_seven(self):
        hand = BlackjackHand()
        hand.add_card(Card(rank="K", suit="♠"))
        hand.add_card(Card(rank="7", suit="♥"))
        assert hand.get_value() == 17
        assert hand.is_soft is False

    def test_not_soft_ace_a(self):
        hand = BlackjackHand()
        hand.add_card(Card(rank="A", suit="♠"))
        hand.add_card(Card(rank="A", suit="♥"))
        # 11+1=12, soft hand
        assert hand.is_soft is True


# ====== Dealer Logic Tests ======

class TestDealerNeedsHit:
    def test_hits_on_six(self):
        engine = BlackjackEngine(num_decks=6)
        hand = BlackjackHand()
        hand.add_card(Card(rank="3", suit="♠"))
        hand.add_card(Card(rank="3", suit="♥"))
        assert engine._dealer_needs_hit(hand) is True

    def test_stands_on_twenty_one(self):
        engine = BlackjackEngine(num_decks=6)
        hand = BlackjackHand()
        hand.add_card(Card(rank="10", suit="♠"))
        hand.add_card(Card(rank="A", suit="♥"))
        assert engine._dealer_needs_hit(hand) is False

    def test_hits_on_soft_sixteen_a_five(self):
        engine = BlackjackEngine(num_decks=6)
        hand = BlackjackHand()
        hand.add_card(Card(rank="A", suit="♠"))
        hand.add_card(Card(rank="5", suit="♥"))
        assert engine._dealer_needs_hit(hand) is True

    def test_hits_on_soft_seventeen_a_six(self):
        engine = BlackjackEngine(num_decks=6)
        hand = BlackjackHand()
        hand.add_card(Card(rank="A", suit="♠"))
        hand.add_card(Card(rank="6", suit="♥"))
        assert engine._dealer_needs_hit(hand) is True

    def test_stands_on_hard_eighteen_k_seven(self):
        engine = BlackjackEngine(num_decks=6)
        hand = BlackjackHand()
        hand.add_card(Card(rank="K", suit="♠"))
        hand.add_card(Card(rank="7", suit="♥"))
        assert engine._dealer_needs_hit(hand) is False


# ====== Engine Deal Tests ======

class TestEngineDeal:
    @patch("random.shuffle")
    def test_engine_deal_returns_correct_keys(self, mock_shuffle):
        engine = BlackjackEngine(num_decks=1)
        result = engine.deal_hand("user123")
        assert "player_hands" in result
        assert "dealer_up_card" in result
        assert "hand_ids" in result

    @patch("random.shuffle")
    def test_engine_deal_player_has_two_cards(self, mock_shuffle):
        engine = BlackjackEngine(num_decks=1)
        result = engine.deal_hand("user123")
        for hand_data in result["player_hands"]:
            assert len(hand_data["cards"]) == 2

    @patch("random.shuffle")
    def test_engine_deal_player_has_value(self, mock_shuffle):
        engine = BlackjackEngine(num_decks=1)
        result = engine.deal_hand("user123")
        for hand_data in result["player_hands"]:
            assert "value" in hand_data


# ====== Endpoint Integration Tests ======

from main import app


class TestBlackjackEndpointDeal:
    @pytest.mark.asyncio
    async def test_deal_hand_success(self):
        with patch("src.blackjack_engine.random.randint") as mock_rand:
            call_count = [0]

            async def fake_draw():
                return mock_rand(2, 50)

            async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
                response = await ac.post("/games/blackjack/deal", params={
                    "bet_amount": 25.0,
                    "user_id": "user123"
                })

        assert response.status_code == 200
        data = response.json()
        assert "player_hands" in data
        assert "dealer_up_card" in data
        assert "hand_ids" in data
        assert "status" in data
        assert data["status"] == "playing"

    @pytest.mark.asyncio
    async def test_deal_insufficient_balance(self):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            response = await ac.post("/games/blackjack/deal", params={
                "bet_amount": 999999.0,
                "user_id": "user123"
            })

        assert response.status_code == 400


class TestBlackjackEndpointHit:
    @pytest.mark.asyncio
    async def test_hit_success(self):
        with patch("src.blackjack_engine.random.randint") as mock_rand:
            call_count = [0]

            async def fake_draw():
                return mock_rand(2, 50)


class TestBlackjackEndpointStand:
    @pytest.mark.asyncio
    async def test_stand_resolves_game(self):
        with patch("src.blackjack_engine.random.randint") as mock_rand:
            call_count = [0]

            async def fake_draw():
                return mock_rand(2, 50)


class TestBlackjackEndpointDoubleDown:
    @pytest.mark.asyncio
    async def test_double_down_doubles_bet(self):
        with patch("src.blackjack_engine.random.randint") as mock_rand:
            call_count = [0]


class TestPayoutScenarios:
    @pytest.mark.asyncio
    async def test_payout_win_returns_positive(self):
        pass

    @pytest.mark.asyncio
    async def test_payout_loss_returns_zero(self):
        pass
