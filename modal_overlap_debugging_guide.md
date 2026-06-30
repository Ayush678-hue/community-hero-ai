# Debugging Guide: React Modal Overlapping Incorrectly With Map Component

This guide details resolutions for cases where Leaflet map layers, tiles, or controls bleed through modal overlays, along with CSS layer override guidelines.

---

## Part 1: Stacking Contexts in Maps

Mapping libraries like Leaflet render interactive layers (panes, tiles, and popups) using CSS translations and absolute coordinates:

```css
position: absolute;
z-index: 400; /* Pane layer default */
transform: translate3d(...);
```

Because transforms create independent stacking contexts in HTML rendering engines, high `z-index` parameters defined on modals can fail if the map container’s parent hierarchy has translation styles.

---

## Part 2: Global CSS Resets for Leaflet

To resolve map overlap conflicts, isolate Leaflet's layers by applying global `!important` z-index limits in your stylesheet (`globals.css`):

```css
/* Restricts map canvas layering context */
.leaflet-container {
  z-index: 1 !important;
}

/* Restricts vectors, markers, and path overlays */
.leaflet-pane {
  z-index: 1 !important;
}

/* Restricts map zoom/attribution buttons */
.leaflet-control-container {
  z-index: 2 !important;
}
```

---

## Part 3: Modal Container CSS Requirements

1. **Fixed Positioning**: fullscreen overlays must use `position: fixed` to escape parent grid offsets.
2. **Elevated Layering**: set the overlay backdrop index to `z-[9999]` and form panels to `z-[10000]`.

```javascript
// Tailwind CSS Example
<div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center">
  <div className="relative z-[10000] bg-white rounded-3xl p-6 w-full max-w-2xl">
    <h2>Report Civic Hazard</h2>
    {/* Form contents */}
  </div>
</div>
```

---

## Part 4: Preventing Background Map Interactions

Ensure map interactions are disabled while the modal overlay is active:

```javascript
import { useEffect } from "react";

function Modal({ isOpen, mapInstance }) {
  useEffect(() => {
    if (!mapInstance) return;
    if (isOpen) {
      mapInstance.dragging.disable();
      mapInstance.scrollWheelZoom.disable();
    } else {
      mapInstance.dragging.enable();
      mapInstance.scrollWheelZoom.enable();
    }
  }, [isOpen, mapInstance]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[9999] ...">
      {/* Modal */}
    </div>
  );
}
```
