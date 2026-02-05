import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import WebLatexScreen from './src/webview/WebLatexScreen';
import NativeLatexScreen from './src/native/NativeLatexScreen';

export default function App() {
  const [renderer, setRenderer] = useState('webview');

  const switchToNative = () => setRenderer('native');
  const switchToWebView = () => setRenderer('webview');

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" />
        {renderer === 'webview' ? (
          <WebLatexScreen onSwitchRenderer={switchToNative} />
        ) : (
          <NativeLatexScreen onSwitchRenderer={switchToWebView} />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
