import { useCallback, useEffect, useRef, useState } from "react";

/**
 * How long the device should vibrate, or a full on-off sequence.
 *
 * Pass a single number to buzz once for that many milliseconds. Pass an array
 * to alternate vibration time and pause time: first value is vibrate, second is
 * pause, third is vibrate again, and so on (same rules as `navigator.vibrate`).
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate | MDN: Navigator.vibrate()}
 */
export type VibrationPattern = number | number[];

/**
 * Read-only snapshot of whether vibration is available and running.
 */
export interface VibrationState {
  /**
   * `true` when the browser exposes `navigator.vibrate` (the API exists). This
   * does not guarantee the user will feel haptics (for example, desktop
   * browsers may report support without hardware).
   */
  isSupported: boolean;
  /**
   * `true` while a vibration you started is expected to still be running. The
   * browser can still block or shorten the pulse; this flag follows the hook’s
   * timing, not the physical motor.
   */
  isVibrating: boolean;
}

/**
 * Imperative actions to start or stop vibration.
 */
export interface VibrationControls {
  /**
   * Starts a vibration. Call it from a user gesture (tap, click, etc.); many
   * browsers require that for `navigator.vibrate` to run.
   *
   * @param pattern - One duration in milliseconds, or an alternating
   *   vibrate/pause list. If you omit this argument, the hook uses 200 ms.
   */
  vibrate: (pattern?: VibrationPattern) => void;

  /**
   * Cancels the current pattern the same way as `navigator.vibrate(0)`.
   */
  stop: () => void;
}

/**
 * Tuple returned by {@link useVibration}: `[state, controls]`.
 */
export type UseVibrationReturn = [VibrationState, VibrationControls];

/**
 * React hook around the Vibration API (`navigator.vibrate`).
 *
 * Typical flow: read `isSupported`, then call `vibrate` from an event handler.
 * Use `stop` to cancel early. `isVibrating` is cleared after the pattern you
 * passed should have finished (single number or sum of array entries).
 *
 * **Browser notes (from MDN):** vibration may do nothing without a recent user
 * interaction, in silent/Do Not Disturb mode, or when the tab is in the
 * background. Very long patterns may be capped by the browser.
 *
 * @returns A two-element array: state first, then controls (mirrors hooks like
 *   `useState`).
 *
 * @example
 * ```tsx
 * const [{ isSupported, isVibrating }, { vibrate, stop }] = useVibration();
 *
 * // Simple vibration
 * vibrate(); // Default 200ms
 * vibrate(500); // 500ms
 *
 * // Pattern: vibrate 100ms, pause 50ms, vibrate 200ms
 * vibrate([100, 50, 200]);
 *
 * // Using predefined patterns
 * vibrate(VibrationPatterns.success);
 * vibrate(VibrationPatterns.double);
 * vibrate(VibrationPatterns.error);
 *
 * // Stop vibration
 * stop();
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API | MDN: Vibration API}
 */
const useVibration = (): UseVibrationReturn => {
  const isSupported =
    typeof navigator !== "undefined" && typeof navigator.vibrate === "function";

  const [isVibrating, setIsVibrating] = useState<boolean>(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearVibrationTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearVibrationTimeout();
    };
  }, [clearVibrationTimeout]);

  const vibrate = useCallback(
    (pattern: VibrationPattern = 200) => {
      if (!isSupported) return;

      clearVibrationTimeout();

      try {
        const didVibrate = navigator.vibrate(pattern);
        setIsVibrating(didVibrate);

        if (Array.isArray(pattern)) {
          const totalDuration = pattern.reduce(
            (sum, duration) => sum + duration,
            0
          );

          timeoutRef.current = setTimeout(() => {
            setIsVibrating(false);
            timeoutRef.current = null;
          }, totalDuration);
        } else if (pattern > 0) {
          timeoutRef.current = setTimeout(() => {
            setIsVibrating(false);
            timeoutRef.current = null;
          }, pattern);
        }
      } catch (error) {
        console.error(
          "\nAn error occurred while trying to use the Vibration API:",
          error
        );
        setIsVibrating(false);
      }
    },
    [isSupported, clearVibrationTimeout]
  );

  const stop = useCallback(() => {
    if (!isSupported) return;

    clearVibrationTimeout();

    try {
      navigator.vibrate(0);
      setIsVibrating(false);
    } catch (error) {
      console.error("\nAn error occurred while stopping vibration:", error);
    }
  }, [isSupported, clearVibrationTimeout]);

  return [
    { isSupported, isVibrating },
    { vibrate, stop }
  ];
};

export default useVibration;
