export class WSManager {
  private ws: WebSocket | null = null;
  private reconnectInterval: number;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private userId: string | null = null;
  private listeners: Map<string, Function[]> = new Map();

  constructor(reconnectMs = 3000) {
    this.reconnectInterval = reconnectMs;
  }

  connect(userId: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) return;
    this.userId = userId;
    const url = `ws://${location.host}/ws/${userId}`;
    this.ws = new WebSocket(url);
    this.ws.onopen = () => {};
    this.ws.onclose = () => {
      this.scheduleReconnect(userId);
    };
    this.ws.onerror = (err) => {
      console.error('WebSocket error', err);
      this.ws?.close();
    };
  }

  disconnect(): void {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  on(event: string, cb: Function): void {
    const list = this.listeners.get(event);
    if (!list) this.listeners.set(event, [cb]);
    else if (!list.includes(cb)) list.push(cb);
  }

  private scheduleReconnect(userId: string): void {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      this.connect(userId);
    }, this.reconnectInterval);
  }

  sendMessage(message: unknown): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(JSON.stringify(message));
  }
}
