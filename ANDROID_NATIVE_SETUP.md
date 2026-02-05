# Android Native Setup

This guide covers integrating JLaTeXMath for native LaTeX rendering.

## Prerequisites

- Development build (not Expo Go)
- Android Studio
- JDK 11+

## Steps

### 1. Prebuild

```bash
npx expo prebuild
```

### 2. Add JLaTeXMath Dependency

Edit android/app/build.gradle:

```gradle
dependencies {
    implementation 'org.scilab.forge:jlatexmath:1.0.7'
}
```

### 3. Copy Native Files

Copy the files from android-native/ to your Android project:

```
android/app/src/main/java/com/latexrenderer/latex/
  LatexView.kt
  LatexViewManager.kt
  LatexPackage.kt
```

### 4. Register Package

Edit MainApplication.kt:

```kotlin
import com.latexrenderer.latex.LatexPackage

override fun getPackages(): List<ReactPackage> {
    val packages = PackageList(this).packages
    packages.add(LatexPackage())
    return packages
}
```

### 5. Build

```bash
npx expo run:android
```

## Troubleshooting

### JLaTeXMath not found

Ensure the Maven repository is configured in android/build.gradle:

```gradle
allprojects {
    repositories {
        mavenCentral()
    }
}
```

### Rendering issues

Check logcat for errors:

```bash
adb logcat | grep LatexView
```

## Notes

The native renderer uses an LRU cache (100 items max) to avoid re-rendering identical expressions. Clear the cache if memory becomes an issue.
