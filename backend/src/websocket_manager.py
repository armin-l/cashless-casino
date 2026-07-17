from typing import Dict, List, Set


try:
    import websockets as _websockets_module
    HAS_WEBSOCKETS = True
except ImportError:
    HAS_WEBSOCKETS = False
    _websockets_module = None  # type: ignore


class ConnectionManager:
    """Manages WebSocket connections for real-time sound/animation streaming"""

    def __init__(self):
        self.active_connections: Dict[str, Set] = {}
        self.sound_queue: List[dict] = []

    async def connect(self, user_id: str, websocket):
        if user_id not in self.active_connections:
            self.active_connections[user_id] = set()
        self.active_connections[user_id].add(websocket)

    async def disconnect(self, user_id: str, websocket):
        if user_id in self.active_connections:
            self.active_connections[user_id].discard(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]

    async def broadcast_sound_effect(self, sound_data: dict):
        self.sound_queue.append(sound_data)

    async def send_to_user(self, user_id: str, message: dict):
        connections = self.active_connections.get(user_id, set())
        for ws in connections:
            try:
                await ws.send_json(message)
            except Exception:
                pass
