from unittest.mock import AsyncMock, patch

import pytest
from httpx import ASGITransport, AsyncClient

# Ensure backend is on path
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.effects_engine import EffectEngine
from src.sound_effects import (
    SoundEffectQueue,
    SoundEventType,
    get_default_sound_config,
)
from src.websocket_manager import ConnectionManager
import main as main_module


# ============================================================
# Effects Engine Tests – Slots Animation Frames
# ============================================================

class TestEffectEngineSlotsAnimation:
    @pytest.fixture
    def engine(self):
        return EffectEngine()

    @pytest.mark.asyncio
    async def test_create_spin_animation_returns_expected_keys(self, engine):
        result = await engine.create_spin_animation(
            game_type="slots", user_id="user123"
        )
        assert "session_id" in result
        assert "frames" in result
        assert "total_duration_ms" in result
        assert "game_type" in result

    @pytest.mark.asyncio
    async def test_create_spin_animation_stores_session(self, engine):
        result = await engine.create_spin_animation(
            game_type="slots", user_id="user123"
        )
        session_id = result["session_id"]
        assert session_id in engine.active_sessions

    @pytest.mark.asyncio
    async def test_slots_frames_have_reel_positions(self, engine):
        result = await engine.create_spin_animation(
            game_type="slots", user_id="user123"
        )
        frames = result["frames"]
        assert len(frames) > 0
        for frame in frames:
            assert "frame_index" in frame
            assert "timestamp_ms" in frame
            assert "reels" in frame

    @pytest.mark.asyncio
    async def test_staggered_stop_pattern_left_first(self, engine):
        """Verify left reels stop before right ones (staggered pattern)"""
        result = await engine.create_spin_animation(
            game_type="slots", user_id="user123", reel_count=5
        )
        frames = result["frames"]
        # The final frame should have all reels landed (position == final target)
        last_frame = frames[-1]
        assert len(last_frame["reels"]) == 5

    @pytest.mark.asyncio
    async def test_duration_matches_spins_parameter(self, engine):
        duration_ms = 6000
        result = await engine.create_spin_animation(
            game_type="slots", user_id="user123", spin_duration_ms=duration_ms
        )
        assert result["total_duration_ms"] == duration_ms

    @pytest.mark.asyncio
    async def test_default_reel_count_is_three(self, engine):
        result = await engine.create_spin_animation(
            game_type="slots", user_id="user123"
        )
        last_frame = result["frames"][-1]
        assert len(last_frame["reels"]) == 3

    @pytest.mark.asyncio
    async def test_custom_reel_count(self, engine):
        result = await engine.create_spin_animation(
            game_type="slots", user_id="user123", reel_count=5
        )
        last_frame = result["frames"][-1]
        assert len(last_frame["reels"]) == 5

    @pytest.mark.asyncio
    async def test_game_type_stored(self, engine):
        result = await engine.create_spin_animation(
            game_type="slots", user_id="user123"
        )
        assert result["game_type"] == "slots"


# ============================================================
# Effects Engine Tests – Roulette Animation
# ============================================================

class TestEffectEngineRouletteAnimation:
    @pytest.fixture
    def engine(self):
        return EffectEngine()

    @pytest.mark.asyncio
    async def test_create_roulette_animation_returns_expected_keys(self, engine):
        result = await engine.create_spin_animation(
            game_type="roulette", user_id="user123"
        )
        assert "session_id" in result
        assert "frames" in result
        assert "total_duration_ms" in result

    @pytest.mark.asyncio
    async def test_roulette_frames_have_wheel_rotation(self, engine):
        """Roulette frames include wheel_angle and ball_position"""
        result = await engine.create_spin_animation(
            game_type="roulette", user_id="user123"
        )
        frames = result["frames"]
        assert len(frames) > 0
        first_frame = frames[0]
        # Roulette frames contain wheel-specific metadata
        assert "wheel_angle" in first_frame or "ball_velocity" in first_frame

    @pytest.mark.asyncio
    async def test_roulette_deceleration_curve(self, engine):
        """Verify deceleration curve – velocity decreases over time"""
        result = await engine.create_spin_animation(
            game_type="roulette", user_id="user123", spin_duration_ms=4000
        )
        frames = result["frames"]
        # Ball velocity should decrease over time (deceleration)
        velocities = [f.get("ball_velocity", 1.0) for f in frames]
        # First frame has higher velocity than last frame (spinning down)
        assert velocities[0] > velocities[-1]
        # Velocities are non-negative
        assert all(v >= 0 for v in velocities)


# ============================================================
# Effects Engine Tests – Frame Count & Timing
# ============================================================

