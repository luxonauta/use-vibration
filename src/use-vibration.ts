import { useCallback, useState } from "react";

/**
 * Vibration pattern - can be a single duration in milliseconds
 * or an array of durations (vibrate, pause, vibrate, pause, ...)
 */
type VibrationPattern = number | number[];

/**
 * Current state of the vibration functionality
 */
interface VibrationState {
  /** Whether the device supports vibration */
  isSupported: boolean;
  /** Whether the device is currently vibrating */
  isVibrating: boolean;
}

/**
 * Controls for managing device vibration
 */
interface VibrationControls {
  /**
   * Triggers vibration with the given pattern
   * @param pattern - Duration in ms or pattern array of durations
   */
  vibrate: (pattern?: VibrationPattern) => void;

  /**
   * Stops any ongoing vibration
   */
  stop: () => void;
}

/**
 * Hook return type
 */
type UseVibrationReturn = [VibrationState, VibrationControls];

/**
 * React hook for controlling device vibration
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
 */
const useVibration = (): UseVibrationReturn => {
  const isSupported =
    typeof navigator !== "undefined" && typeof navigator.vibrate === "function";

  const [isVibrating, setIsVibrating] = useState<boolean>(false);

  const vibrate = useCallback(
    (pattern: VibrationPattern = 200) => {
      if (!isSupported) return;

      try {
        const didVibrate = navigator.vibrate(pattern);
        setIsVibrating(didVibrate);

        if (Array.isArray(pattern)) {
          const totalDuration = pattern.reduce(
            (sum, duration) => sum + duration,
            0
          );

          setTimeout(() => {
            setIsVibrating(false);
          }, totalDuration);
        } else if (pattern > 0) {
          setTimeout(() => {
            setIsVibrating(false);
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
    [isSupported]
  );

  const stop = useCallback(() => {
    if (!isSupported) return;

    try {
      navigator.vibrate(0);
      setIsVibrating(false);
    } catch (error) {
      console.error("\nAn error occurred while stopping vibration:", error);
    }
  }, [isSupported]);

  return [
    { isSupported, isVibrating },
    { vibrate, stop }
  ];
};

export default useVibration;
