---
description: Procedure for preparing widgets for export and embedding in 3rd party sites
---

# Widget Export & Embedding Protocol

This skill outlines the standard procedure for converting development widgets (standalone HTML files) into production-ready, embeddable code fragments. This ensures widgets can be embedded into other websites (WordPress, Odoo, Landing Pages) without breaking the host site or the widget itself.

## 1. Objective
Transform a standalone HTML file (containing `<html>`, `<head>`, `<body>`) into a **safe, scoped, and portable HTML Fragment** wrapped in a container.

## 2. Refactoring Steps

### Step 1: Fragment Containerization
1.  **Remove structural tags**: Delete `<!DOCTYPE html>`, `<html>`, `<head>`, and `<body>`.
2.  **Create a Root Container**: Wrap the entire content in a single `div` with a **unique ID**.
    ```html
    <!-- BEFORE -->
    <body>
       <div class="card">...</div>
    </body>

    <!-- AFTER -->
    <div id="d27-widget-name-embed" class="w-full relative ...">
       <div class="card">...</div>
    </div>
    ```

### Step 2: CSS Scoping (CRITICAL)
Styles defined in `<style>` blocks often target `body` or generic elements. This **WILL BREAK** the host site.
*   **Action**: Prefix ALL CSS rules with the Root Container ID.
    ```css
    /* BAD */
    body { background: #f0f0f0; }
    .card { padding: 20px; }

    /* GOOD */
    #d27-widget-name-embed { background: transparent; } /* Do not touch global body */
    #d27-widget-name-embed .card { padding: 20px; }
    ```
*   **Font Handling**: Do not set global fonts on `body`. Set them on the Root Container.

### Step 3: Asset & Script Management
*   **External Libraries (Tailwind, Fonts)**: Do NOT include `<script src="...tailwind...">` directly active in the fragment if the host might already have it.
    *   *Recommendation*: Comment them out at the top of the fragment with instructions.
    *   *Alternative*: Use a loader script that checks for existence before appending.
*   **Images**: Ensure image paths are accessible from the host domain. Relative paths (`../assets/...`) will BREAK if the embedding page is not in the same directory structure.
    *   *Fix*: Convert to Absolute URLs (e.g., `https://cdn.dos4siete.com/assets/...`) or ensure the assets folder travels with the embed.

## 3. Risk Assessment & "Fails" Evaluation

| Potential Failure | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **Global Style Pollution** | The widget overwrites the host site's `body`, `h1`, or `p` styles. | **Strict Scoping**: Never write loose CSS selectors. Always nest inside the unique `#id`. |
| **ID Collisions** | Host site has an element `#modal` and widget has `#modal`. JS breaks. | **Namespacing**: Prefix all IDs (e.g., `id="d27-int-modal"`). |
| **Z-Index Wars** | Widget dropdowns disappear behind host nav, or widget overlay blocks host menu. | **Contextual Z-Index**: wrapper should establish a stacking context (`isolation: isolate` or `position: relative` with specific z-index). |
| **Broken Images** | Images fail to load on target site. | **Absolute Paths**: Use full URLs for production, or strictly defined asset bundles. |
| **Double Script Loading** | Tailwind/FontAwesome loaded twice, causing lag or conflicts. | **Conditional Loading**: Document dependencies clearly for the integrator. |
| **Viewport Overflow** | Widget creates horizontal scroll on mobile. | **Responsive Container**: Ensure Root Container has `max-width: 100%` and `overflow-x: hidden` if necessary. |

## 4. Verification Checklist
- [ ] Is `<html>`, `<body>`, `<head>` removed?
- [ ] Is there a single top-level `div` wrapper with a unique ID?
- [ ] Are ALL styles scoped to this ID? (Check for `body`, `*`, `:root` in CSS).
- [ ] Are relative image paths handled?
- [ ] Are script tags handled (commented or managed)?
