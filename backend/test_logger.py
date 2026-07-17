
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'src')))

from logger_utils import CasinoLogger
import logging

def test_logger_initialization():
    logger = CasinoLogger()
    assert logger.logger.level == logging.INFO

def test_log_transaction_format(caplog):
    logger = CasinoLogger()
    # caplog.at_level takes the name of the logger as a string or handles it via the proxy
    with caplog.at_level(logging.INFO, logger="CasinoApp"):
        logger.log_transaction(user_id="user123", amount=50.0, transaction_type="win")
    
    assert "TRANSACTION | User: user123 | Type: win | Amount: 50.0" in caplog.text
