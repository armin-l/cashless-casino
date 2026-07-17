import logging
import sys

class CasinoLogger:
    def __init__(self, name="CasinoApp", level=logging.INFO):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(level)
        
        if not self.logger.handlers:
            # Stream handler for stdout
            handler = logging.StreamHandler(sys.stdout)
            formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
            handler.setFormatter(formatter)
            self.logger.addHandler(handler)

    def log_transaction(self, user_id: str, amount: float, transaction_type: str):
        message = f"TRANSACTION | User: {user_id} | Type: {transaction_type} | Amount: {amount}"
        self.logger.info(message)

    def log_event(self, event_name: str, details: dict):
        message = f"EVENT | {event_name} | Details: {details}"
        self.logger.info(message)

    def log_error(self, error_msg: str, exc_info=True):
        self.logger.error(f"ERROR | {error_msg}", exc_info=exc_info)

    def log_warning(self, warning_msg: str):
        self.logger.warning(f"WARNING | {warning_msg}")

# Singleton instance for easy use across the app
casino_logger = CasinoLogger()
