import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import WebLatexScreen from './src/webview/WebLatexScreen';
import NativeLatexScreen from './src/native/NativeLatexScreen';
import LatexPlayground from './src/playground/LatexPlayground';

export default function App() {
  const [screen, setScreen] = useState('webview'); // 'webview', 'native', 'playground'

  const renderScreen = () => {
    switch (screen) {
      case 'playground':
        return <LatexPlayground onBack={() => setScreen('webview')} />;
      case 'native':
        return (
          <NativeLatexScreen 
            onSwitchRenderer={() => setScreen('webview')} 
            onOpenPlayground={() => setScreen('playground')}
          />
        );
      case 'webview':
      default:
        return (
          <WebLatexScreen 
            onSwitchRenderer={() => setScreen('native')} 
            onOpenPlayground={() => setScreen('playground')}
          />
        );
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" />
        {renderScreen()}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
