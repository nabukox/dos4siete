---
description: detailed verification of frontend code, focusing on interactions, initialization, and async logic.
---

# Frontend Code Verification Skill

Use this skill when verifying complex frontend interactions, debugging race conditions, or checking if code is properly initialized. It systematizes the process of ensuring that "all parts of the machine are connected."

## 1. Initialization Checklist

When looking at a page or widget that isn't working, verify these "Handshake" points first:

*   **Is the function actually CALLED?**
    *   *Common Error:* Defining `window.MyModule.init()` but never calling it in the HTML.
    *   *Check:* Look for the `script` tag at the bottom of the HTML or the main entry point file.
    *   *Fix:* Ensure `if (window.MyModule) window.MyModule.init();` exists and runs.

*   **Is the environment ready?**
    *   *Common Error:* Calling init logic before dependencies (like global variables or libraries) are loaded.
    *   *Check:* Are you using `DOMContentLoaded` or `window.addEventListener('load')`?
    *   *Rule:* Use `DOMContentLoaded` for internal logic. Use `load` only if you need external assets (images/styles) to be fully ready.

## 2. Element Existence & Selection

Before adding an event listener or manipulating an element, verify it exists.

*   **Null Checks**:
    *   *Bad:* `document.getElementById('btn').addEventListener(...)` (Crashes if null).
    *   *Good:*
        ```javascript
        const btn = document.getElementById('btn');
        if (btn) {
            btn.addEventListener(...);
        } else {
            console.warn('Button #btn not found!');
        }
        ```

*   **Dynamic Elements**:
    *   If an element is created dynamically (e.g., inside a modal or list), standard listeners won't work if attached before creation.
    *   *Fix:* Use **Event Delegation** (attach to a static parent) or re-bind listeners after creation.

## 3. Asynchronous Logic & Race Conditions

When multiple things happen "at the same time" (animations, data fetching, script loading):

*   **The "Double Check" Pattern**:
    *   If relying on a specific state (like `document.readyState`), check it *immediately* AND add a listener as a fallback.
    *   *Example:*
        ```javascript
        if (document.readyState === 'complete') {
            run();
        } else {
            window.addEventListener('load', run);
        }
        ```

*   **Visual vs Logical Delays**:
    *   UI animations take time. Don't trigger a logical action immediately after a visual trigger if the UI needs to settle.
    *   *Rule:* Use `setTimeout` or `await wait(ms)` to allow CSS transitions to finish before manipulating the DOM further.

## 4. Interaction Validation (The "Ghost" Check)

When implementing automated demos or complex flows:

1.  **Visually Confirm**: Does the element I'm trying to click actually exist on screen? Is it hidden (`opacity: 0`, `display: none`)?
2.  **Scroll into View**: Can the user (or bot) see it? Use `.scrollIntoView()` before clicking if needed.
3.  **Z-Index**: Is something covering it? (Overlays, other modals).

## 5. Console Tracing

Don't guess. Add trace logs to verify the *Order of Operations*.

```javascript
console.log("1. Init called");
// ...
console.log("2. Listener attached");
// ...
console.log("3. Click triggered");
```

If you see "1" and "3" but not "2", you know the listener code was skipped.
