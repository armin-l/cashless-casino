import uuid
from typing import List, Dict


class EffectEngine:
    """Handles spin animations and sound effect notifications"""

    def __init__(self):
        self.active_sessions: Dict[str, dict] = {}
        self.sound_queue: List[dict] = []

    async def create_spin_animation(
        self,
        game_type: str,
        user_id: str,
        reel_count: int = 3,
        spin_duration_ms: int = 4000,
    ) -> dict:
        if game_type == "slots":
            return self._create_slots_animation(user_id, reel_count, spin_duration_ms)
        elif game_type == "roulette":
            return self._create_roulette_animation(user_id, spin_duration_ms)
        else:
            raise ValueError(f"Unknown game type: {game_type}")

    def _create_slots_animation(self, user_id: str, reel_count: int, spin_duration_ms: int) -> dict:
        game_type = "slots"
        session_id = str(uuid.uuid4())
        num_frames = int(spin_duration_ms / (1000.0 / 60.0)) + 1
        frame_interval_ms = spin_duration_ms / (num_frames - 1)

        # Staggered stop pattern: left reels stop first, right last
        # Each reel's animation duration is staggered evenly across the total
        reel_stop_delay_factor = 1.0 / max(reel_count - 1, 1)

        frames = []
        for i in range(num_frames):
            timestamp_ms = int(i * frame_interval_ms)
            elapsed_ratio = timestamp_ms / spin_duration_ms if spin_duration_ms > 0 else 1.0

            reels_data = []
            for reel_idx in range(reel_count):
                # Reels stop progressively: first ree stops at ~25% duration, last at 100%
                stop_threshold = 0.25 + (reel_idx * reel_stop_delay_factor * 0.75)

                if elapsed_ratio >= stop_threshold:
                    position = {"type": "final", "symbol_index": i % 6}
                else:
                    position = {"type": "spinning", "symbol_index": i % 12}

                reels_data.append({
                    "reel_index": reel_idx,
                    "position": position,
                })

            frames.append({
                "frame_index": i,
                "timestamp_ms": timestamp_ms,
                "reels": reels_data,
            })

        result = {
            "session_id": session_id,
            "frames": frames,
            "total_duration_ms": spin_duration_ms,
            "game_type": game_type,
        }
        self.active_sessions[session_id] = result
        return result

    def _create_roulette_animation(self, user_id: str, spin_duration_ms: int) -> dict:
        game_type = "roulette"
        session_id = str(uuid.uuid4())
        num_frames = int(spin_duration_ms / (1000.0 / 60.0)) + 1
        frame_interval_ms = spin_duration_ms / (num_frames - 1)

        frames = []
        initial_velocity = 360.0 * 4  # degrees per second, starts fast
        friction = initial_velocity / (spin_duration_ms / 1000.0) ** 2  # quadratic deceleration

        for i in range(num_frames):
            timestamp_ms = int(i * frame_interval_ms)
            elapsed_s = timestamp_ms / 1000.0

            # Quadratic deceleration curve
            velocity = initial_velocity - friction * elapsed_s * 2
            velocity = max(velocity, 0.0)
            wheel_angle = (initial_velocity * elapsed_s - friction * elapsed_s ** 2) % 360
            ball_velocity = max(velocity / initial_velocity, 0.05)

            frames.append({
                "frame_index": i,
                "timestamp_ms": timestamp_ms,
                "wheel_angle": wheel_angle,
                "ball_velocity": ball_velocity,
            })

        result = {
            "session_id": session_id,
            "frames": frames,
            "total_duration_ms": spin_duration_ms,
            "game_type": game_type,
        }
        self.active_sessions[session_id] = result
        return result

    async def get_animation_frames(self, session_id: str, client_frame_rate: int = 60) -> list:
        if session_id not in self.active_sessions:
            return []
        session = self.active_sessions[session_id]
        return session.get("frames", [])

    async def cleanup_session(self, session_id: str):
        self.active_sessions.pop(session_id, None)
