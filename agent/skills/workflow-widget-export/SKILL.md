---
description: Standard Procedure for Creating Embeddable Widgets (Hybrid Approach)
---

# Widget Export & Embedding Protocol (Hybrid Standard)

This skill outlines the standard procedure for creating widgets that serve two purposes simultaneously:
1.  **Standalone Development**: A fully functional HTML page (`<html>`, `<body>`, etc.) for local viewing and debugging.
2.  **Embeddable Fragment**: A clearly demarcated section ready for copy-pasting into 3rd party sites (WordPress, Odoo, Landing Pages).

## 1. File Structure Standard

Every widget file must follow this "Hybrid" structure. Do NOT delete `<html>` or `<body>` tags.

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <!-- Dev-only resources (Tailwind CDN, Fonts, etc.) -->
    <!-- These headers simulate the host environment -->
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* Dev-only centering for presentation */
        body { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f0f0f0; }
    </style>
</head>
<body>

<!-- 
    ==========================================================================
    START EMBED CODE
    Copy from here to "END EMBED CODE" to include this widget in another page.
    Ensure Tailwind CSS and FontAwesome are loaded in the host page.
    ==========================================================================
-->

<div id="UNIQUE-WIDGET-ID" class="relative w-full ...">
    
    <style>
        /* CRITICAL: ALL Widget styles must be SCOPED to the Container ID */
        #UNIQUE-WIDGET-ID { font-family: 'Outfit', sans-serif; }
        #UNIQUE-WIDGET-ID .btn { background: red; }
        
        /* DO NOT write global styles here like "body { ... }" */
    </style>

    <!-- Widget Content Goes Here -->

</div>

<!-- 
    ==========================================================================
    END EMBED CODE
    ==========================================================================
-->

</body>
</html>
```

## 2. Refactoring Checklist

### A. Containerization
1.  **Unique ID**: The top-level element *inside* the embed block must have a unique ID (e.g., `id="d27-integraciones-embed"`).
2.  **No Global Tags**: The embed block must NOT contain `<html>`, `<head>`, or `<body>`.

### B. CSS Scoping (The Golden Rule)
*   **Rule**: ALL internal `<style>` blocks must prefix every selector with the Main Container ID.
*   **Why**: To prevent the widget from breaking the host site's header, footer, or typography.
    *   ❌ Bad: `.card { ... }` (Might affect host site cards)
    *   ❌ Bad: `body { ... }` (Will break host site background/scroll)
    *   ✅ Good: `#UNIQUE-WIDGET-ID .card { ... }`
    *   ✅ Good: `#UNIQUE-WIDGET-ID { overflow: hidden; }`

### C. Asset Management
*   **Images**: Use **Absolute Paths** if possible (e.g., `https://cdn.dos4siete.com/img/logo.png`). If using relative paths (`../assets/`), explicitly warn the user that these paths must match the target server structure.
*   **Dependencies**: Tailwind, FontAwesome, and Google Fonts should be loaded in the `<head>` for development. Add a comment in the Embed Code advising the user to ensure these are present in the host site.

## 3. Workflow for "Exporting"
1.  **Develop** the widget normally.
2.  **Wrap** the core component in the unique ID `div`.
3.  **Scope** all CSS.
4.  **Add** the `START EMBED CODE` / `END EMBED CODE` comment blocks.
5.  **Test**: Open the file in a browser. It should look centered and correct.
6.  **Verify**: Copy only the content between the comments and paste into a test page (or `embed-test.html`) to ensure it works without the parent `<html>` context.

## 4. Common Pitfalls
*   **Viewport Heights**: Avoid `h-screen`. Use `min-h-[600px]` or specific heights on the container. `h-screen` will force the widget to take the full page height of the host, often breaking layouts.
*   **Z-Index**: Use explicit z-indexes within your container, but avoid massive values (`z-[9999]`) unless it's a modal overlay intended to cover the *entire* host site.
*   **Conflicts**: Watch out for generic class names if you aren't using Tailwind. If using standard CSS classes like `.button`, scoping is mandatory.
