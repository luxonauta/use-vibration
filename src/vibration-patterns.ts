/**
 * Common vibration patterns for different user interactions
 */
export const VibrationPatterns = {
  /** Short 100ms vibration for subtle feedback */
  tap: 100,

  /** Standard 200ms vibration */
  standard: 200,

  /** Longer 500ms vibration for emphasis */
  heavy: 500,

  /** Double-tap pattern: vibrate-pause-vibrate */
  double: [100, 30, 100],

  /** Triple-tap pattern: vibrate-pause-vibrate-pause-vibrate */
  triple: [100, 30, 100, 30, 100],

  /** Success feedback pattern */
  success: [100, 50, 200],

  /** Error or warning pattern - longer and more noticeable */
  error: [300, 100, 500],

  /** Pattern for notifications */
  notification: [200, 100, 100],

  /** SOS pattern in morse code: ... --- ... */
  sos: [
    100, 100, 100, 100, 100, 100, 300, 100, 300, 100, 300, 100, 100, 100, 100,
    100, 100
  ],

  /** Heartbeat-like pattern */
  heartbeat: [100, 100, 100, 400]
};
