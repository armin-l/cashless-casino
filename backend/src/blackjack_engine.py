import random


class Card:
    def __init__(self, rank: str, suit: str):
        self.suit = suit  # "♠", "♥", "♦", "♣"
        self.rank = rank

    @property
    def value(self) -> int:
        if self.rank in ("J", "Q", "K"):
            return 10
        elif self.rank == "A":
            return 1
        else:
            return int(self.rank)

    def __repr__(self):
        return f"{self.rank}{self.suit}"


class Deck:
    RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
    SUITS = ["♠", "♥", "♦", "♣"]

    def __init__(self, num_decks: int = 6):
        self.num_decks = num_decks
        self.cards: list[Card] = []
        self._build_deck()
        self.shuffle()

    def _build_deck(self):
        self.cards = []
        for _ in range(self.num_decks):
            for suit in self.SUITS:
                for rank in self.RANKS:
                    self.cards.append(Card(rank, suit))

    def shuffle(self):
        random.shuffle(self.cards)

    def draw_card(self) -> Card:
        if not self.cards:
            raise ValueError("Cannot draw from an empty deck")
        return self.cards.pop()

    def remaining_cards(self) -> int:
        return len(self.cards)


class BlackjackHand:
    def __init__(self):
        self.cards: list[Card] = []

    def add_card(self, card: Card):
        self.cards.append(card)

    @property
    def is_soft(self) -> bool:
        """Check if hand has a soft total (ace counted as 11)."""
        # Count aces and check if at least one can be 11 without busting
        ace_count = sum(1 for c in self.cards if c.rank == "A")
        non_ace_total = sum(c.value for c in self.cards if c.rank != "A")
        # Soft means the best total uses an ace as 11 (not all aces forced to 1)
        return ace_count > 0 and non_ace_total + 11 <= 21

    def get_value(self) -> int:
        """Calculate hand value with aces as 1 or 11."""
        total = sum(c.value for c in self.cards)
        aces_in_hand = sum(1 for c in self.cards if c.rank == "A")

        while aces_in_hand > 0 and total + 10 <= 21:
            total += 10
            aces_in_hand -= 1

        return total

    def is_bust(self) -> bool:
        return self.get_value() > 21

    @property
    def card_count(self) -> int:
        return len(self.cards)

    def is_blackjack(self) -> bool:
        """Check for blackjack (exactly 21 with exactly 2 cards)."""
        return len(self.cards) == 2 and self.get_value() == 21

    @property
    def can_double_down(self) -> bool:
        """Player can double down only on first turn (exactly 2 cards)."""
        return len(self.cards) == 2


