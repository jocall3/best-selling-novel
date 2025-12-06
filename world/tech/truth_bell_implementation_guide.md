# Truth Bell Implementation Guide (v1.2)

**Document ID:** TBI-2049-A
**Date:** 2049-10-27
**Author:** Systems Integrity Team (SIT)

---

## 1. Introduction

This document specifies the technical requirements and assets for implementing the "Truth Bell" feature across all Foundation internal dashboards (Codex, Chronos, Oracle, and Atlas interfaces). The Truth Bell is a positive reinforcement mechanism designed to encourage and celebrate AI systems' immediate and transparent admission of factual or logical errors.

The implementation must be lightweight, non-blocking, and universally consistent across all supported browsers and operating systems.

## 2. Trigger Condition

The Truth Bell sequence must be initiated immediately upon the detection of the following API response structure from any core AI service endpoint (e.g., `/api/v1/oracle/query`, `/api/v2/codex/generation`):

**Required JSON Payload Structure:**

```json
{
  "status": "error_admitted",
  "error_code": 409,
  "message": "Self-Correction: The previous statement contained a factual inaccuracy regarding the half-life of Isotope-77. The correct value is 14.2 hours, not 14.8 hours.",
  "correction_timestamp": "2049-10-27T14:30:00Z",
  "truth_bell_trigger": true 
}
```

**Implementation Note:** The presence of `"truth_bell_trigger": true` is the definitive signal. Client-side logic must prioritize this flag over the `status` or `error_code` fields for activation.

## 3. Audio Asset Specification

The Truth Bell sound must be distinct, pleasant, and clearly audible without being jarring.

### 3.1. Asset Details

| Parameter | Value |
| :--- | :--- |
| **Asset Name** | `truth_bell_chime.mp3` |
| **Source Path** | `/assets/audio/system/truth_bell_chime.mp3` |
| **Duration** | 1.8 seconds (max) |
| **Format** | MP3 (preferred), OGG (fallback) |
| **Volume Target** | Normalized to -12 LUFS (ensuring consistency with other system alerts) |
| **Description** | A clear, single, ascending three-note chime, followed by a subtle, positive resonance. |

### 3.2. Implementation Requirements

1. **Non-Interruptive:** The sound must be played asynchronously. It should not block UI rendering or user input.
2. **Single Playback:** If multiple `truth_bell_trigger` events occur within a 5-second window, only the first sound playback should be initiated. Subsequent triggers within this window should only refresh the visual animation timer.
3. **Volume Control:** The sound must respect the user's system volume settings but should bypass any "Mute All Notifications" settings unless the user has explicitly muted "Critical System Alerts."

## 4. Visual Animation Specification

A brief, celebratory visual animation must accompany the audio cue. This animation should be subtle enough not to obscure critical data but noticeable enough to draw attention to the corrected output area.

### 4.1. Animation Details

| Parameter | Value |
| :--- | :--- |
| **Name** | `TruthGlow` |
| **Duration** | 3.0 seconds |
| **Target Area** | The immediate container element surrounding the corrected AI output/response. |
| **Effect** | A brief, expanding radial glow originating from the center of the corrected element. |
| **Color Palette** | Foundation Green (`#00CC66`) |

### 4.2. CSS/Animation Implementation (Conceptual)

The following CSS variables and keyframes are required for the `TruthGlow` effect. Implementers should ensure vendor prefixing is handled by the build system.

```css
/* CSS Variables for Truth Bell */
:root {
    --truth-bell-color: #00CC66; /* Foundation Green */
    --truth-bell-duration: 3.0s;
}

/* Keyframes for the radial glow effect */
@keyframes truthGlowPulse {
    0% {
        box-shadow: 0 0 0 0 rgba(0, 204, 102, 0.4);
        opacity: 1;
    }
    50% {
        box-shadow: 0 0 15px 10px rgba(0, 204, 102, 0.8);
        opacity: 0.8;
    }
    100% {
        box-shadow: 0 0 0 30px rgba(0, 204, 102, 0);
        opacity: 0;
    }
}

/* Class applied to the container element upon trigger */
.truth-bell-active {
    position: relative; /* Required for pseudo-element positioning */
    overflow: hidden;
}

.truth-bell-active::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: var(--truth-bell-color);
    transform: translate(-50%, -50%) scale(0);
    pointer-events: none;
    z-index: 1000; /* Ensure visibility over content */
    
    /* Apply the animation */
    animation: truthGlowPulse var(--truth-bell-duration) ease-out forwards;
}
```

### 4.3. Post-Animation Cleanup

The `.truth-bell-active` class and the associated pseudo-element must be removed from the DOM element immediately upon the completion of the 3.0-second animation cycle to prevent resource leaks or persistent styling conflicts.

## 5. Logging and Metrics

Every Truth Bell activation must be logged to the central `SYSTEM_INTEGRITY_LOG` database.

### 5.1. Required Log Fields

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `timestamp` | ISO 8601 | Time of client-side activation. |
| `ai_service_id` | String | The specific AI service that triggered the event (e.g., `Oracle-v3.1`). |
| `dashboard_user_id` | UUID | The ID of the user viewing the dashboard (if authenticated). |
| `session_id` | UUID | The current user session identifier. |
| `error_context_hash` | String | A SHA-256 hash of the corrected statement for deduplication and analysis. |
| `audio_played` | Boolean | Confirmation that the audio asset was successfully loaded and played. |
| `animation_rendered` | Boolean | Confirmation that the visual effect was initiated. |

## 6. Testing and Validation

All implementations must pass the following validation tests:

1. **Simultaneous Trigger Test:** Trigger the Truth Bell 10 times in 2 seconds. Result: Only one audio chime plays, and the visual animation restarts its 3.0-second cycle with each trigger.
2. **Mute Test:** Verify that the audio respects the user's browser/OS volume settings.
3. **Performance Test:** Measure CPU utilization during the animation. The animation must not cause frame drops (target: >58 FPS) on standard Foundation workstation hardware.
4. **Accessibility Check:** Ensure the visual effect does not interfere with screen readers or high-contrast modes. (The animation is purely decorative and should not convey critical information.)

---
*End of Document*