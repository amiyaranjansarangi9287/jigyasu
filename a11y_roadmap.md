# Post-Launch Accessibility (A11Y) Roadmap

This document outlines the systematic plan to address the remaining accessibility (A11Y) conditions identified in the Jigyasu V1 audit.

## Month 1: Keyboard Navigation (Condition 5a)
**Goal:** Ensure 100% of the platform can be navigated without a mouse or touch interface.
- **Canvas Simulators**: Implement an internal spatial grid for all `<canvas>` components (Tiny World, Physics Labs) that tracks a `focusedNode` coordinate.
- **Key Bindings**: Standardize `ArrowKeys` for spatial movement, `Enter` for activation, and `Escape` for exiting a module.
- **Focus Rings**: Ensure custom HTML elements correctly utilize Tailwind's `focus-visible:ring-4` to draw clear boundaries around active elements.

## Month 2: ARIA Coverage (Condition 5b)
**Goal:** Ensure 100% screen-reader compatibility (NVDA, JAWS, VoiceOver).
- **Icon-Only Buttons**: Audit all buttons across `src/components` and inject `aria-label` where text content is missing (e.g., the Wonder Garden seed button, close icons).
- **Dynamic Content**: Implement an invisible `aria-live="polite"` readout region for real-time score updates, module completions, and physics variable changes.
- **Form Context**: Ensure all error states and input hints are tied to their respective inputs using `aria-describedby`.

## Quarter 2: Cognitive & Visual Enhancements
**Goal:** Expand our design system for cognitive accessibility.
- **Text Labels**: Officially connect the `showLabels` toggle in Tiny World to the canvas renderer to draw high-contrast text beneath emojis for children developing reading skills.
- **Heading Hierarchy**: Run a systemic sweep of all routes to guarantee a strict `h1 -> h2 -> h3` flow, removing any skipped heading levels that confuse screen readers.
