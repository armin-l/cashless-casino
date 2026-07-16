from fastapi import FastAPI, HTTPException
import random
from src.logger_utils import casino_logger
from src.database import db
from src.roulette_engine import RouletteEngine
from src.blackjack_engine import BlackjackEngine

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


@app.post('/games/roulette/spin', tags=["Games"])
async def spin_roulette(
    bet_type: str,
    bet_amount: float,
    user_id: str = "user123",
    bet_number: int | None = None,
    bet_parameter: int | None = None,
):
    if db.get_balance(user_id) < bet_amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")

    engine = RouletteEngine()
    winning_number = engine.spin()
    color = engine.get_color(winning_number)

    payout_kwargs = {}
    if bet_type == "straight":
        payout_kwargs["bet_parameter"] = [bet_number] if bet_number is not None else []
    elif bet_type in ("dozen", "column"):
        payout_kwargs["bet_parameter"] = bet_parameter

    payout = engine.calculate_payout(
        bet_type, bet_amount, winning_number, **payout_kwargs
    )

    result = "win" if payout > 0 else "loss"

    db.update_balance(user_id, payout)

    casino_logger.log_event(
        "game_spin",
        {
            "game": "roulette",
            "result": result,
            "payout": payout,
            "user_id": user_id,
        },
    )

    return {
        "result": result,
        "payout": payout,
        "winning_number": winning_number,
        "color": color,
        "balance": db.get_balance(user_id),
    }


@app.post('/games/blackjack/deal', tags=["Games"])
async def deal_blackjack(
    bet_amount: float = 25.0,
    user_id: str = "user123",
):
    if db.get_balance(user_id) < bet_amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")

    engine = BlackjackEngine(num_decks=6)
    result = engine.deal_hand(user_id, bet_amount)
    # Deduct bet from user balance
    db.update_balance(user_id, -bet_amount)

    casino_logger.log_event(
        "game_spin",
        {
            "game": "blackjack",
            "action": "deal",
            "user_id": user_id,
            "bet": bet_amount,
        },
    )

    return result


@app.post('/games/blackjack/hit', tags=["Games"])
async def hit_blackjack(
    hand_id: str,
):
    engine = BlackjackEngine(num_decks=6)
    # Load state from database - for now we use a simple approach
    result = engine.hit(hand_id)

    casino_logger.log_event(
        "game_spin",
        {
            "game": "blackjack",
            "action": "hit",
            "hand_id": hand_id,
        },
    )

    return result


@app.post('/games/blackjack/stand', tags=["Games"])
async def stand_blackjack(
    hand_id: str,
):
    engine = BlackjackEngine(num_decks=6)
    result = engine.stand(hand_id)

    casino_logger.log_event(
        "game_spin",
        {
            "game": "blackjack",
            "action": "stand",
            "hand_id": hand_id,
        },
    )

    return result


@app.post('/games/blackjack/double_down', tags=["Games"])
async def double_down_blackjack(
    hand_id: str,
):
    engine = BlackjackEngine(num_decks=6)
    result = engine.double_down(hand_id)

    casino_logger.log_event(
        "game_spin",
        {
            "game": "blackjack",
            "action": "double_down",
            "hand_id": hand_id,
        },
    )

    return result


