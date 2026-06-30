# Complete Debugging Walkthrough: React Router "Invisible / Blank Page" Issue

This walkthrough outlines the exact procedures, checks, and resolutions to debug and resolve invisible or blank pages during routing transitions in a React + React Router setup.

---

## Part 1: Root Cause Analysis

When clicking a link updates the URL in the address bar but displays a blank page beneath the layout/navbar, the failure is usually caused by one of the following:

### Router-Level Issues
1. **Route Path Mismatch**: Typographical errors in `<Route path="..." />` strings.
2. **Missing Outlet**: If the route is nested inside a parent layout, the parent component fails to render `<Outlet />`.
3. **BrowserRouter Placement**: The context provider is missing or wrapping the incorrect node level.

### Component-Level Issues
1. **Broken Default/Named Exports**: Importing default components with brackets, or named components without brackets.
2. **Component Returns Null**: Component returns `null` or crashes before rendering due to state exceptions.

### CSS Rendering Issues
1. **Opacity/Visibility Overlay**: Layout utilities applying `opacity-0` or `hidden` classes.
2. **Collapsed Layout Height**: Flex layouts collapsing to `0px` height.
3. **Offscreen Positions**: Absolute positioning offsets (`left: -9999px`) or Framer Motion transformations translating components out of the viewport.

---

## Part 2: Complete Router Verification

### Step 1: Entry Point Check (`main.jsx` / `index.js`)
Verify that your entire application is wrapped in `<BrowserRouter>`:
```javascript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

### Step 2: Route Definitions Check (`App.jsx`)
Verify matching paths and exact parameters:
```javascript
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AIPage from "./pages/AIPage";
import ViewportPage from "./pages/ViewportPage";
import GamificationPage from "./pages/GamificationPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/ai-computer-vision" element={<AIPage />} />
      <Route path="/live-viewport-rendering" element={<ViewportPage />} />
      <Route path="/hero-point-gamification" element={<GamificationPage />} />
    </Routes>
  );
}
```

### Step 3: Link Paths Checks
Always prepend paths with `/` to avoid relative link breaks in nested routes:
```javascript
// Correct
<Link to="/ai-computer-vision">Learn More</Link>

// Incorrect
<Link to="ai-computer-vision">Learn More</Link>
```

### Step 4: Layout Outlets Checks
If your app registers child routes under a shared layout container, the parent layout **must** render `<Outlet />`:
```javascript
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

function MainLayout() {
  return (
    <div>
      <Navbar />
      <main className="content">
        <Outlet /> {/* Injects child components here */}
      </main>
    </div>
  );
}
```

---

## Part 3: Import / Export Verification

Ensure naming styles match:

### Default Exports
```javascript
// Export
function AIPage() { return <div>AI Page</div>; }
export default AIPage;

// Import
import AIPage from "./pages/AIPage";
```

### Named Exports
```javascript
// Export
export const AIPage = () => { return <div>AI Page</div>; };

// Import
import { AIPage } from "./pages/AIPage";
```

---

## Part 4: Isolation Testing

Replace the blank component rendering with a simple template to isolate router bugs from CSS bugs:

```javascript
function AIPage() {
  return <h1 style={{ padding: "50px", color: "red" }}>Hello World</h1>;
}
export default AIPage;
```

* **"Hello World" is visible**: The router functions correctly. The blank page is caused by local state errors, layout styling, or Framer Motion animation locks.
* **Page remains blank**: The issue is caused by route definitions, nested outlet structures, or named module import mismatches.

---

## Part 5: CSS & Framer Motion Checks

If the HTML elements exist in the DOM (inspect via F12 elements tab) but remain invisible:

1. **Verify Opacity**: Ensure `opacity: 0` is not applied.
2. **Check Height Constraints**: Ensure flex parent height is not collapsed. Add `min-h-screen`.
3. **Verify Framer Motion parameters**:
   ```javascript
   // Correct animation keys
   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
     {children}
   </motion.div>
   ```
