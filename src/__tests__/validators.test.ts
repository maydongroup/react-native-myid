/**
 * Tests for runtime validators.
 */
import { validateConfig } from '../validators';
import type { MyIdConfig } from '../types';

// ---------------------------------------------------------------------------
// Helper to build a minimal valid config
// ---------------------------------------------------------------------------
function validSessionConfig(
  overrides: Partial<MyIdConfig> = {},
): MyIdConfig {
  return {
    sessionId: 'test-session-id',
    ...overrides,
  };
}

function validHashConfig(overrides: Partial<MyIdConfig> = {}): MyIdConfig {
  return {
    clientHash: 'test-hash',
    clientHashId: 'test-slug',
    ...overrides,
  };
}

function validFullConfig(overrides: Partial<MyIdConfig> = {}): MyIdConfig {
  return {
    sessionId: 'test-session-id',
    clientHash: 'test-hash',
    clientHashId: 'test-slug',
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('validateConfig', () => {
  describe('flow validation', () => {
    it('should pass for valid session config', () => {
      expect(() => validateConfig(validSessionConfig())).not.toThrow();
    });

    it('should pass for valid hash config', () => {
      expect(() => validateConfig(validHashConfig())).not.toThrow();
    });

    it('should pass when all three (sessionId + clientHash + clientHashId) are provided', () => {
      expect(() => validateConfig(validFullConfig())).not.toThrow();
    });

    it('should throw when neither sessionId nor clientHash is provided', () => {
      expect(() => validateConfig({} as any)).toThrow('must provide either');
    });

    it('should throw when sessionId is empty string', () => {
      expect(() => validateConfig({ sessionId: '' } as any)).toThrow(
        'must provide either',
      );
    });

    it('should throw when clientHash is provided without clientHashId', () => {
      expect(() =>
        validateConfig({ clientHash: 'hash' } as any),
      ).toThrow('must provide either');
    });
  });
});
