/**
 * Tests for startMyId() — config building, success/error paths.
 */

// The manual mock at src/__mocks__/react-native.ts is used via moduleNameMapper.
// We import NativeModules to grab the mocked `start` function.
import { NativeModules } from 'react-native';

import { startMyId } from '../MyIdModule';
import { MyIdError, MyIdErrorCodes } from '../types';
import type { MyIdSessionConfig, MyIdHashConfig } from '../types';

const mockStart = NativeModules.MyIdModule.start as jest.Mock;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sessionConfig(overrides: Partial<MyIdSessionConfig> = {}): MyIdSessionConfig {
  return {
    sessionId: 'test-session',
    ...overrides,
  };
}

function hashConfig(overrides: Partial<MyIdHashConfig> = {}): MyIdHashConfig {
  return {
    clientHash: 'test-hash',
    clientHashId: 'test-slug',
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('startMyId', () => {
  beforeEach(() => {
    mockStart.mockReset();
  });

  // ── Success path ──────────────────────────────────────────────────────

  describe('success', () => {
    it('should return code on success (session flow)', async () => {
      mockStart.mockResolvedValue({ code: 'abc123' });

      const result = await startMyId(sessionConfig());
      expect(result.code).toBe('abc123');
      expect(result.image).toBeUndefined();
    });

    it('should return code on success (hash flow)', async () => {
      mockStart.mockResolvedValue({ code: 'def456' });

      const result = await startMyId(hashConfig());
      expect(result.code).toBe('def456');
    });

    it('should return image when provided', async () => {
      mockStart.mockResolvedValue({ code: 'abc', image: 'base64data' });

      const result = await startMyId(sessionConfig());
      expect(result.image).toBe('base64data');
    });
  });

  // ── Native config building ────────────────────────────────────────────

  describe('native config', () => {
    it('should send sessionId for session flow', async () => {
      mockStart.mockResolvedValue({ code: 'abc' });

      await startMyId(sessionConfig());
      const sentConfig = mockStart.mock.calls[0][0];

      expect(sentConfig.sessionId).toBe('test-session');
      expect(sentConfig.clientHash).toBeUndefined();
      expect(sentConfig.clientHashId).toBeUndefined();
    });

    it('should send clientHash + clientHashId for hash flow', async () => {
      mockStart.mockResolvedValue({ code: 'abc' });

      await startMyId(hashConfig());
      const sentConfig = mockStart.mock.calls[0][0];

      expect(sentConfig.clientHash).toBe('test-hash');
      expect(sentConfig.clientHashId).toBe('test-slug');
      expect(sentConfig.sessionId).toBeUndefined();
    });

    it('should set defaults for entryType and buildMode', async () => {
      mockStart.mockResolvedValue({ code: 'abc' });

      await startMyId(sessionConfig());
      const sentConfig = mockStart.mock.calls[0][0];

      expect(sentConfig.entryType).toBe('IDENTIFICATION');
      expect(sentConfig.buildMode).toBe('PRODUCTION');
    });

    it('should forward optional fields when provided', async () => {
      mockStart.mockResolvedValue({ code: 'abc' });

      await startMyId(
        sessionConfig({
          locale: 'en' as any,
          cameraShape: 'ELLIPSE' as any,
        }),
      );
      const sentConfig = mockStart.mock.calls[0][0];

      expect(sentConfig.locale).toBe('en');
      expect(sentConfig.cameraShape).toBe('ELLIPSE');
    });
  });

  // ── Error handling ────────────────────────────────────────────────────

  describe('errors', () => {
    it('should throw MyIdError on user exit', async () => {
      mockStart.mockRejectedValue({ code: 'MYID_USER_EXITED', message: 'User exited' });

      try {
        await startMyId(sessionConfig());
        fail('Should have thrown');
      } catch (err) {
        expect(err).toBeInstanceOf(MyIdError);
        const myIdErr = err as MyIdError;
        expect(myIdErr.code).toBe(MyIdErrorCodes.USER_EXITED);
        expect(myIdErr.isUserExit).toBe(true);
      }
    });

    it('should throw MyIdError with numeric code on SDK error', async () => {
      mockStart.mockRejectedValue({ code: '3', message: 'Liveness failed' });

      try {
        await startMyId(sessionConfig());
        fail('Should have thrown');
      } catch (err) {
        expect(err).toBeInstanceOf(MyIdError);
        const myIdErr = err as MyIdError;
        expect(myIdErr.code).toBe(3);
        expect(myIdErr.message).toBe('Liveness failed');
        expect(myIdErr.isUserExit).toBe(false);
      }
    });

    it('should fall back to SDK_ERROR code for non-numeric codes', async () => {
      mockStart.mockRejectedValue({ code: 'UNKNOWN', message: 'Something went wrong' });

      try {
        await startMyId(sessionConfig());
        fail('Should have thrown');
      } catch (err) {
        expect(err).toBeInstanceOf(MyIdError);
        const myIdErr = err as MyIdError;
        expect(myIdErr.code).toBe(MyIdErrorCodes.SDK_ERROR);
      }
    });

    it('should wrap unknown errors as MyIdError', async () => {
      mockStart.mockRejectedValue(new Error('Some native crash'));

      try {
        await startMyId(sessionConfig());
        fail('Should have thrown');
      } catch (err) {
        expect(err).toBeInstanceOf(MyIdError);
        const myIdErr = err as MyIdError;
        expect(myIdErr.code).toBe(MyIdErrorCodes.SDK_ERROR);
        expect(myIdErr.message).toBe('Some native crash');
      }
    });
  });

  // ── Validation integration ────────────────────────────────────────────

  describe('validation', () => {
    it('should throw when neither sessionId nor clientHash is provided', async () => {
      await expect(startMyId({} as any)).rejects.toThrow(
        'must provide either',
      );

      expect(mockStart).not.toHaveBeenCalled();
    });
  });
});
