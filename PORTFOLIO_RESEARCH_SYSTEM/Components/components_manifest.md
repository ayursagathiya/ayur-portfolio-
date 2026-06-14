# UI Component Manifest

This manifest documents the exact structural specifications, states, responsive dimensions, and variations for all elements utilized on the Ayur Sagathiya interactive portfolio.

## 1. Hero Section (Cinematic Hero)
*   **Dimensions**: Full Viewport (`100vh`)
*   **Grid**: 12-column layout with center Display alignment.
*   **Interactive Components**:
    *   **Name Mask Reveal**: Dynamic name text using CSS clip-path mask.
    *   **Floating UI Panel**: Glassmorphic widgets that translate in 3D based on cursor movement.
    *   **Background Interactive Canvas**: Dynamic vector nodes reacting to the cursor position.
*   **States**:
    *   *Default*: Center title, smooth preloading animation completion trigger.
    *   *Cursor Track*: Translates depth groups (`layer-back`, `layer-mid`, `layer-fore`) between -15px and +15px.

## 2. Navigation & Side Navigation
*   **Dimensions**:
    *   *Top Nav*: Height `80px`, absolute position.
    *   *Side Nav*: Width `64px`, floating right on high screens, collapsible on mobile.
*   **States**:
    *   *Default Top Nav*: Transparent background.
    *   *Scrolled Top Nav*: Backdrop-filter blur (`12px`), background `rgba(5, 5, 5, 0.75)`.
    *   *Side Nav Hover*: Magnetic circle expanding around icons.

## 3. Progress Indicators
*   **Structure**: Top bar indicator + Right-side section dot highlights.
*   **Usage**: Tracks current scroll position using Lenis update events.
*   **Gradients**: Uses `primary_gradient` (Indigo -> Purple -> Cyan).

## 4. Project & Case Study Cards
*   **Dimensions**: Responsive grid. Desktop: `1:1` or `16:10` panels.
*   **Interaction Models**:
    *   **3D Perspective Tilt**: Skews container along X and Y axes on mousemove.
    *   **Image Reveal**: Scale transition (`1.15` down to `1.0`) combined with overflow clipping.
    *   **Magnetic Hover Trigger**: Text labels slide up on hover.

## 5. Device Mockups
*   **Voltify Mockup**: iPhone glass layout. Includes battery charging, active station map node, and status screens.
*   **Coffee Shop Landing**: 3D MacBook skew overlay, floating coffee beans.
*   **Airport Wayfinding**: Full-screen digital terminal cockpit with active departure dashboards.
*   **Implementation**: Pure HTML/CSS styled layouts with interactive scroll parallax to avoid heavy glTF loads.

## 6. Statistics Section
*   **Structure**: 4-column glass container.
*   **Metrics**:
    *   `15+` UI/UX Projects Completed
    *   `98%` Friction-less Score
    *   `3` Premium Case Studies
*   **Interactions**: Counters trigger using intersection observer.

## 7. Skills & Tools Grid
*   **Layout**: Apple-style bento grid layout with varying card shapes.
*   **Interactive State**: Hover over tool cards initiates a radial gradient glow reflecting off the border (`surface_glass_glow`).

## 8. Testimonials Carousel
*   **Structure**: Interactive slide cards with fade transitions.
*   **Features**: Draggable slider, custom cursor morphs into "DRAG".

## 9. Contact Form
*   **Structure**: Minimal glass text fields.
*   **Hover/Focus States**: Input label slides up; border glows purple. Submit button is magnetic.
