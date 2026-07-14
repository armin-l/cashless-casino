from fastapi import FastAPI, Depends, HTTPException
import random
from src.logger_utils import casino_logger
from src.database import db

app = FastAPI(
    title="Cashless Casino API",
    description="API for managing users, wallets, and games in a cashless casino environment.",
    version="0.1.0"
)

SYMBOLS = ["🍒", "🍋", "🔔", "💎", "7️⃣"]

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
    return {"user_id": user_id, "balance": db.get_balance(user_id)}

@app.post('/economy/deposit', tags=["Economy"])
async def deposit_funds(amount: float, method: str = "mock_card"):
    db.update_balance(user_id="user123", amount=amount)
    casino_logger.log_transaction(user_id="user123", amount=amount, transaction_type="deposit")
    return {"status": "processing", "amount": amount, "method": method}

@app.post('/games/slots/spin', tags=["Games"])
async def spin_slots(bet_amount: float, user_id: str = "user123"):
    if db.get_balance(user_id) < bet_amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")

    reels = [random.choice(SYMBOLS) for _ in range(3)]
    
    # Simple win logic: all three match
    is_win = reels[0] == reels[1] == reels[2]
    multiplier = 10.0 if is_win else 0.0
    payout = bet_amount * multiplier
    
    if is_win:
        db.update_balance(user_id, payout)

    result = "win" if is_win else "loss"
    
    casino_logger.log_event("game_spin", {"game": "slots", "result": result, "payout": payout, "user_id": user_id})
    
    return {
        "result": result,
        "payout": payout,
        "reels": reels
    }

@app.post('/games/wheel/spin', tags=["Games"])
async def spin_wheel():
    casino_logger.log_event("game_spin", {"game": "wheel"})
    # Placeholder for game logic
    return {"result": "win", "multiplier": 2.0}


