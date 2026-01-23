# Guía de Integración de Widgets en WordPress

Este documento detalla cómo trasladar los widgets desarrollados en este entorno local a una página web de producción (WordPress).

## Estructura de Archivos
El proyecto se ha organizado para facilitar la modularidad:
*   `assets/css/dos4siete-core.css`: **Hoja de Estilos Maestra**. Contiene todas las variables de color, tipografía y clases de utilidad compartidas.
*   `assets/js/`: Scripts compartidos (ej. gráficas).
*   `widgets/`: Archivos HTML individuales que contienen la estructura de cada widget.

## Paso 1: Dependencias Globales
Para que los widgets se vean correctamente, debes incluir estas dependencias en el `<head>` de tu sitio web (o en el `header.php` de tu tema de WordPress).

### 1. Tailwind CSS
Recomendamos usar la versión de producción o el CDN si es para prototipado rápido:
```html
<script src="https://cdn.tailwindcss.com"></script>
```

### 2. Fuentes y Iconos
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
```

### 3. Estilos Core (IMPORTANTE)
Copia el contenido de `assets/css/dos4siete-core.css` y pégalo en el CSS personalizado de tu WordPress (Apariencia > Personalizar > CSS Adicional) o en tu hoja de estilos principal.

### 4. Scripts Core (NUEVO)
Para que funcionen los paneles interactivos, incluye este script globalmente (recomendado en footer):
```html
<script src="assets/js/dos4siete-widgets.js"></script>
```

## Paso 2: Insertar un Widget
Abre el archivo HTML correspondiente de `widgets/`.
*   Copia el bloque `.app-container` (o el contenido principal).
*   Asegúrate de inicializar el widget llamando a la función correspondiente si no se carga automáticamente (los ejemplos incluyen un pequeño script de inicialización al final que también debes copiar).

### Lista de Widgets:

1.  **Gestión de Colas (Panel)**
    *   Archivo: `widgets/widget-colas-panel.html`
    *   Init JS: `window.Dos4Siete.initQueuePanel();`

2.  **Gestión de Colas (Auto Demo)**
    *   Archivo: `widgets/widget-colas-demo.html`
    *   Init JS: `window.Dos4Siete.initQueueDemo();`

3.  **Estadísticas Visuales**
    *   Archivo: `widgets/widget-stats-visual.html`
    *   Init JS: `window.Dos4Siete.initStats();`

4.  **Transferencia Inteligente**
    *   Archivo: `widgets/widget-transferencia-demo.html`
    *   Descripción: Animación CSS pura y HTML (algunos scripts simples incluidos).

5.  **Estadísticas Simple (React)**
    *   Archivo: `widgets/widget-stats-simple.html`
    *   Nota: Requiere configuración de Módulos ES6.

6.  **Transferencia Manual**
    *   Archivo: `widgets/widget-transferencia-manual.html`
    *   Descripción: Escena de marketing tipo "Hero". Incluye el logo y textos descriptivos.

## Solución de Problemas
*   **Se ve sin estilos**: Verifica que `dos4siete-core.css` se haya cargado.
*   **No funcionan los iconos**: Verifica que FontAwesome esté cargado.
*   **React no carga**: Revisa la consola del navegador por errores de CORS. El widget de React (`simple`) usa módulos que pueden requerir un servidor HTTPS o configuración específica si los archivos JS no están en la misma ruta relativa. Se recomienda subir `assets/js/chart-calls.js` a tu servidor y actualizar la ruta en el import.
