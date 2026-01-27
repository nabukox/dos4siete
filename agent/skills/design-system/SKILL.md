---
name: design_system
description: Official Dos Siete Design System rules for Simplified UI and Motion. Use this to ensure visual consistency.
---

# DOS SIETE — Sistema de Diseño

Este documento define las reglas estrictas para la generación de assets gráficos animados (Motion Graphics) y prototipos de interfaz simplificada (Simplified UI) para la marca DOS SIETE.

## 1. Filosofía Visual

> **Concepto Central:** La comunicación genera nuevas soluciones. La unión de dos puntos crea algo nuevo (la vesica).

### Estilo: "Simplified UI"
*   **Definición:** Abstracción geométrica, limpieza absoluta, eliminación de ruido visual.
*   **Formas:** Predominancia del **CÍRCULO** (inspirado en el isotipo). Interfaces suaves y amigables.

### 🚫 Regla de Oro: Zero-Device Policy
*   **PROHIBIDO:** Enmarcar la interfaz dentro de tablets, teléfonos, monitores o cualquier hardware realista.
*   **OBLIGATORIO (Floating UI):** Los elementos son ventanas, tarjetas o burbujas que flotan libremente en el espacio vacío (Canvas).
    *   Cada elemento tiene su propia sombra (elevación).
    *   No existen los "bordes de pantalla".

---

## 2. Identidad Visual (Design Tokens)

Estas son las verdades inmutables del sistema. Usa estos valores **EXCLUSIVAMENTE**.

### 🎨 A. Paleta de Colores

#### Colores de Estructura (Canvas & UI)
| Muestra | Nombre | HEX | RGB | Uso Principal |
| :---: | :--- | :--- | :--- | :--- |
| ⬜ | **Wild Sand** | `#F2F2F2` | `242, 242, 242` | **Fondo (Canvas)**. Espacio infinito. |
| ⚪ | **Blanco Puro** | `#FFFFFF` | `255, 255, 255` | **Superficie**. Ventanas y tarjetas flotantes. |
| 🌑 | **Bunting** | `#141F4C` | `20, 31, 76` | **Texto/Estructura**. Bloques de texto simulado, iconos inactivos. |

#### Colores de Acción (Marca)
| Muestra | Nombre | HEX | RGB | Uso Principal |
| :---: | :--- | :--- | :--- | :--- |
| 🔵 | **Picton Blue** | `#29ABE2` | `41, 171, 226` | **Primary Action**. Botones, alertas positivas, pulsos. |
| 🟦 | **Dark Blue** | `#2000D6` | `32, 0, 214` | **Active State**. Selección, estado activo, profundidad. |
| 🔷 | **Mariner** | `#2376C9` | `35, 118, 201` | **Support**. Elementos secundarios, hovers, avatares. |

### 📐 B. Geometría y Formas

#### Radio de Borde (Border Radius)
*   **Ventanas Flotantes:** `16px` o `24px` (Muy redondeado y amigable).
*   **Botones:** `999px` (Pill shape).
*   **Avatares:** `50%` (Círculos perfectos).

#### Abstracción de Texto (Greeking for Simplified UI)
*   **Títulos:** Rectángulos redondeados (`radius: 4px`). Color: **Bunting** (`#141F4C`).
*   **Detalles:** Líneas finas. Color: **Mariner** (`#2376C9`).

#### Sombras (Elevación)
> **Nota:** La sombra debe tener un tinte azulado (usando color Bunting), nunca negro puro.

1.  **Elevation-Low (Reposo):** `0px 4px 12px rgba(20, 31, 76, 0.08)`
2.  **Elevation-High (Activo/Modal):** `0px 12px 24px rgba(20, 31, 76, 0.12)`

---

## 3. Prompt Template para Generación

Copia y pega este prompt cuando pidas nuevas animaciones o diseños al agente.

```text
Genera una guía visual y código SVG/CSS para una micro-interacción de:
[NOMBRE DE LA FUNCIÓN]

Contexto de Hero: Interfaz flotante en espacio abstracto.
[Descripción breve]

Acción:
[Click / Hover / Drag]

Restricción CRÍTICA: NO USAR DISPOSITIVOS (Tablets/Móviles). Diseña ventanas flotantes independientes con sombras suaves sobre fondo Wild Sand. Usa los Design Tokens de DOS SIETE.
```
