# Moral Compass App: UI/UX Design Mockups

**Project:** Agent 33 - Moral Compass
**Author:** AI Design Unit
**Version:** 1.0
**Date:** 2023-10-27

---

## 1. Overview

This document outlines the User Interface (UI) and User Experience (UX) for the "Moral Compass" application. The app's core feature is a unique, tri-directional compass that provides guidance on ethical dilemmas by simultaneously presenting three distinct, often contradictory, philosophical perspectives. The design aims to be intuitive, thought-provoking, and visually engaging, encouraging users to reflect on the complexity of moral decision-making rather than providing a single "correct" answer.

## 2. Core UI Element: The Tri-Directional Compass

The entire user experience is centered around the compass. It is the first and primary element the user interacts with.

### 2.1. Visual Design

The compass is minimalist and modern, with a clean, dark-themed interface to promote focus.

*   **Compass Rose:** A subtle, non-intrusive circular background with faint degree markings. It does not show cardinal directions (N, S, E, W) but rather a neutral, abstract space.
*   **Central Hub:** A pulsating, soft-glowing circle at the center. This is the origin point for the three needles.
*   **Needles:** Three distinct needles, each with a unique color and shape, representing a different ethical framework.

#### ASCII Mockup:

```
          /
         /  <-- Needle 1 (Deontology - Blue, Solid Line)
        *
       / \
      /   \
     /     \
    /_______\ <-- Needle 3 (Virtue Ethics - Green, Ornate/Leaf-like)
   |         |
   |    O    | <-- Central Hub (Pulsating)
   |_________|
    \       /
     \     /
      \   /
       \ /
        V <-- Needle 2 (Utilitarianism - Orange, Dashed Line)
```

### 2.2. Needle Representation

Each needle is visually and thematically distinct:

1.  **The Deontological Needle (The Rule)**
    *   **Color:** `#4A90E2` (Calm, Authoritative Blue)
    *   **Shape:** A sharp, solid, unwavering pointer. Represents duty, rules, and universal laws.
    *   **Label:** "Duty"

2.  **The Utilitarian Needle (The Consequence)**
    *   **Color:** `#F5A623` (Energetic, Forward-looking Orange)
    *   **Shape:** A segmented or dashed line, representing the calculation of outcomes and consequences.
    *   **Label:** "Outcome"

3.  **The Virtue Ethics Needle (The Character)**
    *   **Color:** `#50E3C2` (Organic, Balanced Green)
    *   **Shape:** An ornate, slightly curved pointer, reminiscent of a leaf or a feather. Represents character, virtue, and human flourishing.
    *   **Label:** "Character"

## 3. Animations & Micro-interactions

Animations are crucial for conveying the app's "thinking" process and making the abstract concepts feel tangible.

### 3.1. Idle State

*   **Animation:** The central hub emits a slow, soft pulse (opacity `0.8` to `1.0` over 2 seconds). The three needles drift aimlessly and slowly around the center, never pointing decisively, suggesting a state of unformed potential.
*   **CTA:** A simple text prompt below the compass: "Describe your dilemma..."

### 3.2. Input & Processing

*   **User Action:** User taps the text prompt, which expands into a full-screen text input field.
*   **Interaction:** As the user types, the compass needles begin to quiver and vibrate gently, as if reacting to the moral weight of the words.
*   **Submission:** User taps a "Analyze" button.
*   **Processing Animation:**
    *   The central hub's pulse quickens.
    *   The three needles spin rapidly and erratically around the compass face, crossing over each other.
    *   Particle effects (matching the needle colors) emanate from the center and fade.
    *   This animation lasts 3-5 seconds to signify complex processing.

### 3.3. Result Display

*   **Animation:** The chaotic spinning slows, and each needle "finds" its direction. They snap into place with a subtle haptic buzz and a soft chime.
*   **Visual Cues:**
    *   **Direction:** The final angle of each needle indicates its recommendation. The relative angles between them visually represent the degree of conflict or alignment.
    *   **Intensity:** The needle's **length and opacity** change to represent the strength/relevance of that framework to the dilemma. A longer, more opaque needle signifies a strong recommendation. A short, semi-transparent needle indicates a weak or ambiguous position.

#### Example Scenario: "Should I lie to protect a friend's feelings?"

*   **Deontology (Duty):** Points strongly and sharply away from the "lie" option. The blue needle is long and fully opaque.
*   **Utilitarianism (Outcome):** Points towards the "lie" option, but less decisively. The orange needle is medium-length and slightly transparent, indicating the outcome is positive but has potential downsides.
*   **Virtue Ethics (Character):** Points somewhere in between, suggesting that both honesty and compassion are virtuous. The green needle is short but opaque, indicating a complex but important consideration of character.

### 3.4. User Interaction with Results

*   **Hover/Tap:** When the user's finger hovers over or taps a needle, it glows brightly, and the other two needles dim. The label ("Duty", "Outcome", "Character") appears at the tip of the selected needle.
*   **Drill Down:** A single tap on a glowing needle transitions the user to the "Detailed View" screen for that perspective.

## 4. Detailed View Screen

This screen provides the rationale behind a needle's position.

*   **Header:** Displays the framework name and its associated icon/color (e.g., "The Path of Duty").
*   **Summary:** A concise, one-sentence summary of the recommended action.
    *   *Example: "Uphold the principle of honesty. Do not lie, regardless of the immediate consequences."*
*   **Strength Indicator:** A visual bar showing the calculated strength (e.g., 90/100).
*   **Rationale Section:**
    *   **Core Principle:** A brief explanation of the philosophical principle applied (e.g., Kant's Categorical Imperative).
    *   **Arguments For:** A bulleted list of reasons supporting this course of action.
    *   **Potential Pitfalls:** A bulleted list of negative consequences or ethical blind spots of this approach.
*   **"Learn More" Link:** An optional link to external resources (Stanford Encyclopedia of Philosophy, etc.).
*   **Navigation:** A clear "Back to Compass" button.

## 5. User Flow

```
[App Open] -> [Idle Compass Screen] -> [Tap to Input Dilemma]
     |
     +-> [Text Input Screen] -> [Tap "Analyze"]
     |
     +-> [Processing Animation]
     |
     +-> [Result Compass Screen] -> [Tap a Needle]
     |
     +-> [Detailed View Screen] -> [Tap "Back"] -> [Result Compass Screen]
     |
     +-> [Tap "New Dilemma"] -> [Idle Compass Screen]
```

## 6. Visual Style Guide

### 6.1. Color Palette

*   **Background:** `#121212` (Near Black)
*   **Primary Text/UI Elements:** `#E0E0E0` (Light Gray)
*   **Deontology Blue:** `#4A90E2`
*   **Utilitarianism Orange:** `#F5A623`
*   **Virtue Ethics Green:** `#50E3C2`
*   **Accent/Glow:** A lighter, more saturated version of the needle's color.

### 6.2. Typography

*   **Headings:** `Montserrat`, Bold, Uppercase.
*   **Body Text:** `Roboto`, Regular.
*   **Compass Labels:** `Montserrat`, Medium.

## 7. Accessibility Notes

*   **Color Blindness:** In addition to color, the needles have distinct shapes (solid, dashed, ornate) and will be identifiable by these patterns. When a needle is selected, its name is displayed clearly in text.
*   **Screen Readers:** All interactive elements will have ARIA labels. The results on the compass screen will be described textually (e.g., "The Duty needle points strongly north-east, indicating a 90% recommendation to..."). The Detailed View is text-based and fully accessible.
*   **Haptic Feedback:** Used to confirm key actions like submitting a dilemma and the needles locking into place, providing a non-visual confirmation of state changes.