# `useVibration`

> A React hook for controlling device vibration.

Why should we use more haptic feedback on the web? Please [read about it here.](https://dev.to/luxonauta/beyond-visual-why-we-should-be-using-more-haptic-feedback-on-the-web-1adg)

## Installation

```bash
npm install @luxonauta/use-vibration
```

## Basic Usage

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
          Stop Vibration
        </button>
      )}
    </>
  );
};
```

## API Reference

### Hook Return Values

```tsx
const [state, controls] = useVibration();
```

#### State Object

| Property      | Type      | Description                               |
| ------------- | --------- | ----------------------------------------- |
| `isSupported` | `boolean` | Whether the device supports vibration     |
| `isVibrating` | `boolean` | Whether the device is currently vibrating |

#### Controls Object

| Method    | Type                                   | Description                                 |
| --------- | -------------------------------------- | ------------------------------------------- |
| `vibrate` | `(pattern?: VibrationPattern) => void` | Triggers vibration with an optional pattern |
| `stop`    | `() => void`                           | Stops any ongoing vibration                 |

### Types

```tsx
// Single duration or pattern array
type VibrationPattern = number | number[];
```

### Predefined Patterns

The hook comes with common vibration patterns for different interactions:

| Pattern        | Description          | Value                                                                                   |
| -------------- | -------------------- | --------------------------------------------------------------------------------------- |
| `tap`          | Subtle feedback      | `100`                                                                                   |
| `standard`     | Standard vibration   | `200`                                                                                   |
| `heavy`        | Emphasis             | `500`                                                                                   |
| `double`       | Double-tap pattern   | `[100, 30, 100]`                                                                        |
| `triple`       | Triple-tap pattern   | `[100, 30, 100, 30, 100]`                                                               |
| `success`      | Success feedback     | `[100, 50, 200]`                                                                        |
| `error`        | Error or warning     | `[300, 100, 500]`                                                                       |
| `notification` | For notifications    | `[200, 100, 100]`                                                                       |
| `sos`          | SOS in morse code    | `[100, 100, 100, 100, 100, 100, 300, 100, 300, 100, 300, 100, 100, 100, 100, 100, 100]` |
| `heartbeat`    | Heartbeat simulation | `[100, 100, 100, 400]`                                                                  |

## Advanced Usage

### Custom Patterns

You can create custom vibration patterns using arrays where:

- Even-indexed elements (`0`, `2`, `4`, ...) specify vibration durations;
- Odd-indexed elements (`1`, `3`, `5`, ...) specify pause durations.

```tsx
// Pattern: vibrate 200ms → pause 100ms → vibrate 400ms → pause 100ms → vibrate 200ms
const customPattern = [200, 100, 400, 100, 200];
vibrate(customPattern);
```

### Creating UI Feedback

```tsx
const FeedbackApp = () => {
  const [, { vibrate }] = useVibration();

  const handleSuccess = () => {
    // Haptic feedback
    vibrate(VibrationPatterns.success);
    // Visual feedback
    setStatus("Success!");
  };

  const handleError = () => {
    // Haptic feedback
    vibrate(VibrationPatterns.error);
    // Visual feedback
    setStatus("Error!");
  };

  // App
};
```

### Game Example

```tsx
const Game = () => {
  const [, { vibrate }] = useVibration();

  const handleCollision = (intensity) => {
    // Adjust the vibration based on collision intensity
    const duration = Math.min(Math.round(intensity * 300), 1000);
    vibrate(duration);
  };

  // Game
};
```

## Browser Compatibility

The [Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API) is supported across most modern browsers:

### Desktop Browsers

- **Chrome**: `32+`;
- **Edge**: `79+`;
- **Opera**: `19+`;
- **Firefox**: Not supported;
- **Safari**: Not supported.

### Mobile Browsers

- **Chrome for Android**: `32+`;
- **Firefox for Android**: `79+`;
- **Opera for Android**: `19+`;
- **Samsung Internet**: `2.0+`;
- **"WebView Android"**: `4.4.3+`;
- **Safari iOS**: Not supported.

### Important Notes

- The Vibration API is primarily designed for mobile devices;
- Desktop browsers may support the API, but won't produce actual vibration.

> **Recommendation**: Always check `isSupported` before using vibration features in your app.

## Best Practices

1. **Always check support first**

   ```tsx
   const [{ isSupported }] = useVibration();
   if (!isSupported) return <AlternativeFeedback />;
   ```

2. **Use sparingly**
   Excessive vibration can be annoying and drain battery. Use only for important feedback.

3. **Respect user preferences**
   Consider adding a setting to disable vibration.

4. **Provide alternatives**
   Always pair vibration with visual feedback for accessibility.

5. **Keep patterns simple**
   Complex patterns may not work consistently across devices.

## Limitations

- Some Android devices may ignore pattern details and use their default vibration;
- Vibration might not work when browser is in background.

## License

[MIT](license)
