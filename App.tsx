import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { PublicKey } from '@solana/web3.js';
import { verifyPolyfills } from './src/utils/verifySetup';
import { HomeScreen } from './src/screens/HomeScreen';
import { SendScreen } from './src/screens/SendScreen';

export default function App() {
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [currentScreen, setCurrentScreen] = useState<'home' | 'send'>('home');

  useEffect(() => {
    const ready = verifyPolyfills();
    if (!ready) {
      console.error('Polyfills not loaded correctly!');
    }
  }, []);

  return (
    <View style={styles.container}>
      {currentScreen === 'home' ? (
        <HomeScreen 
          publicKey={publicKey} 
          setPublicKey={setPublicKey}
          onNavigateToSend={() => setCurrentScreen('send')}
        />
      ) : (
        <SendScreen 
          onBack={() => setCurrentScreen('home')} 
          publicKey={publicKey!} 
        />
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
});
