# `useVibration`

> A React hook for controlling device vibration.

Why use haptics on the web? [Beyond visual: why we should be using more haptic feedback on the web](https://dev.to/luxonauta/beyond-visual-why-we-should-be-using-more-haptic-feedback-on-the-web-1adg).

## Contents

- [Installation](#installation)
- [Quick start](#quick-start)
- [Package entry points](#package-entry-points)
- [API reference](#api-reference)
- [Vibration patterns](#vibration-patterns)
- [Recipes](#recipes)
- [Browser support and behavior](#browser-support-and-behavior)
- [Best practices](#best-practices)
- [Limitations](#limitations)
- [License](#license)

## Installation

```bash
npm install @luxonauta/use-vibration
```

## Quick start

```tsx
import useVibration, { VibrationPatterns } from "@luxonauta/use-vibration";

export const Component = () => {
  const [{ isSupported, isVibrating }, { vibrate, stop }] = useVibration();

  if (!isSupported) {
    return <p>Vibration not supported on your device</p>;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => vibrate(VibrationPatterns.tap)}
        disabled={isVibrating}
      >
        {isVibrating ? "Vibrating" : "Tap me for haptic feedback"}
      </button>
      {isVibrating && (
        <button type="button" onClick={stop}>
          Stop vibration
        </button>
      )}
    </>
  );
};
```

## Package entry points

The package exposes the main bundle plus two subpaths if you want smaller, explicit imports:

| Import path                                   | What it loads                                                         |
| --------------------------------------------- | --------------------------------------------------------------------- |
| `@luxonauta/use-vibration`                    | Default hook + `VibrationPatterns` and types (same as `src/index.ts`) |
| `@luxonauta/use-vibration/use-vibration`      | Only the hook and its types                                           |
| `@luxonauta/use-vibration/vibration-patterns` | Only `VibrationPatterns`                                              |

## API reference

### `useVibration()`

Returns a tuple: **`[state, controls]`** (state first, then actions).

#### State

| Property      | Type      | Meaning                                                                                                                                            |
| ------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isSupported` | `boolean` | The browser exposes `navigator.vibrate`. That does not guarantee physical hardware (for example, some desktops “support” the API without a motor). |
| `isVibrating` | `boolean` | The hook thinks a pattern you started is still running. It is driven by timers and the boolean result of `vibrate()`, not by the device motor.     |

#### Controls

| Method    | Signature                              | Meaning                                                                                                                                                                                                                                                                      |
| --------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `vibrate` | `(pattern?: VibrationPattern) => void` | Start a vibration. With no argument, uses **200 ms**. Prefer calling from a **user gesture** (click, tap, key press); browsers often require [sticky user activation](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/User_activation) for the Vibration API. |
| `stop`    | `() => void`                           | Cancel the current pattern (same idea as `navigator.vibrate(0)`).                                                                                                                                                                                                            |

#### Types

```tsx
type VibrationPattern = number | number[];
```

- **Single number:** one pulse for that many milliseconds.
- **Array:** alternating **vibrate** and **pause** lengths in milliseconds: index `0` vibrates, index `1` pauses, index `2` vibrates again, and so on—same as [`navigator.vibrate()`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate).

## Vibration patterns

Built-in values you can pass to `vibrate(...)`:

| Key            | Description                               | Value                                                                                   |
| -------------- | ----------------------------------------- | --------------------------------------------------------------------------------------- |
| `tap`          | Light, quick feedback                     | `100`                                                                                   |
| `standard`     | Default-style single pulse                | `200`                                                                                   |
| `heavy`        | Stronger single pulse                     | `500`                                                                                   |
| `double`       | Two pulses with a short gap               | `[100, 30, 100]`                                                                        |
| `triple`       | Three pulses with gaps                    | `[100, 30, 100, 30, 100]`                                                               |
| `success`      | Short, pause, longer—often feels positive | `[100, 50, 200]`                                                                        |
| `error`        | Longer, more noticeable warning-style     | `[300, 100, 500]`                                                                       |
| `notification` | Useful for alerts or toasts               | `[200, 100, 100]`                                                                       |
| `sos`          | Morse SOS (`... --- ...`)                 | `[100, 100, 100, 100, 100, 100, 300, 100, 300, 100, 300, 100, 100, 100, 100, 100, 100]` |
| `heartbeat`    | Two quick beats, rest, then a third       | `[100, 100, 100, 400]`                                                                  |

## Recipes

### Custom patterns

```tsx
// Vibrate 200ms → pause 100ms → vibrate 400ms → pause 100ms → vibrate 200ms
const customPattern = [200, 100, 400, 100, 200];
vibrate(customPattern);
```

### Success and error feedback

```tsx
const FeedbackApp = () => {
  const [, { vibrate }] = useVibration();

  const handleSuccess = () => {
    vibrate(VibrationPatterns.success);
    setStatus("Success!");
  };

  const handleError = () => {
    vibrate(VibrationPatterns.error);
    setStatus("Error!");
  };

  // ...
};
```

### Game-style intensity

```tsx
const Game = () => {
  const [, { vibrate }] = useVibration();

  const handleCollision = (intensity: number) => {
    const duration = Math.min(Math.round(intensity * 300), 1000);
    vibrate(duration);
  };

  // ...
};
```

## Browser support and behavior

The [Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API) is **not** Baseline: large gaps exist between browsers.

### Desktop

- **Chrome** 32+
- **Edge** 79+
- **Opera** 19+
- **Firefox** — not supported
- **Safari** — not supported

### Mobile

- **Chrome for Android** 32+
- **Firefox for Android** 79+
- **Opera for Android** 19+
- **Samsung Internet** 2.0+
- **WebView Android** 4.4.3+
- **Safari on iOS** — not supported

### Things to expect

- Built for phones and tablets; desktop support does not mean you will feel anything.
- Many engines require a **recent user interaction** before vibration runs.
- **Silent mode** or **Do Not Disturb** can mute vibration even when the API exists.
- **Very long** patterns may be **truncated** by the browser.
- Vibration may **not run** while the page is in the **background**.

Always branch on `isSupported` and keep non-haptic feedback (visual, text) as the primary cue.

## Best practices

1. **Check support first**

   ```tsx
   const [{ isSupported }] = useVibration();
   if (!isSupported) return <AlternativeFeedback />;
   ```

2. **Use sparingly** — Overuse drains battery and annoys users. Reserve for meaningful moments.

3. **Respect preferences** — Offer a setting to turn haptics off.

4. **Pair with visible feedback** — Screen readers and silent devices still need a clear UI response.

5. **Keep patterns simple** — Long or dense arrays behave inconsistently across hardware.

## Limitations

- Some Android devices simplify or ignore fine-grained patterns.
- Background tabs and OS modes can block vibration regardless of `isSupported`.

## License

[MIT](license)
