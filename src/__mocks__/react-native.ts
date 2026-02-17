/**
 * Manual mock for react-native.
 *
 * This mock is used by Jest (via moduleNameMapper) so tests can run
 * without installing the real react-native package.
 *
 * Provides both TurboModuleRegistry (new arch) and NativeModules (old arch)
 * resolution paths, both pointing to the same mock module.
 */

const mockMyIdModule = {
  start: jest.fn(),
};

export const NativeModules = {
  MyIdModule: mockMyIdModule,
};

export const TurboModuleRegistry = {
  getEnforcing: (_name: string) => mockMyIdModule,
  get: (_name: string) => mockMyIdModule,
};

export const Platform = {
  OS: 'ios' as const,
  select: (spec: Record<string, unknown>) => spec.ios,
};
