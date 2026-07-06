
import logging

class CasinoLogger:
    def __init__(self):
        self.logger = logging.getLogger("CasinoApp")
        if not self.logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter('%(levelname)s - %(message)s')
            handler.setFormatter(formatter)
            self.logger.addHandler(handler)
        self.logger.setLevel(logging.INFO)

    def log_transaction(self, user_id: str, amount: float, transaction_type: str):
        message = f"TRANSACTION | {user_id} | {transaction_type} | {amount}"
        self.logger.info(message)
