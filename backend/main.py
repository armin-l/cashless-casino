from fastapi import FastAPI, Depends
from src.logger_utils import casino_logger

app = FastAPI(
    title="Cashless Casino API",
    description="API for managing users, wallets, and games in a cashless casino environment.",
    version="0.1.0"
)

@app.get('/', tags=["Health"])
def read_root():
    casino_logger.log_event("health_check", {"status": "ok"})
    return {'status': 'online', 'service': 'cashless-casino-api'}

@app.get('/auth/me', tags=["Authentication"])
def get_current_user_me():
    # Placeholder for authenticated user logic
    return {"username": "demo_user", "id": "user120"}

@app.get('/wallet/balance', tags=["Wallet"])
def get_wallet_balance(user_id: str = "user123"):
    casino_logger.log_event("balance_check", {"user_id": user_id})
    return {"user_id": user_id, "balance": 1000.0}

@app.post('/economy/deposit', tags=["Economy"])
async def deposit_funds(amount: float, method: str = "mock_card"):
    casino_logger.log_transaction(user_id="user123", amount=amount, transaction_type="deposit")
    return {"status": "processing", "amount": amount, "method": method}

@app.post('/games/wheel/spin', tags=["Games"])
async def spin_wheel():
    casino_logger.log_event("game_spin", {"game": "wheel"})
    # Placeholder for game logic
    return {"result": "win", "multiplier": 2.0}

