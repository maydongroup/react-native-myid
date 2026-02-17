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
    clientId: 'test-client-id',
    sessionId: 'test-session-id',
    ...overrides,
  };
}

function validHashConfig(overrides: Partial<MyIdHashConfig> = {}): MyIdHashConfig {
  return {
    clientId: 'test-client-id',
    clientHash: 'test-hash',
    clientHashId: 'test-slug',
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('validateConfig', () => {
  describe('clientId', () => {
    it('should throw when clientId is empty', () => {
      expect(() => validateConfig({ ...validSessionConfig(), clientId: '' })).toThrow(
        'clientId is required',
      );
    });

    it('should throw when clientId is whitespace', () => {
      expect(() => validateConfig({ ...validSessionConfig(), clientId: '   ' })).toThrow(
        'clientId is required',
      );
    });

    it('should pass for valid clientId', () => {
      expect(() => validateConfig(validSessionConfig())).not.toThrow();
    });
  });

  describe('threshold', () => {
    it('should throw when threshold is below 0.50', () => {
      expect(() => validateConfig(validSessionConfig({ threshold: 0.1 }))).toThrow(
        'threshold must be a number between 0.5 and 0.99',
      );
    });

    it('should throw when threshold is above 0.99', () => {
      expect(() => validateConfig(validSessionConfig({ threshold: 1.5 }))).toThrow(
        'threshold must be a number between 0.5 and 0.99',
      );
    });

    it('should throw when threshold is NaN', () => {
      expect(() => validateConfig(validSessionConfig({ threshold: NaN }))).toThrow(
        'threshold must be a number between 0.5 and 0.99',
      );
    });

    it('should pass for threshold at lower bound (0.50)', () => {
      expect(() => validateConfig(validSessionConfig({ threshold: 0.5 }))).not.toThrow();
    });

    it('should pass for threshold at upper bound (0.99)', () => {
      expect(() => validateConfig(validSessionConfig({ threshold: 0.99 }))).not.toThrow();
    });

    it('should pass when threshold is undefined', () => {
      expect(() =>
        validateConfig(validSessionConfig({ threshold: undefined })),
      ).not.toThrow();
    });
  });

  describe('birthDate', () => {
    it('should throw for YYYY-MM-DD format', () => {
      expect(() =>
        validateConfig(validSessionConfig({ birthDate: '1990-01-01' })),
      ).toThrow('dd.MM.yyyy');
    });

    it('should throw for MM/DD/YYYY format', () => {
      expect(() =>
        validateConfig(validSessionConfig({ birthDate: '01/01/1990' })),
      ).toThrow('dd.MM.yyyy');
    });

    it('should pass for dd.MM.yyyy format', () => {
      expect(() =>
        validateConfig(validSessionConfig({ birthDate: '01.01.1990' })),
      ).not.toThrow();
    });

    it('should pass when birthDate is undefined', () => {
      expect(() =>
        validateConfig(validSessionConfig({ birthDate: undefined })),
      ).not.toThrow();
    });
  });

  describe('externalId', () => {
    it('should throw when externalId is not 36 chars', () => {
      expect(() =>
        validateConfig(validSessionConfig({ externalId: 'too-short' })),
      ).toThrow('36 characters');
    });

    it('should pass for valid UUID4 length', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      expect(() =>
        validateConfig(validSessionConfig({ externalId: uuid })),
      ).not.toThrow();
    });

    it('should pass when externalId is undefined', () => {
      expect(() =>
        validateConfig(validSessionConfig({ externalId: undefined })),
      ).not.toThrow();
    });
  });

  describe('sdkHash', () => {
    it('should throw when sdkHash is not 32 chars', () => {
      expect(() => validateConfig(validSessionConfig({ sdkHash: 'short' }))).toThrow(
        '32 characters',
      );
    });

    it('should pass for 32-char sdkHash', () => {
      const hash = 'a'.repeat(32);
      expect(() => validateConfig(validSessionConfig({ sdkHash: hash }))).not.toThrow();
    });

    it('should pass when sdkHash is undefined', () => {
      expect(() =>
        validateConfig(validSessionConfig({ sdkHash: undefined })),
      ).not.toThrow();
    });
  });

  describe('both config flows', () => {
    it('should validate session config', () => {
      expect(() => validateConfig(validSessionConfig())).not.toThrow();
    });

    it('should validate hash config', () => {
      expect(() => validateConfig(validHashConfig())).not.toThrow();
    });
  });
});
