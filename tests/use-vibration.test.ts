import { act, renderHook } from '@testing-library/react';
import useVibration, { VibrationPatterns } from '../src';

describe('\nuseVibration Hook\n', () => {
  // Variables for navigator.vibrate mock
  let originalNavigator: Navigator;
  let vibrateMock: jest.Mock;

  beforeEach(() => {
    // Store original navigator
    originalNavigator = global.navigator;

    // Create a mock for navigator.vibrate
    vibrateMock = jest.fn().mockReturnValue(true);

    // Set the mock on navigator object
    Object.defineProperty(global, 'navigator', {
      value: {
        ...originalNavigator,
        vibrate: vibrateMock,
      },
      writable: true,
      configurable: true,
    });

    // Mock for setTimeout
    jest.useFakeTimers();
  });

  afterEach(() => {
    // Restore original navigator
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });

    // Clear timer mocks
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('Should check if the vibration is supported.', () => {
    const { result } = renderHook(() => useVibration());

    expect(result.current[0].isSupported).toBe(true);
  });

  it('Should return isSupported as false when vibrate is not available.', () => {
    // Completely redefine navigator to ensure vibrate is undefined
    const mockNavigator = { ...originalNavigator };
    // No need to redefine mockNavigator.vibrate here

    Object.defineProperty(global, 'navigator', {
      value: mockNavigator,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useVibration());

    expect(result.current[0].isSupported).toBe(false);
  });

  it('Should call navigator.vibrate with default duration when vibrate is called without arguments.', () => {
    const { result } = renderHook(() => useVibration());

    act(() => {
      result.current[1].vibrate();
    });

    expect(vibrateMock).toHaveBeenCalledWith(200);
    expect(result.current[0].isVibrating).toBe(true);
  });

  it('Should call navigator.vibrate with a specific duration.', () => {
    const { result } = renderHook(() => useVibration());

    act(() => {
      result.current[1].vibrate(500);
    });

    expect(vibrateMock).toHaveBeenCalledWith(500);
    expect(result.current[0].isVibrating).toBe(true);
  });

  it('Should call navigator.vibrate with the vibration pattern.', () => {
    const { result } = renderHook(() => useVibration());
    const pattern = [100, 50, 200];

    act(() => {
      result.current[1].vibrate(pattern);
    });

    expect(vibrateMock).toHaveBeenCalledWith(pattern);
    expect(result.current[0].isVibrating).toBe(true);
  });

  it('Should call navigator.vibrate with predefined patterns.', () => {
    const { result } = renderHook(() => useVibration());

    act(() => {
      result.current[1].vibrate(VibrationPatterns.SUCCESS);
    });

    expect(vibrateMock).toHaveBeenCalledWith(VibrationPatterns.SUCCESS);
    expect(result.current[0].isVibrating).toBe(true);
  });

  it('Should stop vibration when stop is called.', () => {
    const { result } = renderHook(() => useVibration());

    act(() => {
      result.current[1].vibrate();
    });

    expect(result.current[0].isVibrating).toBe(true);

    act(() => {
      result.current[1].stop();
    });

    expect(vibrateMock).toHaveBeenCalledWith(0);
    expect(result.current[0].isVibrating).toBe(false);
  });

  it('Should set isVibrating to false after vibration time for a single duration.', () => {
    const { result } = renderHook(() => useVibration());

    act(() => {
      result.current[1].vibrate(300);
    });

    expect(result.current[0].isVibrating).toBe(true);

    // Advance time by 300ms
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current[0].isVibrating).toBe(false);
  });

  it('Should set isVibrating to false after the total time of a vibration pattern.', () => {
    const { result } = renderHook(() => useVibration());
    const pattern = [100, 50, 200]; // Total: 350ms

    act(() => {
      result.current[1].vibrate(pattern);
    });

    expect(result.current[0].isVibrating).toBe(true);

    // Advance time by 349ms (should not be finished yet)
    act(() => {
      jest.advanceTimersByTime(349);
    });

    expect(result.current[0].isVibrating).toBe(true);

    // Advance one more ms to complete total time
    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(result.current[0].isVibrating).toBe(false);
  });

  it('Should handle errors when calling the navigator.vibrate.', () => {
    // Mock console.error
    const consoleErrorMock = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    // Define a new vibrate mock that throws an error
    Object.defineProperty(global, 'navigator', {
      value: {
        ...originalNavigator,
        vibrate: jest.fn().mockImplementation(() => {
          throw new Error('Vibration error');
        }),
      },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useVibration());

    act(() => {
      result.current[1].vibrate();
    });

    expect(consoleErrorMock).toHaveBeenCalled();
    expect(result.current[0].isVibrating).toBe(false);

    // Restore console.error
    consoleErrorMock.mockRestore();
  });

  it('Should handle errors when calling navigator.vibrate(0) in the stop method.', () => {
    // Mock console.error
    const consoleErrorMock = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    // First set up a normal vibrate mock for the first call
    vibrateMock.mockImplementationOnce(() => true);

    const { result } = renderHook(() => useVibration());

    act(() => {
      result.current[1].vibrate();
    });

    expect(result.current[0].isVibrating).toBe(true);

    // Then redefine vibrate to throw an error for the second call
    Object.defineProperty(global, 'navigator', {
      value: {
        ...originalNavigator,
        vibrate: jest.fn().mockImplementation(() => {
          throw new Error('Error stopping vibration');
        }),
      },
      writable: true,
      configurable: true,
    });

    act(() => {
      result.current[1].stop();
    });

    expect(consoleErrorMock).toHaveBeenCalled();

    // Restore console.error
    consoleErrorMock.mockRestore();
  });

  it('Should not attempt to vibrate when the device does not support vibration.', () => {
    // Completely redefine navigator to ensure vibrate is undefined
    const mockNavigator = { ...originalNavigator };

    Object.defineProperty(mockNavigator, 'vibrate', {
      value: undefined,
      writable: true,
      configurable: true,
    });

    Object.defineProperty(global, 'navigator', {
      value: mockNavigator,
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useVibration());

    act(() => {
      result.current[1].vibrate();
    });

    // We can't check vibrateMock here because we removed it
    expect(result.current[0].isVibrating).toBe(false);
  });
});
