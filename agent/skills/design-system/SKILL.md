---
name: design_system
description: Official Dos Siete Design System rules for Simplified UI and Motion. Use this to ensure visual consistency.
---
# DOS SIETE — Sistema de Diseño para Simplified UI & Motion
Este documento define las reglas estrictas para la generación de assets gráficos animados (Motion Graphics) y prototipos de interfaz simplificada (Simplified UI) para la marca DOS SIETE.
1. Filosofía Visual (Concepto)
Núcleo: La comunicación genera nuevas soluciones. La unión de dos puntos crea algo nuevo (la vesica).
Estilo: "Simplified UI" (Interfaz Simplificada). Abstracción geométrica, limpieza, sin ruido visual.
Regla de Oro (Zero-Device Policy):
PROHIBIDO: Enmarcar la interfaz dentro de tablets, teléfonos, monitores o cualquier hardware.
OBLIGATORIO (Floating UI): Los elementos son ventanas, tarjetas o burbujas que flotan libremente en el espacio vacío (Canvas). Cada elemento tiene su propia sombra (elevación) para separarse del fondo. No hay "bordes de pantalla".
Formas: Predominancia del CÍRCULO (inspirado en el isotipo). Las interfaces son contenedores suaves y amigables.
2. Design Tokens (La Verdad Inmutable)
A. Paleta de Colores (Extraída del Manual)
Usa estos valores EXCLUSIVAMENTE. Se incluyen valores RGB para verificación con el manual PDF.
Colores de Estructura (Canvas & UI):
Canvas (Fondo):
Nombre: Wild Sand
HEX: #F2F2F2
RGB: 242, 242, 242
Uso: Fondo infinito sobre el que flotan las ventanas.
Superficie (Tarjetas/Ventanas):
Nombre: Blanco Puro
HEX: #FFFFFF
RGB: 255, 255, 255
Uso: El fondo de cada ventana flotante individual.
Estructura/Texto Simulado:
Nombre: Bunting
HEX: #141F4C
RGB: 20, 31, 76
Uso: Bloques de texto (greeking), iconos inactivos.
Colores de Acción (Marca):
Primary Action (Llamada Entrante/Notificación):
Nombre: Picton Blue
HEX: #29ABE2
RGB: 41, 171, 226
Uso: Botones principales, estados de alerta positiva, pulsos.
Active State (En Llamada/Conectado):
Nombre: Dark Blue
HEX: #2000D6
RGB: 32, 0, 214
Uso: Estado seleccionado, activo, profundidad.
Secondary Support:
Nombre: Mariner
HEX: #2376C9
RGB: 35, 118, 201
Uso: Elementos secundarios, hovers, avatares.
B. Geometría y Formas (Simplified UI)
Radio de Borde (Border Radius):
Ventanas Flotantes: 16px o 24px (Muy redondeado, amigable).
Botones: 999px (Pill shape).
Avatares: 50% (Círculos perfectos).
Abstracción de Texto (Greeking):
Títulos: Rectángulos redondeados (radius: 4px). Color: #141F4C (Bunting).
Detalles: Líneas finas. Color: #2376C9 (Mariner).
Sombras (La clave del efecto Flotante):
Elevation-Low (Elementos en reposo): 0px 4px 12px rgba(20, 31, 76, 0.08)
Elevation-High (Elementos activos/Modales): 0px 12px 24px rgba(20, 31, 76, 0.12)
Nota: La sombra debe tener un tinte azulado (Bunting), nunca negro puro.
4. Prompt Template para Generación
(Usa esto para pedir nuevas animaciones al agente)
"Genera una guía visual y código SVG/CSS para una micro-interacción de
$$NOMBRE DE LA FUNCIÓN$$
.
Contexto de Hero: Interfaz flotante en espacio abstracto.$$Descripción breve$$
.
Acción:$$Click / Hover / Drag$$
.
Restricción CRÍTICA: NO USAR DISPOSITIVOS (Tablets/Móviles). Diseña ventanas flotantes independientes con sombras suaves sobre fondo Wild Sand. Usa los Design Tokens de DOS SIETE."