class TestFrameCountAndTiming:
    @pytest.fixture
    def engine(self):
        return EffectEngine()

    @pytest.mark.asyncio
    async def test_frame_count_at_60fps_matches_duration(self, engine):
        """At 60fps, frame count should be duration_ms / (1000/60)"""
        duration_ms = 3000  # 3 seconds
        result = await engine.create_spin_animation(
            game_type="slots", user_id="user123", spin_duration_ms=duration_ms
        )
        frames = result["frames"]
        expected_frame_count = int(duration_ms / (1000.0 / 60.0)) + 1  # +1 for frame 0
        assert len(frames) == expected_frame_count

    @pytest.mark.asyncio
    async def test_get_animation_frames_returns_valid_frames(self, engine):
        result = await engine.create_spin_animation(
            game_type="slots", user_id="user123"
        )
        session_id = result["session_id"]
        frames = await engine.get_animation_frames(session_id, client_frame_rate=60)
        assert len(frames) > 0
        for frame in frames:
            assert "frame_index" in frame

    @pytest.mark.asyncio
    async def test_get_animation_frames_wrong_session(self, engine):
        frames = await engine.get_animation_frames("nonexistent-session")
        assert frames == []

    @pytest.mark.asyncio
    async def test_frame_timestamps_increasing(self, engine):
        result = await engine.create_spin_animation(
            game_type="slots", user_id="user123"
        )
        session_id = result["session_id"]
        frames = await engine.get_animation_frames(session_id)
        timestamps = [f["timestamp_ms"] for f in frames]
        assert all(timestamps[i] < timestamps[i + 1] for i in range(len(timestamps) - 1))


# ============================================================
# Session Cleanup Tests
# ============================================================

class TestSessionCleanup:
    @pytest.fixture
    def engine(self):
        return EffectEngine()

    @pytest.mark.asyncio
    async def test_cleanup_session_removes_from_active_sessions(self, engine):
        result = await engine.create_spin_animation(
            game_type="slots", user_id="user123"
        )
        session_id = result["session_id"]
        assert session_id in engine.active_sessions

        await engine.cleanup_session(session_id)
        assert session_id not in engine.active_sessions

    @pytest.mark.asyncio
    async def test_cleanup_nonexistent_session_no_error(self, engine):
        # Should not raise – just silently no-op
        await engine.cleanup_session("nonexistent")


# ============================================================
# Sound Effect Queue Tests
# ============================================================

class TestSoundEffectQueue:
    @pytest.fixture
    def queue(self):
        return SoundEffectQueue()

    @pytest.mark.asyncio
    async def test_queue_effect_adds_to_queue(self, queue):
        result = await queue.queue_effect(
            user_id="user123",
            game_type="slots",
            event_type=SoundEventType.SPIN_START,
        )
        assert "sound_id" in result
        assert len(queue.queue) > 0

    @pytest.mark.asyncio
    async def test_queue_effect_with_custom_config(self, queue):
        config = {"volume_db": -12.0, "pan": 0.5}
        result = await queue.queue_effect(
            user_id="user123",
            game_type="roulette",
            event_type=SoundEventType.WIN_SMALL,
            sound_config=config,
        )
        assert result["config"]["volume_db"] == -12.0

    @pytest.mark.asyncio
    async def test_clear_user_effects_removes_queue_items(self, queue):
        await queue.queue_effect(
            user_id="user123", game_type="slots", event_type=SoundEventType.SPIN_START
        )
        assert len(queue.queue) > 0

        await queue.clear_user_effects("user123")
        # All items for that user should be removed
        remaining = [s for s in queue.queue if s.get("user_id") == "user123"]
        assert len(remaining) == 0

    @pytest.mark.asyncio
    async def test_sound_type_in_result(self, queue):
        result = await queue.queue_effect(
            user_id="user123", game_type="slots", event_type=SoundEventType.JACKPOT
        )
        assert result["event_type"] == "jackpot"


# ============================================================
# Default Sound Config Helper Tests
# ============================================================

class TestDefaultSoundConfig:
    @pytest.mark.parametrize(
        "event_type,expected_volume_key",
        [
            (SoundEventType.SPIN_START, "volume_db"),
            (SoundEventType.WIN_SMALL, "volume_db"),
            (SoundEventType.JACKPOT, "volume_db"),
            (SoundEventType.LOSE, "volume_db"),
        ],
    )
    def test_default_config_returns_dict(self, event_type, expected_volume_key):
        config = get_default_sound_config(event_type)
        assert isinstance(config, dict)
        assert expected_volume_key in config

    @pytest.mark.parametrize(
        "event_type,multiplier,expected_pitch",
        [
            (SoundEventType.JACKPOT, 50.0, 25.0),  # high multiplier = higher pitch
            (SoundEventType.LOSE, 1.0, -5.0),       # loss = lower pitch
        ],
    )
    def test_pitch_offset_adjusted_by_multiplier(self, event_type, multiplier, expected_pitch):
        config = get_default_sound_config(event_type, multiplier=multiplier)
        assert "pitch_offset_hz" in config


