# Motion System Specifications

This document defines the mathematical models, easings, timings, and interaction systems used to implement the fluid interactive motion system of Ayur Sagathiya's portfolio website.

## Easing Functions & Curves

To achieve a premium, luxurious feel (inspired by Apple and Awwwards sites), we replace default linear CSS transitions with high-damping cubic-bezier vectors.

| Motion Type | Cubic-Bezier Curve | CSS Value | Timing | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Page Transitions** | `cubic-bezier(0.85, 0, 0.15, 1)` | `cubic-bezier(0.85, 0, 0.15, 1)` | `800ms` | Slow start, swift middle, long landing (extreme deceleration). |
| **Magnetic Pull** | Dynamic Physics | JS lerp logic | Elastic | Follows spring inertia. |
| **Hover Reveals** | `cubic-bezier(0.16, 1, 0.3, 1)` | `cubic-bezier(0.16, 1, 0.3, 1)` | `400ms` | Ultra-fast response with smooth deceleration (Custom Ease Out). |
| **Bento Glow** | `linear` | `linear` | `0ms` (Direct tracking) | Follows mouse position directly. |

---

## 1. Smooth Scrolling System (Lenis)

We configure Lenis with the following physics parameters:
*   `duration`: `1.2` seconds (smooth inertia tail).
*   `easing`: `(t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))` (exponential ease out).
*   `direction`: `vertical`
*   `smooth`: `true`

---

## 2. Cursor Lag & Magnetic Formula

The custom cursor consists of:
1.  **Cursor Dot**: Fixed position mapping `clientX` / `clientY`.
2.  **Cursor Ring**: Outer SVG ring using Linear Interpolation (lerp) for smooth lagging.

### Lerp Physics:
```javascript
// Frame update loop
currentX += (targetX - currentX) * lerpFactor;
currentY += (targetY - currentY) * lerpFactor;
// Where lerpFactor = 0.15 (smooth delay tail)
```

### Magnetic Snapping:
When hovering a magnetic element (e.g. `.magnetic-target` or buttons):
1.  Verify cursor distance from element center: `distance = sqrt(dx^2 + dy^2)`.
2.  If `distance < threshold` (e.g., 60px):
    *   Pull cursor dot to element center: `targetX = elemX + dx * magneticIntensity`.
    *   Translate the button container slightly: `translateElement(dx * 0.35, dy * 0.35)`.

---

## 3. Parallax Depth System

HTML sections use scroll-driven percentages to transform layers relative to viewport scroll progress:
*   **Hero Grid Layers**:
    *   Back layer: translate velocity `y * 0.1` (slower, far away).
    *   Mid layer: translate velocity `y * -0.05`.
    *   Fore layer: translate velocity `y * -0.2` (faster, moves past viewport).

---

## 4. Text Reveal System (Clip-Path & Transforms)

Lines of text are wrapped in overflow containers:
1.  *Initial State*: `transform: translateY(105%) rotate(5deg)`
2.  *Active State*: `transform: translateY(0) rotate(0deg)`
3.  *Trigger*: When element enters the viewport, apply transition `transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)`.
