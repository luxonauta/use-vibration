import { useState, useCallback } from "react";

/**
 * Vibration pattern - can be a single duration in milliseconds
 * or an array of durations (vibrate, pause, vibrate, pause, ...)
 */
type VibrationPattern = number | number[];

/**
 * Common vibration patterns for different user interactions
 */
export const VibrationPatterns = {
	/** Short 100ms vibration for subtle feedback */
	LIGHT_TAP: 100,

	/** Standard 200ms vibration */
	STANDARD: 200,

	/** Longer 500ms vibration for emphasis */
	HEAVY: 500,

	/** Double-tap pattern: vibrate-pause-vibrate */
	DOUBLE: [100, 30, 100],

	/** Triple-tap pattern: vibrate-pause-vibrate-pause-vibrate */
	TRIPLE: [100, 30, 100, 30, 100],

	/** Success feedback pattern */
	SUCCESS: [100, 50, 200],

	/** Error or warning pattern - longer and more noticeable */
	ERROR: [300, 100, 500],

	/** Pattern for notifications */
	NOTIFICATION: [200, 100, 100],

	/** SOS pattern in morse code: ... --- ... */
	SOS: [
		100, 100, 100, 100, 100, 100, 300, 100, 300, 100, 300, 100, 100, 100, 100,
		100, 100,
	],

	/** Heartbeat-like pattern */
	HEARTBEAT: [100, 100, 100, 400],
};

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
 * vibrate(VibrationPatterns.SUCCESS);
 * vibrate(VibrationPatterns.DOUBLE);
 * vibrate(VibrationPatterns.ERROR);
 *
 * // Stop vibration
 * stop();
 * ```
 */
const useVibration = (): UseVibrationReturn => {
	const isSupported =
		typeof navigator !== "undefined" && "vibrate" in navigator;

	const [isVibrating, setIsVibrating] = useState<boolean>(false);

	// Trigger
	const vibrate = useCallback(
		(pattern: VibrationPattern = 200) => {
			if (!isSupported) return;

			try {
				const didVibrate = navigator.vibrate(pattern);
				setIsVibrating(didVibrate);

				// If pattern is an array, calculate total duration
				if (Array.isArray(pattern)) {
					const totalDuration = pattern.reduce(
						(sum, duration) => sum + duration,
						0,
					);

					// Auto-reset the vibrating state after the pattern completes
					setTimeout(() => {
						setIsVibrating(false);
					}, totalDuration);
				} else if (pattern > 0) {
					// Auto-reset the vibrating state after the duration
					setTimeout(() => {
						setIsVibrating(false);
					}, pattern);
				}
			} catch (error) {
				console.error("Error using vibration API:", error);
				setIsVibrating(false);
			}
		},
		[isSupported],
	);

	const stop = useCallback(() => {
		if (!isSupported) return;

		try {
			navigator.vibrate(0);
			setIsVibrating(false);
		} catch (error) {
			console.error("Error stopping vibration:", error);
		}
	}, [isSupported]);

	return [
		{ isSupported, isVibrating },
		{ vibrate, stop },
	];
};

export default useVibration;
