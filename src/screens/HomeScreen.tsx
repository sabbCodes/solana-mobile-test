import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { ConnectButton } from '../components/ConnectButton';
import { connection, requestAirdrop } from '../hooks/useTransactions';

interface HomeScreenProps {
  publicKey: PublicKey | null;
  setPublicKey: (pk: PublicKey | null) => void;
  onNavigateToSend: () => void;
}

export function HomeScreen({ publicKey, setPublicKey, onNavigateToSend }: HomeScreenProps) {
  const [balance, setBalance] = useState<number | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [airdropping, setAirdropping] = useState(false);

  const fetchBalance = useCallback(async (addr: PublicKey) => {
    setLoadingBalance(true);
    console.log('Fetching balance for:', addr.toBase58());
    try {
      const bal = await connection.getBalance(addr);
      console.log('Balance fetched:', bal);
      setBalance(bal / LAMPORTS_PER_SOL);
    } catch (e: any) {
      console.error('Failed to fetch balance', e);
      Alert.alert('Network Error', `Could not fetch balance. Check your internet or RPC connection.\n\nError: ${e.message}`);
      setBalance(null);
    } finally {
      setLoadingBalance(false);
    }
  }, []);

  useEffect(() => {
    if (publicKey) {
      fetchBalance(publicKey);
    } else {
      setBalance(null);
    }
  }, [publicKey, fetchBalance]);

  const handleAirdrop = async () => {
    if (!publicKey) return;
    setAirdropping(true);
    try {
      await requestAirdrop(publicKey);
      await fetchBalance(publicKey);
      Alert.alert('Success!', '1 SOL airdropped to your account.');
    } catch (e: any) {
      Alert.alert('Airdrop Failed', e.message);
    } finally {
      setAirdropping(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello, Dr. Sabb!!</Text>
      
      {publicKey ? (
        <View style={styles.content}>
          <View style={styles.statusBox}>
            <Text style={styles.label}>Connected Wallet:</Text>
            <Text style={styles.address}>{publicKey.toBase58()}</Text>
            
            <View style={styles.balanceContainer}>
              <Text style={styles.label}>Balance:</Text>
              {loadingBalance ? (
                <ActivityIndicator size="small" color="#512da8" />
              ) : (
                <Text style={styles.balanceText}>{balance?.toFixed(4) ?? '0'} SOL</Text>
              )}
            </View>
          </View>

          <TouchableOpacity 
            style={styles.airdropButton} 
            onPress={handleAirdrop}
            disabled={airdropping}
          >
            {airdropping ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.airdropButtonText}>Airdrop 1 SOL 🪂</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.sendButton} 
            onPress={onNavigateToSend}
          >
            <Text style={styles.sendButtonText}>Send SOL 💸</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.disconnectButton} 
            onPress={() => setPublicKey(null)}
          >
            <Text style={styles.disconnectButtonText}>Disconnect</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ConnectButton 
          onConnect={(pk) => setPublicKey(pk)} 
          onError={(err) => console.error('Connect Error:', err)} 
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  statusBox: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  balanceContainer: {
    marginTop: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
    width: '100%',
  },
  balanceText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#512da8',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    fontWeight: '600',
    color: '#512da8',
    textAlign: 'center',
  },
  airdropButton: {
    backgroundColor: '#512da8',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  airdropButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  sendButton: {
    backgroundColor: '#00ffa3',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  sendButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '700',
  },
  disconnectButton: {
    padding: 12,
  },
  disconnectButtonText: {
    color: '#ff5252',
    fontSize: 14,
    fontWeight: '600',
  }
});
