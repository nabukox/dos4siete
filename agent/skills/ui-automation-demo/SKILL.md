---
description: Create automated UI demos with a visible "ghost cursor" that simulates user interaction.
---

# UI Automation Demo Skill

This skill provides a standard pattern for creating automated "self-driving" UI demos using a simulated cursor. This is useful for showcasing workflows without user interaction.

## 1. HTML Structure (The Cursor)

Add this cursor element to the `<body>` of your HTML file. It uses Tailwind CSS for positioning and transitions.

```html
<!-- Demos Cursor -->
<div id="demo-cursor"
    class="fixed top-0 left-0 z-[9999] pointer-events-none transition-transform duration-700 ease-in-out flex items-center justify-center opacity-0"
    style="display: flex;"> <!-- Inline display to prevent overrides -->
    
    <!-- Cursor Icon (Font Awesome) -->
    <i class="fas fa-mouse-pointer text-black text-2xl drop-shadow-xl transform rotate-[-15deg] transition-transform duration-150"></i>
    
    <!-- Click Ripple Effect (Optional) -->
    <div class="absolute w-12 h-12 bg-white/30 rounded-full animate-ping -z-10 hidden" id="click-effect"></div>
</div>
```

**Key Attributes:**
- `fixed`: Ensures it floats above everything relative to the viewport.
- `pointer-events-none`: Crucial so it doesn't intercept actual clicks.
- `z-[9999]`: Must be the highest layer.
- `transition-transform duration-700`: Controls the smoothness of the movement.

## 2. JavaScript Module Pattern

Implement a dedicated module (e.g., `DemoAutomationModule`) to control the cursor.

### Core Helpers

```javascript
const DemoAutomationModule = {
    // Helper: Promisified Wait
    wait: ms => new Promise(r => setTimeout(r, ms)),

    // Helper: Move Cursor
    async moveCursorTo(selector) {
        const cursor = document.getElementById('demo-cursor');
        const el = document.querySelector(selector);
        
        if (!el) { console.warn(`Target not found: ${selector}`); return; }
        if (!cursor) { console.warn("Cursor not found"); return; }

        // Ensure Visibility
        cursor.classList.remove('opacity-0');
        cursor.style.opacity = '1';

        // Calculate Position
        const rect = el.getBoundingClientRect();
        // Target center
        const x = rect.left + (rect.width / 2);
        const y = rect.top + (rect.height / 2);

        // Move
        cursor.style.transform = `translate(${x}px, ${y}px)`;

        // Wait for transition to finish (match CSS duration + buffer)
        await this.wait(800); 
    },

    // Helper: Simulate Click (Visual + Logic)
    async clickCursor() {
        const cursor = document.getElementById('demo-cursor');
        const icon = cursor?.querySelector('i');
        const effect = document.getElementById('click-effect');

        // Visual Down
        if (icon) icon.style.transform = "scale(0.8) rotate(-15deg)";
        if (effect) {
            effect.classList.remove('hidden');
            setTimeout(() => effect.classList.add('hidden'), 300);
        }
        await this.wait(150);

        // Visual Up
        if (icon) icon.style.transform = "scale(1) rotate(-15deg)";
        await this.wait(150);
    },

    // Helper: Initialize Sequence reliably
    init: function() {
        // Run immediately if DOM is ready, otherwise wait
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            this.runSequence();
        } else {
            window.addEventListener('DOMContentLoaded', () => this.runSequence());
        }
    },

    // THE SEQUENCE
    async runSequence() {
        console.log("Starting Demo Sequence...");
        await this.wait(1000); // Initial delay

        // Example Step 1: Click a button
        await this.moveCursorTo('#my-button-id');
        await this.clickCursor();
        document.getElementById('my-button-id')?.click(); // Trigger actual event
        
        await this.wait(1000); // Wait for reaction

        // Loop using reload (Optional)
        // window.location.reload();
    }
};
```

## 3. Usage Rules

1.  **Unique IDs**: Ensure every element interactable by the demo has a unique `id` for reliable selection.
2.  **Visual vs Logical**: The `clickCursor()` function is purely *visual*. You MUST manually trigger the actual click logic (e.g., `.click()`) or function call immediately after it.
3.  **Timing**: Always add `await this.wait(ms)` after actions to allow UI animations (modals opening, panels sliding) to complete before moving to the next step.
4.  **Robust Initialization**: Use the `readyState` check in `init` to avoid race conditions where `load` listeners might be missed.
