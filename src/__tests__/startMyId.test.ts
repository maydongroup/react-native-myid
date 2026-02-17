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
    clientId: 'test-client',
    sessionId: 'test-session',
    ...overrides,
  };
}

function hashConfig(overrides: Partial<MyIdHashConfig> = {}): MyIdHashConfig {
  return {
    clientId: 'test-client',
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
      expect(result.comparison).toBeUndefined();
      expect(result.image).toBeUndefined();
    });

    it('should return code on success (hash flow)', async () => {
      mockStart.mockResolvedValue({ code: 'def456' });

      const result = await startMyId(hashConfig());
      expect(result.code).toBe('def456');
    });

    it('should return comparison as a number', async () => {
      mockStart.mockResolvedValue({ code: 'abc', comparison: 0.92 });

      const result = await startMyId(sessionConfig());
      expect(result.comparison).toBe(0.92);
    });

    it('should return image when provided', async () => {
      mockStart.mockResolvedValue({ code: 'abc', image: 'base64data' });

      const result = await startMyId(sessionConfig({ withPhoto: true }));
      expect(result.image).toBe('base64data');
    });

    it('should convert string comparison to number', async () => {
      // Some native platforms may return comparison as string
      mockStart.mockResolvedValue({ code: 'abc', comparison: '0.85' });

      const result = await startMyId(sessionConfig());
      expect(result.comparison).toBe(0.85);
      expect(typeof result.comparison).toBe('number');
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

    it('should set defaults for entryType, buildMode, withPhoto', async () => {
      mockStart.mockResolvedValue({ code: 'abc' });

      await startMyId(sessionConfig());
      const sentConfig = mockStart.mock.calls[0][0];

      expect(sentConfig.entryType).toBe('AUTH');
      expect(sentConfig.buildMode).toBe('PRODUCTION');
      expect(sentConfig.withPhoto).toBe(false);
    });

    it('should forward optional fields when provided', async () => {
      mockStart.mockResolvedValue({ code: 'abc' });

      await startMyId(
        sessionConfig({
          passportData: 'AA1234567',
          birthDate: '01.01.1990',
          sdkHash: 'a'.repeat(32),
          externalId: '550e8400-e29b-41d4-a716-446655440000',
          threshold: 0.75,
          locale: 'en' as any,
          cameraShape: 'ELLIPSE' as any,
        }),
      );
      const sentConfig = mockStart.mock.calls[0][0];

      expect(sentConfig.passportData).toBe('AA1234567');
      expect(sentConfig.birthDate).toBe('01.01.1990');
      expect(sentConfig.sdkHash).toBe('a'.repeat(32));
      expect(sentConfig.externalId).toBe('550e8400-e29b-41d4-a716-446655440000');
      expect(sentConfig.threshold).toBe(0.75);
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
    it('should throw before calling native when clientId is empty', async () => {
      await expect(startMyId({ ...sessionConfig(), clientId: '' })).rejects.toThrow(
        'clientId is required',
      );

      expect(mockStart).not.toHaveBeenCalled();
    });

    it('should throw before calling native when threshold is out of range', async () => {
      await expect(startMyId(sessionConfig({ threshold: 2.0 }))).rejects.toThrow(
        'threshold must be a number',
      );

      expect(mockStart).not.toHaveBeenCalled();
    });
  });
});
