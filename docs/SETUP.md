# Setup Guide

This guide walks you through setting up the LaTeX Renderer project from scratch.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the App](#running-the-app)
  - [Expo Go (WebView Only)](#expo-go-webview-only)
  - [Development Build (Native Support)](#development-build-native-support)
- [Project Configuration](#project-configuration)
- [Native Module Setup](#native-module-setup)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

| Software | Minimum Version | Purpose |
|----------|-----------------|---------|
| Node.js | 18.x or later | JavaScript runtime |
| npm | 9.x or later | Package manager |
| Android Studio | Latest | Android SDK and emulator |
| JDK | 17 | Java Development Kit |

### Android SDK Requirements

1. Open Android Studio
2. Go to **Settings > Languages & Frameworks > Android SDK**
3. Install the following:
   - Android SDK Platform 34 (or latest)
   - Android SDK Build-Tools 34.x.x
   - Android SDK Command-line Tools
   - Android Emulator
   - Android SDK Platform-Tools

### Environment Variables

Add these to your shell profile (~/.zshrc or ~/.bashrc):

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
```

Reload your shell:

```bash
source ~/.zshrc
```

## Installation

### Step 1: Clone or Create Project

```bash
# If cloning existing project
git clone https://github.com/AmanCrafts/LatexRenderer.git
cd LatexRenderer

# If creating from scratch
npx create-expo-app@latest LatexRenderer
cd LatexRenderer
```

### Step 2: Install Dependencies

```bash
npm install
```

The project requires these dependencies:

```json
{
  "dependencies": {
    "expo": "~54.0.33",
    "expo-status-bar": "~3.0.9",
    "react": "19.1.0",
    "react-native": "0.81.5",
    "react-native-safe-area-context": "^5.6.2",
    "react-native-webview": "13.15.0"
  }
}
```

If starting fresh, install the WebView package:

```bash
npx expo install react-native-webview react-native-safe-area-context
```

### Step 3: Verify Installation

```bash
npx expo doctor
```

Fix any issues reported by the doctor command.

## Running the App

### Expo Go (WebView Only)

The quickest way to test the app (WebView rendering only):

```bash
npx expo start
```

Then:
1. Install **Expo Go** on your Android device
2. Scan the QR code from the terminal
3. The app will load with WebView-based LaTeX rendering

Note: Native rendering is NOT available in Expo Go.

### Development Build (Native Support)

For native LaTeX rendering, you need a development build:

#### Option A: Local Build

```bash
# Prebuild the native projects
npx expo prebuild

# Build and run on Android
npx expo run:android
```

#### Option B: EAS Build (Cloud)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build development client
eas build --profile development --platform android

# Install the APK on your device and run
npx expo start --dev-client
```

### Using an Emulator

1. Open Android Studio
2. Go to **Tools > Device Manager**
3. Create or start an emulator (Pixel 6 API 34 recommended)
4. Run the app:

```bash
npx expo run:android
```

### Using a Physical Device

1. Enable **Developer Options** on your Android device
2. Enable **USB Debugging**
3. Connect via USB
4. Verify connection:

```bash
adb devices
```

5. Run the app:

```bash
npx expo run:android
```

## Project Configuration

### app.json

The main Expo configuration file:

```json
{
  "expo": {
    "name": "LatexRenderer",
    "slug": "LatexRenderer",
    "version": "1.0.0",
    "scheme": "latexrenderer",
    "orientation": "portrait",
    "newArchEnabled": true,
    "android": {
      "package": "com.latexrenderer.app"
    },
    "plugins": [
      ["./modules/latex-native/app.plugin.js"]
    ]
  }
}
```

### Gradle Configuration

The native module requires JitPack repository for JLaTeXMath.

In `android/build.gradle`:

```gradle
allprojects {
    repositories {
        google()
        mavenCentral()
        maven { url 'https://www.jitpack.io' }
    }
}
```

In `modules/latex-native/android/build.gradle`:

```gradle
dependencies {
    implementation project(':expo-modules-core')
    implementation "org.jetbrains.kotlin:kotlin-stdlib:1.9.22"
    implementation "ru.noties:jlatexmath-android:0.2.0"
    implementation "ru.noties:jlatexmath-android-font-cyrillic:0.2.0"
    implementation "ru.noties:jlatexmath-android-font-greek:0.2.0"
}
```

## Native Module Setup

The latex-native Expo module provides native LaTeX rendering on Android.

### Module Structure

```
modules/latex-native/
├── android/
│   ├── build.gradle              # Android dependencies
│   └── src/main/java/expo/modules/latexnative/
│       └── LatexNativeModule.kt  # Native implementation
├── app.plugin.js                 # Expo config plugin
├── expo-module.config.json       # Module configuration
├── index.js                      # JavaScript interface
└── package.json                  # Module package info
```

### How the Module Works

1. **Initialization**: JLaTeXMath is initialized when the module loads
2. **Rendering**: LaTeX is rendered to a Bitmap using JLatexMathDrawable
3. **Encoding**: The Bitmap is compressed to PNG and encoded as Base64
4. **Transfer**: The Base64 string is passed to JavaScript
5. **Display**: React Native Image component displays the rendered formula

### JavaScript API

```javascript
import { isNativeAvailable, renderLatexToBase64 } from './modules/latex-native';

// Check if native rendering is available
const available = isNativeAvailable();

// Render LaTeX to Base64 image
const result = await renderLatexToBase64(
    '\\frac{a}{b}',  // LaTeX string
    40,              // Font size
    '#000000',       // Text color
    '#ffffff'        // Background color
);

if (result.success) {
    // Use result.base64 as Image source
    // result.width and result.height contain dimensions
} else {
    // Handle result.error
}
```

### Expo Config Plugin

The `app.plugin.js` automatically configures:
- Settings.gradle: Includes the latex-native project
- Build.gradle: Adds JitPack repository

This runs during `npx expo prebuild`.

## Troubleshooting

### Build Errors

#### "Could not resolve project :expo-modules-core"

```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..
npx expo prebuild --clean
npx expo run:android
```

#### "JLaTeXMath not found"

Ensure JitPack is in all required gradle files:

```gradle
repositories {
    maven { url 'https://jitpack.io' }
}
```

#### "SDK location not found"

Create `android/local.properties`:

```properties
sdk.dir=/path/to/your/Android/sdk
```

### Runtime Errors

#### Native module returns "not available"

1. Ensure you're using a development build (not Expo Go)
2. Check logcat for initialization errors:

```bash
adb logcat | grep -E "LatexNative|JLaTeXMath"
```

#### LaTeX not rendering

1. Check for valid LaTeX syntax
2. Verify network for WebView (KaTeX CDN)
3. For native, check if JLaTeXMath supports the command

### Performance Issues

#### Slow WebView rendering

- Enable hardware acceleration in WebView props
- Reduce number of simultaneous WebViews
- Use FlatList with `windowSize` and `maxToRenderPerBatch`

#### Memory warnings

- Clear caches periodically
- Use the native renderer for large lists
- Monitor with Android Profiler

### Common Commands

```bash
# Clear all caches and rebuild
npx expo prebuild --clean
cd android && ./gradlew clean && cd ..
npx expo run:android

# View Android logs
adb logcat -s ReactNativeJS:V

# Check installed packages
npx expo doctor

# Reset Metro bundler cache
npx expo start --clear

# List connected devices
adb devices
```

## Next Steps

After setup, explore:

1. **WebView Screen**: Compare KaTeX rendering performance
2. **Native Screen**: Test JLaTeXMath rendering (dev build only)
3. **Playground**: Create and test your own LaTeX formulas
4. **Sample Data**: View 49+ example formulas across categories

For more details on the architecture and rendering approaches, see [README.md](../README.md).
