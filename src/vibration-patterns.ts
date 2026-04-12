/**
 * Ready-made durations and sequences you can pass to `vibrate(...)`.
 *
 * Treat these as starting points; devices may still shorten or ignore patterns.
 */
export const VibrationPatterns = {
  /** A quick, light buzz—good for ordinary button taps. */
  tap: 100,

  /** A medium-length single pulse; matches the hook’s default length. */
  standard: 200,

  /** A longer single pulse when you want stronger emphasis. */
  heavy: 500,

  /** Two short buzzes with a small gap—reads like a double tap. */
  double: [100, 30, 100],

  /** Three short buzzes with gaps—slightly more emphasis than `double`. */
  triple: [100, 30, 100, 30, 100],

  /** A short pulse, a pause, then a longer pulse—often feels “positive”. */
  success: [100, 50, 200],

  /** Longer pulses with a gap—stands out more than `success`. */
  error: [300, 100, 500],

  /** Medium pulse plus two shorter ones—handy for alerts or toasts. */
  notification: [200, 100, 100],

  /** Morse “SOS” (`... --- ...`) as vibrate/pause timings. */
  sos: [
    100, 100, 100, 100, 100, 100, 300, 100, 300, 100, 300, 100, 100, 100, 100,
    100, 100
  ],

  /** Two quick beats, a rest, then a third—similar to a heartbeat rhythm. */
  heartbeat: [100, 100, 100, 400]
};
