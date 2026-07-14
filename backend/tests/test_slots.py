import pytest
from unittest.mock import patch
from httpx import AsyncClient, ASGITransport
import sys
import os

# Add backend to python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from main import app

@pytest.mark.asyncio
async def test_spin_slots_success():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/games/slots/spin", params={"bet_amount": 10.0, "user_id": "user123"})
    
    assert response.status_code == 200
    data = response.json()
    assert "result" in data
    assert "payout" in data
    assert "reels" in data

@pytest.mark.asyncio
async def test_spin_slots_insufficient_balance():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/games/slots/spin", params={"bet_amount": 1000000.0, "user_id": "user123"})
    
    assert response.status_code == 400
    assert response.json()["detail"] == "Insufficient balance"

@pytest.mark.asyncio
async def test_spin_slots_win():
    # Mock random.choice to always return the same symbol for a win
    with patch("random.choice", return_value="7️⃣"):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            response = await ac.post("/games/slots/spin", params={"bet_amount": 10.0, "user_id": "user123"})
    
    assert response.status_code == 200
    data = response.json()
    assert data["result"] == "win"
    assert data["payout"] == 100.0 # 10.0 * 10.0

@pytest.mark.asyncio
async def test_deposit_funds():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/economy/deposit", params={"amount": 50.0, "method": "mock_card"})
    
    assert response.status_code == 200
    assert response.json()["amount"] == 50.0

@pytest.mark.asyncio
async def test_get_wallet_balance():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/wallet/balance", params={"user_id": "user123"})
    
    assert response.status_code == 200
    assert "balance" in response.json()



