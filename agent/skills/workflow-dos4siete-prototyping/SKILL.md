---
name: workflow-dos4siete-prototyping
description: Rules and workflow for Dos Siete Widget Development. Focuses on Static UI prototyping and automatic integration.
---

# DOS SIETE — Workflow de Prototipado

Este skill define la metodología de trabajo para el desarrollo de widgets en el proyecto Dos Siete.

## 1. Regla de Oro: Prototipos Estáticos (High-Fidelity Visuals)
*   **Enfoque:** Estamos construyendo una **DEMO VISUAL** de alta fidelidad, no una aplicación funcional conectada a backend.
*   **Datos:** Usa siempre **datos fijos (hardcoded)** que se vean perfectos. No intentes conectar APIs reales a menos que se pida explícitamente.
*   **Prioridad:** La estética y la "sensación" de la interfaz son lo más importante. Debe verse "Premium" y "State of the Art".
*   **Interacciones:** Simula flujos complejos (modales, cambios de estado) usando JavaScript simple y visual (clases CSS, timeouts).


## 2. Integración Automática (CRÍTICO)
*   **Regla OBLIGATORIA:** Cada vez que crees un **NUEVO WIDGET** (archivo `.html`), **DEBES INMEDIATAMENTE** añadir un enlace al menú principal `index.html`.
*   **No preguntar:** No preguntes al usuario si desea añadirlo. Hazlo como parte de tu definición de "Terminado".
*   **Formato:** Copia el estilo visual de los items anteriores en `index.html`.
    *   Usa el ID/Número siguiente (20, 21, etc.).
    *   Manten la coherencia de los colores (ej. si es Odoo, usa morado, si es Integración, usa azul/violeta).
*   **Ubicación:** Añade siempre al final de la grilla principal.

## 3. Trabajo Colaborativo (Agentes)
*   **Consistencia:** Antes de diseñar, revisa `agent/skills/design-system/SKILL.md` para asegurar el uso correcto de colores (Picton Blue), formas (Rounded) y tipografía.
*   **Verificación:** Asegúrate de que los widgets nuevos funcionen de forma aislada (standalone) pero compartan los recursos core (`dos4siete-core.css`, `dos4siete-widgets.js`).
