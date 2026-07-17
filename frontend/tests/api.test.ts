import { getBalance, spinSlots, depositFunds, spinRoulette } from '../src/lib/api';

describe('API client', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('getBalance', () => {
    it('calls the correct endpoint with user_id parameter', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ user_id: 'user123', balance: 500 }),
      });
      await getBalance('user456');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/wallet/balance?user_id=')
      );
    });

    it('handles network errors via checkStatus wrapper', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 500 });
      await expect(getBalance('user123')).rejects.toThrow();
    });

    it('returns balance data when response is ok', async () => {
      const expected = { user_id: 'user789', balance: 1000 };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => expected,
      });
      const result = await getBalance('user789');
      expect(result.balance).toBe(1000);
    });
  });

  describe('depositFunds', () => {
    it('calls POST /economy/deposit with amount and user_id', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({ status: 'processing' }) });
      await depositFunds(100);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/economy/deposit?amount=100'),
        { method: 'POST' }
      );
    });

    it('sends the specified amount to endpoint', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({}) });
      await depositFunds(250);
      expect((global.fetch as jest.Mock).mock.calls[0][0]).toContain('amount=250');
    });
  });

  describe('spinSlots', () => {
    it('calls POST /games/slots/spin with bet_amount and user_id', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({ result: 'win', payout: 250, reels: ['🍒','🍒','🍒'] }) });
      await spinSlots(25);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/games/slots/spin?bet_amount='),
        { method: 'POST' }
      );
    });

    it('handles insufficient balance error', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 400 });
      await expect(spinSlots(9999)).rejects.toThrow();
    });
  });

  describe('spinRoulette', () => {
    it('calls POST /games/roulette/spin with straight bet type', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({ result: 'win', payout: 90 }) });
      await spinRoulette('straight', 10, 'user123', 17);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/games/roulette/spin?bet_type=straight'),
        { method: 'POST' }
      );
    });

    it('includes bet_parameter for dozen bets', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({ result: 'loss', payout: 0 }) });
      await spinRoulette('dozen', 10, 'user123', null, 1);
      expect((global.fetch as jest.Mock).mock.calls[0][0]).toContain('bet_parameter=');
    });

    it('handles API errors for roulette', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 400 });
      await expect(spinRoulette('straight', 9999, 'user123')).rejects.toThrow();
    });
  });
});
