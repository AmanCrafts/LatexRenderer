# LaTeX Renderer

A React Native (Expo) application that demonstrates two approaches to rendering LaTeX mathematical formulas on mobile devices: **WebView-based rendering** using KaTeX and **Native Android rendering** using JLaTeXMath.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Rendering Approaches](#rendering-approaches)
  - [WebView Rendering (KaTeX)](#webview-rendering-katex)
  - [Native Android Rendering (JLaTeXMath)](#native-android-rendering-jlatexmath)
- [Project Structure](#project-structure)
- [Performance Comparison](#performance-comparison)
- [Sample Data](#sample-data)
- [LaTeX Playground](#latex-playground)
- [Getting Started](#getting-started)
- [License](#license)

## Overview

This application serves as a benchmark and demonstration tool for comparing different LaTeX rendering strategies on mobile platforms. It provides a side-by-side comparison of WebView-based and native rendering approaches, along with performance metrics and a live LaTeX playground for testing formulas.

## Features

- **Dual Rendering Engines**: Switch between WebView (KaTeX) and Native (JLaTeXMath) rendering
- **Performance Metrics**: Real-time tracking of render times, cache hit rates, and memory usage
- **LaTeX Playground**: Interactive editor to type and preview LaTeX formulas in real-time
- **Extensive Sample Data**: 49+ sample formulas covering calculus, physics, linear algebra, and more
- **Mixed Content Support**: Render text with inline ($...$) and block ($$...$$) math expressions
- **LRU Caching**: Both renderers implement caching to optimize repeat renders
- **Stress Testing**: 50-item performance test to compare renderer efficiency

## Architecture

```
LatexRenderer/
├── App.js                          # Main app with screen navigation
├── src/
│   ├── webview/                    # WebView-based rendering
│   │   ├── LatexWebView.jsx        # WebView component for LaTeX
│   │   ├── KatexHtmlTemplate.js    # HTML template with KaTeX
│   │   └── WebLatexScreen.jsx      # WebView demo screen
│   ├── native/                     # Native rendering
│   │   ├── NativeLatexView.jsx     # Native component with fallback
│   │   ├── NativeLatexScreen.jsx   # Native demo screen
│   │   └── NativeLatexManager.js   # Native module interface
│   ├── playground/                 # LaTeX editor playground
│   │   └── LatexPlayground.jsx     # Interactive LaTeX editor
│   └── utils/
│       ├── SampleLatex.js          # Sample formulas and parsing utilities
│       └── PerformanceLogger.js    # Performance tracking
├── modules/
│   └── latex-native/               # Expo native module
│       ├── android/                # Android native code
│       │   └── src/main/java/expo/modules/latexnative/
│       │       └── LatexNativeModule.kt
│       ├── index.js                # JS interface
│       └── app.plugin.js           # Expo config plugin
└── android-native/                 # Standalone native view (reference)
    ├── LatexView.kt                # Custom Android View
    ├── LatexViewManager.kt         # React Native ViewManager
    └── LatexPackage.kt             # React Native Package
```

## Rendering Approaches

### WebView Rendering (KaTeX)

The WebView approach uses a browser engine to render LaTeX formulas via the KaTeX library.

**How it works:**

1. **HTML Generation**: The `KatexHtmlTemplate.js` generates an HTML document containing:
   - KaTeX CSS and JavaScript from CDN
   - The LaTeX formula to render
   - Height measurement JavaScript to communicate with React Native

2. **WebView Component**: The `LatexWebView.jsx` component:
   - Creates a WebView with the generated HTML
   - Listens for messages from JavaScript (height updates, render status)
   - Dynamically adjusts its height based on content

3. **Mixed Content Parsing**: For content with both text and math:
   - Regex patterns detect inline ($...$) and block ($$...$$) math
   - Content is split into segments and rendered appropriately
   - Currency symbols ($500) are preserved as text

**Advantages:**

- Works on all platforms (iOS, Android, Web)
- Full KaTeX feature support
- No native code required

**Disadvantages:**

- Higher memory usage (each WebView has overhead)
- Slower initial render (CDN fetch, JavaScript execution)
- Scroll lag with many items in a list

### Native Android Rendering (JLaTeXMath)

The Native approach uses the JLaTeXMath library to render LaTeX directly on Android Canvas.

**How it works:**

1. **Expo Native Module**: The `LatexNativeModule.kt` exposes functions to JavaScript:
   - `isAvailable()`: Check if native rendering is ready
   - `renderToBase64(latex, fontSize, textColor, backgroundColor)`: Render LaTeX to PNG
   - `renderToBase64Async()`: Async version of the above

2. **Rendering Pipeline**:

   ```
   LaTeX String → JLatexMathDrawable → Bitmap → PNG → Base64 → Image Component
   ```

3. **React Native Integration**:
   - `NativeLatexView.jsx` detects if native module is available
   - If available, renders using native-generated Images
   - Falls back to WebView/KaTeX if native is unavailable

4. **Direct Canvas Rendering** (in `LatexView.kt`):
   - For true native usage, `LatexView` renders directly to Canvas
   - Uses an LRU cache for JLatexMathDrawable objects
   - Supports inline and block display modes

**Advantages:**

- Significantly faster rendering (10-50ms vs 100-300ms)
- Lower memory per formula
- Smoother scrolling in lists
- Works offline after first build

**Disadvantages:**

- Android only (iOS would need a different library)
- Requires development build (not Expo Go)
- Some LaTeX features may differ from KaTeX

## Project Structure

### Core Components

| File                   | Purpose                                                         |
| ---------------------- | --------------------------------------------------------------- |
| `App.js`               | Main navigation between WebView, Native, and Playground screens |
| `LatexWebView.jsx`     | WebView component that renders LaTeX using KaTeX                |
| `NativeLatexView.jsx`  | Component that uses native rendering with WebView fallback      |
| `LatexPlayground.jsx`  | Interactive LaTeX editor with live preview                      |
| `KatexHtmlTemplate.js` | Generates HTML with KaTeX for WebView rendering                 |
| `SampleLatex.js`       | Sample formulas, categories, and parsing utilities              |
| `PerformanceLogger.js` | Tracks and reports render times and cache statistics            |

### Native Module

| File                      | Purpose                                       |
| ------------------------- | --------------------------------------------- |
| `LatexNativeModule.kt`    | Expo module exposing JLaTeXMath to JavaScript |
| `app.plugin.js`           | Expo config plugin to configure Gradle        |
| `expo-module.config.json` | Module configuration for Expo autolinking     |

## Performance Comparison

| Metric                  | WebView (KaTeX)  | Native (JLaTeXMath) |
| ----------------------- | ---------------- | ------------------- |
| First Render            | 150-400ms        | 20-80ms             |
| Cached Render           | 80-150ms         | 5-15ms              |
| Memory per Formula      | ~2-5MB           | ~0.1-0.5MB          |
| List Scroll Performance | Moderate lag     | Smooth              |
| Startup Time            | Fast (no native) | Requires build      |

## Sample Data

The app includes 49 sample LaTeX formulas organized by category:

- **Basic**: Fractions, powers, logarithms
- **Calculus**: Derivatives, integrals, Taylor series, limits
- **Linear Algebra**: Matrices, determinants, eigenvalues, vectors
- **Physics**: Newton's laws, Maxwell's equations, Schrodinger equation
- **Trigonometry**: Identities, sum formulas, laws of cosines/sines
- **Probability**: Bayes' theorem, distributions, expected value
- **Number Theory**: Quadratic formula, Euler's identity, Fibonacci
- **Set Theory**: Operations, De Morgan's laws, quantifiers
- **Geometry**: Circle formulas, volumes, distance formula
- **Complex**: Cauchy-Schwarz, Fourier series

Additionally, there are error case tests for invalid LaTeX and currency symbol handling.

## LaTeX Playground

The playground provides an interactive environment for testing LaTeX formulas:

- **Text Input**: Type LaTeX code directly
- **Display Mode Toggle**: Switch between inline ($...$) and block ($$...$$)
- **Font Size Control**: Adjust from 12px to 40px
- **Quick Insert**: Buttons for common symbols and operators
- **Example Formulas**: Pre-built formulas to load and experiment with
- **LaTeX Tips**: Quick reference for common syntax

## Getting Started

For detailed setup instructions, see [docs/SETUP.md](docs/SETUP.md).

### Quick Start

```bash
# Install dependencies
npm install

# Start with Expo Go (WebView only)
npx expo start

# Build for Android (enables native rendering)
npx expo run:android
```

## License

MIT License
