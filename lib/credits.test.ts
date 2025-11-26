import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getCredits,
  awardCredits,
  ensureTrial,
  tryDebit,
  refund,
  getRegenCount,
  incrementRegen,
  getDailyUsage,
  getDailyRemaining,
  todayYMD,
  sessionHashFromPrompt,
} from './credits';

// Mock @upstash/redis
vi.mock('@upstash/redis', () => {
  const mockRedis = {
    get: vi.fn(),
    set: vi.fn(),
    incrby: vi.fn(),
    incr: vi.fn(),
    expire: vi.fn(),
    eval: vi.fn(),
  };

  return {
    Redis: {
      fromEnv: vi.fn(() => mockRedis),
    },
  };
});

// Import mocked redis instance for test manipulation
import { Redis } from '@upstash/redis';
const mockRedis = Redis.fromEnv() as unknown as {
  get: ReturnType<typeof vi.fn>;
  set: ReturnType<typeof vi.fn>;
  incrby: ReturnType<typeof vi.fn>;
  incr: ReturnType<typeof vi.fn>;
  expire: ReturnType<typeof vi.fn>;
  eval: ReturnType<typeof vi.fn>;
};

describe('credits.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('todayYMD', () => {
    it('should return YYYYMMDD format', () => {
      const result = todayYMD();
      expect(result).toMatch(/^\d{8}$/);
    });
  });

  describe('getCredits', () => {
    it('should return credit balance when exists', async () => {
      mockRedis.get.mockResolvedValueOnce(100);
      const result = await getCredits('user123');
      expect(result).toBe(100);
      expect(mockRedis.get).toHaveBeenCalledWith('credits:user123');
    });

    it('should return 0 when no balance exists', async () => {
      mockRedis.get.mockResolvedValueOnce(null);
      const result = await getCredits('user123');
      expect(result).toBe(0);
    });
  });

  describe('awardCredits', () => {
    it('should increment credit balance', async () => {
      mockRedis.incrby.mockResolvedValueOnce(150);
      const result = await awardCredits('user123', 50);
      expect(result).toBe(150);
      expect(mockRedis.incrby).toHaveBeenCalledWith('credits:user123', 50);
    });
  });

  describe('ensureTrial', () => {
    it('should grant trial credits on first call', async () => {
      mockRedis.set.mockResolvedValueOnce('OK');
      mockRedis.incrby.mockResolvedValueOnce(2);

      const result = await ensureTrial('user123', 2);

      expect(result).toEqual({ granted: true, balance: 2 });
      expect(mockRedis.set).toHaveBeenCalledWith('trial:granted:user123', '1', { nx: true });
      expect(mockRedis.incrby).toHaveBeenCalledWith('credits:user123', 2);
    });

    it('should not grant trial credits twice', async () => {
      mockRedis.set.mockResolvedValueOnce(null); // nx: true fails
      mockRedis.get.mockResolvedValueOnce(5); // existing balance

      const result = await ensureTrial('user123', 2);

      expect(result).toEqual({ granted: false, balance: 5 });
      expect(mockRedis.incrby).not.toHaveBeenCalled();
    });
  });

  describe('getDailyUsage', () => {
    it('should return daily usage count', async () => {
      mockRedis.get.mockResolvedValueOnce(3);
      const result = await getDailyUsage('user123');
      expect(result).toBe(3);
    });

    it('should return 0 when no usage exists', async () => {
      mockRedis.get.mockResolvedValueOnce(null);
      const result = await getDailyUsage('user123');
      expect(result).toBe(0);
    });
  });

  describe('getDailyRemaining', () => {
    it('should calculate remaining daily quota', async () => {
      mockRedis.get.mockResolvedValueOnce(3); // used 3
      const result = await getDailyRemaining('user123', 10); // cap is 10
      expect(result).toBe(7);
    });

    it('should return 0 when cap exceeded', async () => {
      mockRedis.get.mockResolvedValueOnce(12); // used 12
      const result = await getDailyRemaining('user123', 10); // cap is 10
      expect(result).toBe(0);
    });
  });

  describe('tryDebit', () => {
    it('should succeed when balance is sufficient', async () => {
      // Lua script returns new balance (50 - 10 = 40)
      mockRedis.eval.mockResolvedValueOnce(40);
      mockRedis.incrby.mockResolvedValueOnce(10); // daily usage

      const result = await tryDebit('user123', 10);

      expect(result).toEqual({
        ok: true,
        remaining: 40,
        dailyRemaining: undefined,
      });
      expect(mockRedis.eval).toHaveBeenCalled();
      expect(mockRedis.incrby).toHaveBeenCalled();
      expect(mockRedis.expire).toHaveBeenCalled();
    });

    it('should fail when insufficient credits', async () => {
      // Lua script returns -1 (insufficient balance)
      mockRedis.eval.mockResolvedValueOnce(-1);
      mockRedis.get.mockResolvedValueOnce(5); // current balance

      const result = await tryDebit('user123', 10);

      expect(result).toEqual({
        ok: false,
        remaining: 5,
        reason: 'insufficient-credits',
      });
      expect(mockRedis.incrby).not.toHaveBeenCalled(); // daily usage not incremented
    });

    it('should fail when daily cap exceeded', async () => {
      mockRedis.get.mockResolvedValueOnce(9); // daily usage: 9
      mockRedis.get.mockResolvedValueOnce(50); // user balance

      const result = await tryDebit('user123', 5, { dailyCap: 10 });

      expect(result).toEqual({
        ok: false,
        remaining: 50,
        dailyRemaining: 1,
        reason: 'daily-cap-exceeded',
      });
      expect(mockRedis.eval).not.toHaveBeenCalled(); // main debit not attempted
    });

    it('should succeed with daily cap when quota available', async () => {
      mockRedis.get.mockResolvedValueOnce(3); // daily usage: 3
      mockRedis.eval.mockResolvedValueOnce(40); // new balance
      mockRedis.incrby.mockResolvedValueOnce(8); // daily usage after debit

      const result = await tryDebit('user123', 5, { dailyCap: 10 });

      expect(result).toEqual({
        ok: true,
        remaining: 40,
        dailyRemaining: 2, // 10 - 8 = 2
      });
    });

    it('should handle zero balance correctly', async () => {
      mockRedis.eval.mockResolvedValueOnce(-1); // insufficient
      mockRedis.get.mockResolvedValueOnce(0); // zero balance

      const result = await tryDebit('user123', 1);

      expect(result).toEqual({
        ok: false,
        remaining: 0,
        reason: 'insufficient-credits',
      });
    });
  });

  describe('refund', () => {
    it('should add credits back to balance', async () => {
      mockRedis.incrby.mockResolvedValueOnce(60); // 50 + 10

      const result = await refund('user123', 10);

      expect(result).toBe(60);
      expect(mockRedis.incrby).toHaveBeenCalledWith('credits:user123', 10);
    });
  });

  describe('sessionHashFromPrompt', () => {
    it('should generate consistent hash for same prompt', async () => {
      const prompt = 'test prompt';
      const hash1 = await sessionHashFromPrompt(prompt);
      const hash2 = await sessionHashFromPrompt(prompt);

      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(16);
      expect(hash1).toMatch(/^[0-9a-f]{16}$/);
    });

    it('should generate different hashes for different prompts', async () => {
      const hash1 = await sessionHashFromPrompt('prompt A');
      const hash2 = await sessionHashFromPrompt('prompt B');

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('getRegenCount', () => {
    it('should return regeneration count', async () => {
      mockRedis.get.mockResolvedValueOnce(2);
      const result = await getRegenCount('user123', 'abc123');
      expect(result).toBe(2);
      expect(mockRedis.get).toHaveBeenCalledWith('regen:user123:abc123');
    });

    it('should return 0 when no regenerations exist', async () => {
      mockRedis.get.mockResolvedValueOnce(null);
      const result = await getRegenCount('user123', 'abc123');
      expect(result).toBe(0);
    });
  });

  describe('incrementRegen', () => {
    it('should increment regeneration count', async () => {
      mockRedis.incr.mockResolvedValueOnce(3);

      const result = await incrementRegen('user123', 'abc123');

      expect(result).toBe(3);
      expect(mockRedis.incr).toHaveBeenCalledWith('regen:user123:abc123');
    });

    it('should set TTL on first regeneration', async () => {
      mockRedis.incr.mockResolvedValueOnce(1); // first regen

      await incrementRegen('user123', 'abc123', 3600);

      expect(mockRedis.expire).toHaveBeenCalledWith('regen:user123:abc123', 3600);
    });

    it('should not set TTL on subsequent regenerations', async () => {
      mockRedis.incr.mockResolvedValueOnce(2); // not first

      await incrementRegen('user123', 'abc123');

      expect(mockRedis.expire).not.toHaveBeenCalled();
    });

    it('should use default TTL of 86400 seconds', async () => {
      mockRedis.incr.mockResolvedValueOnce(1);

      await incrementRegen('user123', 'abc123'); // no TTL param

      expect(mockRedis.expire).toHaveBeenCalledWith('regen:user123:abc123', 86400);
    });
  });

  describe('Lua script behavior (integration-style)', () => {
    it('should use atomic check-and-decrement pattern', async () => {
      mockRedis.eval.mockResolvedValueOnce(90);
      mockRedis.incrby.mockResolvedValueOnce(10);

      await tryDebit('user123', 10);

      const evalCall = mockRedis.eval.mock.calls[0];
      const [script, keys, args] = evalCall;

      // Verify script structure
      expect(script).toContain('redis.call');
      expect(script).toContain('DECRBY');
      expect(script).toContain('return -1'); // insufficient credits path

      // Verify correct keys and args
      expect(keys).toEqual(['credits:user123']);
      expect(args).toEqual(['10']);
    });
  });
});