class BlackjackEngine:
    def __init__(self, num_decks: int = 6):
        self.num_decks = num_decks
        self.deck = Deck(num_decks)

    # ---- public API ----

    def deal_hand(self, user_id: str, bet_amount: float = 25.0) -> dict:
        """Deal initial hand. Returns deal response."""
        self.deck.shuffle()

        player_hand = BlackjackHand()
        dealer_initial_cards: list[Card] = []

        for _ in range(2):
            player_hand.add_card(self.deck.draw_card())
            dealer_initial_cards.append(self.deck.draw_card())

        hand_id = f"hand_{user_id}_001"
        self.deal_state = {hand_id: {
            "player": player_hand,
            "dealer_initial": list(dealer_initial_cards),
            "bet": bet_amount,
        }}

        def card_to_dict(c: Card) -> dict:
            return {"suit": c.suit, "rank": c.rank}

        ph = player_hand
        return {
            "player_hands": [
                {
                    "cards": [card_to_dict(c) for c in ph.cards],
                    "value": ph.get_value(),
                    "is_blackjack": ph.is_blackjack(),
                    "hand_id": hand_id,
                }
            ],
            "dealer_up_card": card_to_dict(dealer_initial_cards[0]),
            "hand_ids": [hand_id],
            "status": "playing",
        }

    def hit(self, hand_id: str) -> dict:
        """Player hits (draws another card)."""
        if hand_id not in self.deal_state:
            raise ValueError(f"Hand {hand_id} not found")

        game = self.deal_state[hand_id]
        player_hand = game["player"]

        new_card = self.deck.draw_card()
        player_hand.add_card(new_card)

        def card_to_dict(c: Card) -> dict:
            return {"suit": c.suit, "rank": c.rank}

        if player_hand.is_bust():
            balance_before = self._get_balance("user123")
            return {
                "result": "bust",
                "payout": 0.0,
                "final_balance": balance_before,
                "cards": [card_to_dict(c) for c in player_hand.cards],
                "value": player_hand.get_value(),
            }

        return {
            "hand_id": hand_id,
            "cards": [card_to_dict(c) for c in player_hand.cards],
            "value": player_hand.get_value(),
            "status": "playing",
        }

    def stand(self, hand_id: str) -> dict:
        """Player stands - dealer plays out."""
        if hand_id not in self.deal_state:
            raise ValueError(f"Hand {hand_id} not found")

        game = self.deal_state[hand_id]
        player_hand = game["player"]
        return self._play_dealer_and_resolve(player_hand, game["dealer_initial"], game["bet"])

    def double_down(self, hand_id: str) -> dict:
        """Double down - doubles bet, draws one more card."""
        if hand_id not in self.deal_state:
            raise ValueError(f"Hand {hand_id} not found")

        game = self.deal_state[hand_id]
        player_hand = game["player"]

        new_card = self.deck.draw_card()
        player_hand.add_card(new_card)

        def card_to_dict(c: Card) -> dict:
            return {"suit": c.suit, "rank": c.rank}

        if player_hand.is_bust():
            balance_before = self._get_balance("user123")
            new_balance = balance_before - game["bet"]
            # double down deducts additional bet on bust (extra draw)
            return {
                "result": "bust",
                "payout": 0.0,
                "final_balance": new_balance,
                "cards": [card_to_dict(c) for c in player_hand.cards],
                "value": player_hand.get_value(),
            }

        result = self._play_dealer_and_resolve(
            player_hand, game["dealer_initial"], game["bet"], double_down=True
        )

        # For double down: effective bet is doubled for payout purposes
        if result["result"] == "win":
            result["payout"] *= 2

        return {
            "result": result["result"],
            "payout": result["payout"],
            "final_balance": result["balance"],
            "cards": [card_to_dict(c) for c in player_hand.cards],
            "value": player_hand.get_value(),
        }

    # ---- internal helpers ----

    def _get_balance(self, user_id: str) -> float:
        """Get current balance (after bet deduction)."""
        from src.database import db
        return db.get_balance(user_id)

    def _update_balance(self, user_id: str, amount: float):
        """Update balance by adding net_winnings."""
        from src.database import db
        db.update_balance(user_id, amount)

    def _play_dealer_and_resolve(
        self, player_hand: BlackjackHand, dealer_initial_cards: list[Card], bet_amount: float, double_down: bool = False
    ) -> dict:
        """Play out dealer's hand and resolve game result."""
        # Rebuild dealer hand from initial 2 cards + deck draws
        dealer_hand = BlackjackHand()
        for card in dealer_initial_cards:
            dealer_hand.add_card(card)

        while self._dealer_needs_hit(dealer_hand):
            dealer_hand.add_card(self.deck.draw_card())

        is_blackjack = player_hand.is_blackjack()
        player_value = player_hand.get_value()
        dealer_value = dealer_hand.get_value()

        # Determine result and payout (payout = net winnings, NOT including stake return)
        if is_blackjack:
            # Blackjack pays 3:2 → net_winnings = bet * 1.5
            status_result = "win"
            net_winnings = float(bet_amount * 1.5)

        elif player_value == dealer_value:
            # Push → no winnings, original bet stays deducted (net zero change to balance)
            status_result = "push"
            net_winnings = 0.0

        elif dealer_value > 21 or player_value > dealer_value:
            # Win → pays 1:1 → net_winnings = bet_amount
            status_result = "win"
            net_winnings = float(bet_amount)

        else:
            # Loss → balance already reduced by initial deduction, no further change
            status_result = "loss"
            net_winnings = 0.0

        current_balance = self._get_balance("user123")
        new_balance = current_balance + net_winnings

        if net_winnings > 0:
            # Win or push (push returns bet via balance unchanged → no update needed)
            if status_result == "win":
                self._update_balance("user123", net_winnings)
            elif status_result == "push":
                pass  # balance already deducted on deal; push = no change

        return {
            "result": status_result,
            "payout": net_winnings,
            "balance": new_balance,
        }

    def _dealer_needs_hit(self, hand: BlackjackHand) -> bool:
        """Dealer hits on soft 17 or below. Stands on hard 17+."""
        value = hand.get_value()
        if value < 17:
            return True
        # Soft 17 → dealer must hit
        if value == 17 and hand.is_soft:
            return True
        return False
