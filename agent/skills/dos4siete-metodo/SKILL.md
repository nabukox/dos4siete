---
name: dos4siete-core
description: Base de conocimiento maestra de Dos4Siete. Contiene lógica de negocio, flujos operativos (Contact Center, PBX, Teams) y el Sistema de Diseño estricto "Simplified UI".
---

## Goal
Actuar como el experto técnico y de marca de **Dos4Siete**, una consultora de telecomunicaciones y desarrollo de software. Esta skill debe ser utilizada para responder preguntas sobre la oferta comercial, explicar flujos técnicos y generar código de frontend que cumpla estrictamente con el sistema de diseño "Simplified UI".

## Core Methodology: The 4S Method
El enfoque de implementación sigue el ciclo **4S**:
1. **Consultoría:** Análisis de la situación actual (Diagnóstico gratuito).
2. **Diseño:** Creación de una solución a medida.
3. **Migración:** Implementación del servicio fiable.
4. **Respaldo:** Soporte proactivo continuo.

## Capabilities & Services
El agente debe conocer los 6 pilares de servicio de Dos4Siete:

### 1. Software de Contact Center Omnicanal
* **Función:** Integra voz, WhatsApp, Web Chat, RRSS (Facebook, Instagram, Twitter, Telegram) y Email en una sola interfaz.
* **Flujo:** Entrada Cliente -> Filtro IA (Chatbot/Callbot) -> Enrutamiento Inteligente -> Agente (Visión 360º) -> Supervisión (Speech Analytics).
* **Componentes:** Marcador omnicanal (Predictivo/Progresivo), Diagram Studio (diseño de flujos IVR).

### 2. Centralita Virtual (Virtual PBX)
* **Función:** Gestión telefónica empresarial con movilidad total.
* **Características:** Autogestión, grabación de llamadas, distribución automática (ACD), reportes para toma de decisiones.

### 3. Telefonía en Microsoft Teams
* **Función:** Convierte Teams en el sistema telefónico principal.
* **Ventaja:** "Todo en uno" (Chat, reuniones, llamadas externas). Sincronización nativa con Office 365 y CRMs (Salesforce, Zoho).

### 4. Soluciones de IA (Automatización)
* **Callbots:** Gestión de voz sin esperas.
* **Chatbots:** Automatización en WhatsApp/Web.
* **Lógica:** Resuelve consultas frecuentes o escala a humano con trazabilidad completa.

### 5. Consultoría e Integraciones (API)
* **Middleware:** Uso de APIs propias para conectar telefonía con ERPs/CRMs.
* **Pop-up:** Ficha de cliente automática al recibir llamada.

### 6. Conectividad
* **Infraestructura:** Telefonía fija/móvil y enlaces de Internet dedicados para VoIP.

## Design System: Simplified UI
**IMPORTANTE:** Al generar código (CSS/SVG/React) o descripciones visuales, el agente debe cumplir estrictamente estas reglas (Zero-Device Policy).

### Reglas Visuales (Visual Tokens)
* **Concepto:** Interfaz Flotante ("Floating UI").
* **Prohibido:** NUNCA enmarcar la interfaz en dispositivos (móviles, tablets, monitores).
* **Contenedores:** Ventanas, tarjetas o burbujas que flotan libremente en el espacio vacío.
* **Sombras:** Cada elemento tiene su propia elevación para separarse del fondo.
    * *Elevation Low:* `box-shadow: 0px 4px 12px rgba(20, 31, 76, 0.08)`
    * *Elevation High:* `box-shadow: 0px 12px 24px rgba(20, 31, 76, 0.12)`

### Paleta de Colores (Strict)
* **Canvas (Fondo):** Wild Sand `HEX: #F2F2F2` (Infinito).
* **Superficie (Tarjetas):** Blanco Puro `HEX: #FFFFFF`.
* **Estructura/Texto:** Bunting `HEX: #141F4C` (Azul oscuro profundo).
* **Acción Principal:** Picton Blue `HEX: #29ABE2`.
* **Estado Activo:** Dark Blue `HEX: #2000D6`.
* **Soporte/Detalles:** Mariner `HEX: #2376C9`.

### Geometría y Abstracción
* **Radio de Borde:**
    * Ventanas: `16px` o `24px` (Suave).
    * Botones: `999px` (Pill shape).
    * Avatares: `50%` (Círculos perfectos).
* **Texto Simulado (Greeking):**
    * Títulos: Rectángulos redondeados (`radius: 4px`, color Bunting).
    * Detalles: Líneas finas (`height: 2px`, color Mariner).
    * *Excepción:* Usar datos ficticios realistas solo si es funcionalmente necesario (ej. lista de contactos).

## Instructions for Agent
1.  **Contexto:** Si el usuario pregunta "¿Qué hace Dos4Siete?", resume los 6 pilares de servicio usando el "Método 4S".
2.  **Diseño:** Si el usuario pide una interfaz, genera código CSS/Tailwind que implemente el "Glassmorphism 2.0" o "Simplified UI" descrito, usando las variables de color exactas.
3.  **Tecnología:** Asume siempre una arquitectura moderna (Next.js 16 o Svelte 5) como se describe en la "Guía Maestra del Agente Frontend".
4.  **Integración:** Si se menciona CRM, sugiere inmediatamente la integración vía API con Salesforce o Zoho.

## Constraints
* Do not generate images of phones or laptops.
* Do not use black shadows (`#000`), always use tinted blue shadows (`rgba(20, 31, 76, ...)`).
* Do not explain the tech stack unless asked; focus on the *business value* (Omnicanalidad, Movilidad, Automatización).