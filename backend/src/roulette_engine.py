import random


class RouletteEngine:
    """European single-zero roulette wheel"""

    def __init__(self):
        self.wheel_numbers = list(range(0, 37))  # 0-36
        self.red_numbers = {1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36}

    def spin(self) -> int:
        """Simulate a wheel spin and return the winning number"""
        return random.randint(0, 36)

    def get_color(self, number: int) -> str:
        """Return 'red', 'black', or 'green' for European roulette"""
        if number == 0:
            return "green"
        elif number in self.red_numbers:
            return "red"
        else:
            return "black"

    def calculate_payout(self, bet_type: str, bet_amount: float, winning_number: int, **kwargs) -> float:
        """Calculate payout based on bet type and winning number.

        Returns the total payout amount (including original stake).
        0.0 if no win.
        """
        bet_parameter = kwargs.get("bet_parameter", None)

        # Straight bet - single number
        if bet_type == "straight":
            if not isinstance(bet_parameter, list):
                bet_parameter_list = [bet_parameter]
            else:
                bet_parameter_list = bet_parameter
            if winning_number in bet_parameter_list:
                return bet_amount * 35.0
            return 0.0

        # Color bets
        elif bet_type == "red":
            if winning_number in self.red_numbers:
                return bet_amount * 2.0
            return 0.0

        elif bet_type == "black":
            if winning_number not in self.red_numbers and winning_number != 0:
                return bet_amount * 2.0
            return 0.0

        # Odd / Even
        elif bet_type == "odd":
            if 1 <= winning_number <= 36 and winning_number % 2 == 1:
                return bet_amount * 2.0
            return 0.0

        elif bet_type == "even":
            if 2 <= winning_number <= 35 and winning_number % 2 == 0:
                return bet_amount * 2.0
            return 0.0

        # Low / High (1-18 / 19-36)
        elif bet_type == "low":
            if 1 <= winning_number <= 18:
                return bet_amount * 2.0
            return 0.0

        elif bet_type == "high":
            if 19 <= winning_number <= 36:
                return bet_amount * 2.0
            return 0.0

        # Dozen bets
        elif bet_type == "dozen":
            dozen = int(bet_parameter) if bet_parameter is not None else None
            if dozen == 1:
                if 1 <= winning_number <= 12:
                    return bet_amount * 3.0
            elif dozen == 2:
                if 13 <= winning_number <= 24:
                    return bet_amount * 3.0
            elif dozen == 3:
                if 25 <= winning_number <= 36:
                    return bet_amount * 3.0
            return 0.0

        # Column bets
        elif bet_type == "column":
            col = int(bet_parameter) if bet_parameter is not None else None
            if col == 1:
                # Numbers where num % 3 == 1 (1,4,7,...,34)
                if winning_number > 0 and winning_number % 3 == 1:
                    return bet_amount * 3.0
            elif col == 2:
                # Numbers where num % 3 == 2 (2,5,8,...,35)
                if winning_number > 0 and winning_number % 3 == 2:
                    return bet_amount * 3.0
            elif col == 3:
                # Numbers where num % 3 == 0 (3,6,9,...,36)
                if winning_number > 0 and winning_number % 3 == 0:
                    return bet_amount * 3.0
            return 0.0

        else:
            # Unknown bet type - no payout
            return 0.0