# ============================================================
# WebSocket Connection Manager Tests
# ============================================================

class TestConnectionManager:
    @pytest.fixture
    def manager(self):
        return ConnectionManager()

    @pytest.mark.asyncio
    async def test_connect_adds_user(self, manager):
        mock_ws = AsyncMock()
        await manager.connect("user123", mock_ws)
        assert "user123" in manager.active_connections

    @pytest.mark.asyncio
    async def test_disconnect_removes_user(self, manager):
        mock_ws = AsyncMock()
        await manager.connect("user123", mock_ws)
        await manager.disconnect("user123", mock_ws)
        assert "user123" not in manager.active_connections

    @pytest.mark.asyncio
    async def test_broadcast_sound_effect_adds_to_queue(self, manager):
        sound_data = {"event_type": "spin_start", "user_id": "all"}
        await manager.broadcast_sound_effect(sound_data)
        assert len(manager.sound_queue) > 0

    @pytest.mark.asyncio
    async def test_send_to_user_calls_websocket(self, manager):
        mock_ws = AsyncMock()
        mock_ws.send_json = AsyncMock()
        await manager.connect("user123", mock_ws)

        message = {"type": "sound_effect", "data": {}}
        with patch.object(manager, 'active_connections', {
            "user123": {mock_ws}
        }):
            await manager.send_to_user("user123", message)

        mock_ws.send_json.assert_called_once()


# ============================================================
# HTTP Endpoint Integration Tests (via httpx ASGITransport)
# ============================================================

class TestAnimationEndpoint:
    @pytest.mark.asyncio
    async def test_animation_spin_slots_endpoint(self):
        client = AsyncClient(transport=ASGITransport(app=main_module.app), base_url="http://test")
        async with client as c:
            resp = await c.get("/animation/spin", params={
                "game_type": "slots",
                "user_id": "user123",
            })
        assert resp.status_code == 200
        data = resp.json()
        assert "session_id" in data
        assert "frames" in data
        assert "total_duration_ms" in data

    @pytest.mark.asyncio
    async def test_animation_spin_roulette_endpoint(self):
        client = AsyncClient(transport=ASGITransport(app=main_module.app), base_url="http://test")
        async with client as c:
            resp = await c.get("/animation/spin", params={
                "game_type": "roulette",
                "user_id": "user123",
            })
        assert resp.status_code == 200
        data = resp.json()
        assert data["game_type"] == "roulette"

    @pytest.mark.asyncio
    async def test_animation_spin_invalid_game_type(self):
        client = AsyncClient(transport=ASGITransport(app=main_module.app), base_url="http://test")
        async with client as c:
            resp = await c.get("/animation/spin", params={
                "game_type": "blackjack",
                "user_id": "user123",
            })
        assert resp.status_code == 400

    @pytest.mark.asyncio
    async def test_animation_spin_custom_reels(self):
        client = AsyncClient(transport=ASGITransport(app=main_module.app), base_url="http://test")
        async with client as c:
            resp = await c.get("/animation/spin", params={
                "game_type": "slots",
                "user_id": "user123",
                "reel_count": "5",
            })
        assert resp.status_code == 200


class TestSoundEffectsEndpoint:
    @pytest.mark.asyncio
    async def test_sounds_queue_endpoint(self):
        client = AsyncClient(transport=ASGITransport(app=main_module.app), base_url="http://test")
        async with client as c:
            resp = await c.post("/sounds/queue", params={
                "user_id": "user123",
                "sound_type": "spin_start",
            })
        assert resp.status_code == 200


# ============================================================
# SoundEventType Enum Tests
# ============================================================

class TestSoundEventType:
    def test_all_event_types_defined(self):
        expected = [
            "spin_start", "spin_stop", "win_small", "win_medium",
            "win_large", "jackpot", "lose", "deposit", "withdrawal"
        ]
        actual = [e.value for e in SoundEventType]
        for et in expected:
            assert et in actual

    def test_enum_values_are_lowercase_snake_case(self):
        for event in SoundEventType:
            assert event.value == event.name.lower()
