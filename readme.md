# `useVibration`

> A React hook for controlling device vibration.

## Basic Usage

```tsx
import useVibration, { VibrationPatterns } from "use-vibration";

const FeedbackButton = () => {
  const [{ isSupported, isVibrating }, { vibrate, stop }] = useVibration();

  if (!isSupported) {
    return <p>Vibration not supported on your device</p>;
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => vibrate(VibrationPatterns.SUCCESS)}
        disabled={isVibrating}
      >
        {isVibrating ? "Vibrating..." : "Click me for haptic feedback"}
      </button>
      {isVibrating && <button onClick={stop}>Stop Vibration</button>}
    </div>
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
| `LIGHT_TAP`    | Subtle feedback      | `100`                                                                                   |
| `STANDARD`     | Standard vibration   | `200`                                                                                   |
| `HEAVY`        | Emphasis             | `500`                                                                                   |
| `DOUBLE`       | Double-tap pattern   | `[100, 30, 100]`                                                                        |
| `TRIPLE`       | Triple-tap pattern   | `[100, 30, 100, 30, 100]`                                                               |
| `SUCCESS`      | Success feedback     | `[100, 50, 200]`                                                                        |
| `ERROR`        | Error or warning     | `[300, 100, 500]`                                                                       |
| `NOTIFICATION` | For notifications    | `[200, 100, 100]`                                                                       |
| `SOS`          | SOS in morse code    | `[100, 100, 100, 100, 100, 100, 300, 100, 300, 100, 300, 100, 100, 100, 100, 100, 100]` |
| `HEARTBEAT`    | Heartbeat simulation | `[100, 100, 100, 400]`                                                                  |

## Advanced Usage

### Custom Patterns

You can create custom vibration patterns using arrays where:

- Even-indexed elements (0, 2, 4, ...) specify vibration durations
- Odd-indexed elements (1, 3, 5, ...) specify pause durations

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
    // Visual feedback
    setStatus("Success!");
    // Haptic feedback
    vibrate(VibrationPatterns.SUCCESS);
  };

  const handleError = () => {
    // Visual feedback
    setStatus("Error!");
    // Haptic feedback
    vibrate(VibrationPatterns.ERROR);
  };

  // Rest of component...
};
```

### Gaming Example

```tsx
const Game = () => {
  const [, { vibrate }] = useVibration();

  const handleCollision = (intensity) => {
    // Adjust vibration based on collision intensity
    const duration = Math.min(Math.round(intensity * 300), 1000);
    vibrate(duration);
  };

  // Rest of game component...
};
```

## Browser Compatibility

The Vibration API is supported in:

- Chrome for Android 32+;
- Firefox for Android 14+;
- Samsung Internet;
- Opera Mobile 12+.

Not supported in:

- Safari on iOS;
- Desktop browsers.

> Always check `isSupported` before using vibration features in your app.

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
- iOS Safari does not support the Vibration API;
- Desktop browsers generally don't support vibration;
- Vibration might not work when browser is in background.

## License

[MIT](LICENSE)
