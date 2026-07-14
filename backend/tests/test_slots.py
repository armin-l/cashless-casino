import pytest
from httpx import AsyncClient, ASGITransport
from backend.main import app

@pytest.mark.asyncio
async def test_spin_slots_success():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/games/slots/spin", params={"bet_amount": 10.0})
    
    assert response.status_code == 200
    data = response.json()
    assert "result" in data
    assert "payout" in data
    assert "reels" in data
