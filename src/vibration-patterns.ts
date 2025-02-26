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
