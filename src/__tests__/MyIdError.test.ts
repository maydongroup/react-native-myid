/**
 * Tests for MyIdError class behavior.
 */
import { MyIdError, MyIdErrorCodes } from '../types';

describe('MyIdError', () => {
  it('should be an instance of Error', () => {
    const err = new MyIdError(101, 'test');
    expect(err).toBeInstanceOf(Error);
  });

  it('should be an instance of MyIdError', () => {
    const err = new MyIdError(101, 'test');
    expect(err).toBeInstanceOf(MyIdError);
  });

  it('should set name to "MyIdError"', () => {
    const err = new MyIdError(101, 'test');
    expect(err.name).toBe('MyIdError');
  });

  it('should expose code and message', () => {
    const err = new MyIdError(3, 'Liveness failed');
    expect(err.code).toBe(3);
    expect(err.message).toBe('Liveness failed');
  });

  it('should set isUserExit = true for USER_EXITED code', () => {
    const err = new MyIdError(MyIdErrorCodes.USER_EXITED, 'User exited');
    expect(err.isUserExit).toBe(true);
    expect(err.code).toBe(-1);
  });

  it('should set isUserExit = false for other codes', () => {
    const err = new MyIdError(MyIdErrorCodes.LIVENESS_FAILED, 'Liveness failed');
    expect(err.isUserExit).toBe(false);
  });

  it('should have a stack trace', () => {
    const err = new MyIdError(101, 'test');
    expect(err.stack).toBeDefined();
    expect(err.stack).toContain('MyIdError');
  });

  it('should work in try/catch with instanceof', () => {
    let caught = false;
    try {
      throw new MyIdError(3, 'test');
    } catch (err) {
      if (err instanceof MyIdError) {
        caught = true;
        expect(err.code).toBe(3);
      }
    }
    expect(caught).toBe(true);
  });
});
