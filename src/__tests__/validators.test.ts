/**
 * Tests for runtime validators.
 */
import { validateConfig } from '../validators';
import type { MyIdSessionConfig, MyIdHashConfig } from '../types';

// ---------------------------------------------------------------------------
// Helper to build a minimal valid session config
// ---------------------------------------------------------------------------
function validSessionConfig(
  overrides: Partial<MyIdSessionConfig> = {},
): MyIdSessionConfig {
  return {
    sessionId: 'test-session-id',
    ...overrides,
  };
}

function validHashConfig(overrides: Partial<MyIdHashConfig> = {}): MyIdHashConfig {
  return {
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
