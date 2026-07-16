import uuid
from enum import Enum
from typing import Dict, List, Optional


class SoundEventType(Enum):
    SPIN_START = "spin_start"
    SPIN_STOP = "spin_stop"
    WIN_SMALL = "win_small"       # win < 3x bet
    WIN_MEDIUM = "win_medium"      # 3x <= win < 10x bet
    WIN_LARGE = "win_large"        # 10x <= win < 50x bet
    JACKPOT = "jackpot"            # >= 50x bet or progressive jackpot
    LOSE = "lose"
    DEPOSIT = "deposit"
    WITHDRAWAL = "withdrawal"


class SoundEffect:
    def __init__(self, sound_type: SoundEventType, volume_db: float = -6.0, pan: float = 0.0, pitch_offset: float = 0.0, loop: bool = False):
        self.sound_id = str(uuid.uuid4())
        self.sound_type = sound_type
        self.volume_db = volume_db
        self.pan = pan
        self.pitch_offset = pitch_offset
        self.loop = loop


class SoundEffectQueue:
    """Manages queued sound effects for real-time playback"""

    def __init__(self):
        self.queue: List[dict] = []
        self.active_sounds: Dict[str, dict] = {}

    async def queue_effect(
        self,
        user_id: str,
        game_type: str,
        event_type: SoundEventType,
        sound_config: Optional[dict] = None,
    ) -> dict:
        default_config = get_default_sound_config(event_type)
        config = {**default_config}

        if sound_config is not None:
            config.update(sound_config)

        sound_id = str(uuid.uuid4())
        entry = {
            "sound_id": sound_id,
            "user_id": user_id,
            "game_type": game_type,
            "event_type": event_type.value,
            "config": config,
        }
        self.queue.append(entry)
        return entry

    async def clear_user_effects(self, user_id: str):
        self.queue = [s for s in self.queue if s.get("user_id") != user_id]


def get_default_sound_config(event_type: SoundEventType, multiplier: float = 1.0) -> dict:
    """Map game events to default sound effect parameters."""
    base_volume_map = {
        SoundEventType.SPIN_START: -3.0,
        SoundEventType.SPIN_STOP: -6.0,
        SoundEventType.WIN_SMALL: -6.0,
        SoundEventType.WIN_MEDIUM: -9.0,
        SoundEventType.WIN_LARGE: -12.0,
        SoundEventType.JACKPOT: 0.0,
        SoundEventType.LOSE: -15.0,
        SoundEventType.DEPOSIT: -6.0,
        SoundEventType.WITHDRAWAL: -9.0,
    }

    base_pitch_map = {
        SoundEventType.SPIN_START: 0.0,
        SoundEventType.SPIN_STOP: -5.0,
        SoundEventType.WIN_SMALL: 5.0,
        SoundEventType.WIN_MEDIUM: 10.0,
        SoundEventType.WIN_LARGE: 15.0,
        SoundEventType.JACKPOT: 25.0,
        SoundEventType.LOSE: -5.0,
        SoundEventType.DEPOSIT: 3.0,
        SoundEventType.WITHDRAWAL: -3.0,
    }

    volume = base_volume_map.get(event_type, -6.0)
    pitch_offset = base_pitch_map.get(event_type, 0.0)

    # Adjust pitch by multiplier for win events
    if event_type in (SoundEventType.WIN_SMALL, SoundEventType.WIN_MEDIUM, SoundEventType.WIN_LARGE):
        pitch_adjusted = pitch_offset + (multiplier * 0.5)
    else:
        pitch_adjusted = pitch_offset

    return {
        "volume_db": volume,
        "pan": 0.0,
        "pitch_offset_hz": pitch_adjusted,
        "loop": False,
    }
