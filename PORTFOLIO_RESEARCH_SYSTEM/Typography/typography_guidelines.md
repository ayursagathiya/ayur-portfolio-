# Typography System Guidelines

This document details the typographic system designed for the Ayur Sagathiya premium UX/UI portfolio website. It translates principles of structured elegance from high-end technology and design brands (Apple, Stripe, Linear) into an implementable web scale.

## Font Family Pairing

| Usage | Font Name | Stack (Fallback) | Purpose |
| :--- | :--- | :--- | :--- |
| **Display & Headings** | **Satoshi-Variable** | `'Satoshi', 'Neue Montreal', -apple-system, sans-serif` | Provides a futuristic, geometric, high-contrast title structure. |
| **Body Copy & Metadata** | **Inter** | `'Inter', system-ui, -apple-system, sans-serif` | Offers high legibility at small sizes, clean neutral tracking. |

## Typography Scale & Hierarchy

Our scale uses a progressive responsive ratio to establish a clear visual hierarchy and structure.

```css
/* Core Scale Tokens */
:root {
  --fs-display-large: clamp(72px, 8vw, 120px);  /* Cinematic Name Reveals */
  --fs-display-medium: clamp(48px, 5vw, 72px);  /* Hero Keyphrase & Section Titles */
  --fs-h1: clamp(36px, 4vw, 48px);              /* Case Study Headings */
  --fs-h2: clamp(24px, 2.5vw, 32px);            /* Card Titles / Sub-headings */
  --fs-h3: clamp(20px, 2vw, 24px);              /* Group Labels */
  --fs-body: clamp(15px, 1.2vw, 16px);          /* Reading Passages */
  --fs-meta: clamp(12px, 1vw, 14px);            /* Captions, Timestamps, Labels */
}
```

### Details by Category

### 1. Large Display
*   **Font Family**: `Satoshi-Variable`
*   **Size**: `72px` to `120px` (using viewport-based scaling)
*   **Weight**: `800` (Bold / Black)
*   **Line Height**: `1.05` (Tight leading to group letters visually)
*   **Letter Spacing**: `-0.04em` (Negative tracking for display impact)

### 2. Hero Text
*   **Font Family**: `Satoshi-Variable`
*   **Size**: `48px` to `72px`
*   **Weight**: `700` (Bold)
*   **Line Height**: `1.15`
*   **Letter Spacing**: `-0.03em`

### 3. Case Study Titles & Section Titles
*   **Font Family**: `Satoshi-Variable`
*   **Size**: `36px` to `48px`
*   **Weight**: `600` (Semi-Bold)
*   **Line Height**: `1.2`
*   **Letter Spacing**: `-0.02em`

### 4. Body Paragraphs
*   **Font Family**: `Inter`
*   **Size**: `15px` to `16px`
*   **Weight**: `400` (Regular)
*   **Line Height**: `1.6` (Open leading for high readability)
*   **Letter Spacing**: `-0.01em`

### 5. Metadata & Labels
*   **Font Family**: `Inter`
*   **Size**: `12px` to `14px`
*   **Weight**: `500` (Medium) / `600` (Semi-Bold)
*   **Line Height**: `1.4`
*   **Letter Spacing**: `0.05em` (Wide tracking for modern tech label style, capitalized)

---

## Typography Usage & Rationale

1.  **Tight Display Leading**: Large headings must use a tight line height (`1.05 - 1.15`) because when letters are very large, standard spacing looks disconnected.
2.  **Tracking Contrast**: Display titles use negative letter spacing to bind the layout together, while uppercase labels use wide positive letter spacing (`0.05em` or `0.08em`) to act as decorative structural landmarks.
3.  **Variable Font Weighting**: When designing animated reveals (like scroll text reveals or landing preloader transitions), we alter font weight dynamically (e.g., from `300` to `700`) to represent animation density and state changes.
