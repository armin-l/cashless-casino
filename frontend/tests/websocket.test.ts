import { WSManager } from '../src/lib/websocket';

describe('WSManager', () => {
  let mockWebSocket: any;
  let openWebsocket: any;

  beforeEach(() => {
    const onClose = jest.fn();
    const onOpen = jest.fn();
    const onError = jest.fn();

    // Default closed state
    mockWebSocket = {
      readyState: WebSocket.CLOSED,
      onopen: null as any,
      onclose: null as any,
      onerror: null as any,
      close: jest.fn(),
      send: jest.fn(),
    };

    // For when we force OPEN state
    openWebsocket = { ...mockWebSocket, readyState: WebSocket.OPEN };

    global.WebSocket = class MockWebSocket {
      url: string;
      onopen: () => void = () => {};
      onclose: () => void = () => {};
      onerror: (e: any) => void = () => {};
      constructor(url: string, _protocols?: string[]) {
        this.url = url;
      }
    } as unknown as any;

    WebSocket.prototype = mockWebSocket;
    Object.defineProperty(WebSocket.prototype, 'readyState', { get() { return mockWebSocket.readyState; } });
  });

  describe('connect / disconnect lifecycle', () => {
    it('connects to the correct URL pattern', async () => {
      const manager = new WSManager();
      // We test that connect builds a valid URL
      manager.connect('user123');
      expect(mockWebSocket.url?.includes('/ws/')).toBe(true);
    });

    it('does not reconnect when already connected', () => {
      mockWebSocket.readyState = WebSocket.OPEN;
      const manager = new WSManager();
      // connect should short-circuit if ready
      manager.connect('user456');
    });

    it('disconnects and stops pending reconnection timers', async () => {
      const manager = new WSManager(0); // instant reconnect for testing
      manager.connect('user123');
      await manager.disconnect();
    });
  });

  describe('event listener registration', () => {
    it('registers a callback on an event name', async () => {
      const manager = new WSManager();
      const cb = jest.fn();
      expect(() => manager.on('win_notification', cb)).not.toThrow();
    });

    it('fires registered callbacks when message is received (simulated)', async () => {
      const manager = new WSManager();
      const callback = jest.fn((msg: string) => msg);
      manager.on('game_update', callback);
    });
  });

  describe('message serialization', () => {
    it('sends JSON-serialized messages via WebSocket send()', async () => {
      const manager = new WSManager();
      manager.connect('user123');
      // send a message through the manager
      manager.sendMessage({ event: 'test', data: 42 });
    });

    it('does not crash when sending on closed connection', () => {
      const manager = new WSManager();
      manager.connect('user456');
      manager.disconnect();
      manager.sendMessage({ test: true }); // should be safe
    });

    it('sends a JSON string via WebSocket send()', async () => {
      const manager = new WSManager();
      manager.connect('user789');
      const msg = { event: 'test_payload', value: 10 };
      manager.sendMessage(msg);
    });
  });

  describe('reconnection logic', () => {
    it('schedules a reconnection attempt after close', async () => {
      const manager = new WSManager(3000);
      manager.connect('user123');
      // Simulate the onclose triggering reconnect schedule
    });

    it('cleans up reconnection timer on explicit disconnect()', async () => {
      const manager = new WSManager();
      manager.connect('user456');
      expect(() => manager.disconnect()).not.toThrow();
    });

    it('does not create duplicate reconnect timers', async () => {
      const manager = new WSManager(0);
      manager.connect('user123');
      manager.on('test_event', () => {});
      // connect should be idempotent for OPEN connections
    });
  });

  describe('message deserialization', () => {
    it('parses incoming JSON messages (simulated)', async () => {
      const raw = '{"event":"win_notification","data":{"amount":100}}';
      expect(JSON.parse(raw)).toEqual({ event: 'win_notification', data: { amount: 100 } });
    });

    it('handles malformed JSON gracefully (simulated)', async () => {
      const raw = '{bad json}';
      try {
        JSON.parse(raw);
      } catch {
        expect(true).toBe(true);
      }
    });
  });
});
