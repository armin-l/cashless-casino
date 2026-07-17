from typing import Dict

class InMemoryDatabase:
    def __init__(self):
        # user_id -> balance
        self.balances: Dict[str, float] = {"user123": 1000.0}
        # transaction history would go here in a real app

    def get_balance(self, user_id: str) -> float:
        return self.balances.get(user_id, 0.0)

    def update_balance(self, user_id: str, amount: float):
        if user_id not in self.balances:
            self.balances[user_id] = 0.0
        self.balances[user_id] += amount

    def get_all_balances(self) -> Dict[str, float]:
        return self.balances

db = InMemoryDatabase()
