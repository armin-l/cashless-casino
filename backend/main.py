from fastapi import FastAPI, HTTPException, WebSocket
import random
from src.logger_utils import casino_logger
from src.database import db
from src.roulette_engine import RouletteEngine
from src.blackjack_engine import BlackjackEngine
from src.effects_engine import EffectEngine
from src.sound_effects import SoundEffectQueue, SoundEventType
from src.websocket_manager import ConnectionManager

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




effect_engine = EffectEngine()
sound_queue_manager = SoundEffectQueue()
connection_manager = ConnectionManager()


@app.get('/animation/spin', tags=["Animations"])
async def animation_spin(
    game_type: str,
    user_id: str,
    reel_count: int = 3,
    spin_duration_ms: int = 4000,):
    if game_type not in ("slots", "roulette"):
        raise HTTPException(status_code=400, detail=f"Invalid game type: {game_type}")

    result = await effect_engine.create_spin_animation(
        game_type=game_type,
        user_id=user_id,
        reel_count=reel_count,
        spin_duration_ms=spin_duration_ms,
    )
    casino_logger.log_event("animation_created", {"game_type": game_type, "user_id": user_id})
    return result


@app.post('/sounds/queue', tags=["Sound Effects"])
async def sounds_queue(
    user_id: str,
    sound_type: str = "spin_start",
):
    try:
        event = SoundEventType(sound_type)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid sound type: {sound_type}")

    result = await sound_queue_manager.queue_effect(
        user_id=user_id, game_type="slots", event_type=event
    )
    casino_logger.log_event("sound_queued", {"user_id": user_id, "event": sound_type})
    return result


@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await connection_manager.connect(user_id, websocket)
    try:
        while True:
            await websocket.receive_text()
    except Exception:
        pass
    finally:
        await connection_manager.disconnect(user_id, websocket)



# Leaderboard endpoints
from src.leaderboard_engine import engine as leaderboard_engine

@app.get('/leaderboard/{leaderboard_type}', tags=["Leaderboards"])
async def get_leaderboard(leaderboard_type: str, limit: int = 10):
    """Get a ranked leaderboard by type."""
    leaderboard = leaderboard_engine.get_leaderboard(leaderboard_type, limit=limit)

    return leaderboard


@app.get('/user/stats', tags=["User"])
async def get_user_stats(user_id: str = "user123"):
    """Get current stats for a specific user."""
    stats = leaderboard_engine.get_user_stats(user_id)
    return stats


@app.post('/economy/record_game', tags=["Economy"])
async def record_game(
    user_id: str,
    game_type: str,
    bet_amount: float,
    payout: float,
):
    """Record a game result in the leaderboard tracking system."""
    result = leaderboard_engine.record_game_result(
        user_id=user_id,
        game_type=game_type,
        bet_amount=bet_amount,
        payout=payout,
    )
    return {
        "success": True,
        "data": result,
    }


@app.get('/user/leaderboard', tags=["User"])
async def get_user_leaderboard(user_id: str = "user123"):
    """Get user's position in all leaderboards."""
    stats = leaderboard_engine.get_user_stats(user_id)

    total_lb = leaderboard_engine.get_leaderboard("total_winnings", limit=100)
    games_lb = leaderboard_engine.get_leaderboard("games_played", limit=100)
    biggest_lb = leaderboard_engine.get_leaderboard("biggest_win", limit=100)

    return {
        "user_id": user_id,
        "stats": stats,
        "rankings": {
            "total_winnings_rank": next(
                (entry["rank"] for entry in total_lb if entry["user_id"] == user_id), None
            ),
            "games_played_rank": next(
                (entry["rank"] for entry in games_lb if entry["user_id"] == user_id), None
            ),
            "biggest_win_rank": next(
                (entry["rank"] for entry in biggest_lb if entry["user_id"] == user_id), None
            ),
        },
    }


@app.post('/users/{user_id}/reset', tags=["Admin"])
async def reset_user_progress(user_id: str):
    """Reset a user's stats (admin function)."""
    leaderboard_engine.player_stats.pop(user_id, None)
    leaderboard_engine.biggest_wins.pop(user_id, None)

    if user_id in leaderboard_engine.recent_wins_by_user:
        del leaderboard_engine.recent_wins_by_user[user_id]

    return {
        "success": True,
        "message": f"Stats for {user_id} have been reset",
    }


@app.get('/users', tags=["Admin"])
async def list_all_users():
    """List all tracked users."""
    users = []
    for uid, stats in leaderboard_engine.player_stats.items():
        users.append({
            "user_id": uid,
            "games_played": stats.games_played,
            "total_winnings": stats.total_winnings,
        })

    return {
        "success": True,
        "count": len(users),
        "data": users,
    }


