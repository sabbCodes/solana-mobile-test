import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from 'react-native';
import { sendAndConfirm } from '../hooks/useSendSol';
import { PublicKey } from '@solana/web3.js';

interface SendScreenProps {
  onBack: () => void;
  publicKey: PublicKey;
}

export function SendScreen({ onBack, publicKey }: SendScreenProps) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!recipient || !amount) {
      Alert.alert('Missing Info', 'Please provide a recipient and amount.');
      return;
    }

    setSending(true);
    try {
      const signature = await sendAndConfirm(recipient, parseFloat(amount), publicKey);
      if (signature) {
        Alert.alert(
          'Success! 🎉',
          `Transaction confirmed!\n\nSignature:\n${signature.slice(0, 20)}...`,
          [{ text: 'Great!', onPress: onBack }]
        );
      }
    } catch (error: any) {
      console.error('Send Error:', error);
      // Alerts are already handled in useSendSol, 
      // but we catch here to stop the loading state.
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Send SOL</Text>
        <View style={{ width: 60 }} /> 
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Recipient Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Base58 Address"
          value={recipient}
          onChangeText={setRecipient}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Amount (SOL)</Text>
        <TextInput
          style={styles.input}
          placeholder="0.1"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <TouchableOpacity 
          style={[styles.sendButton, sending && styles.sendButtonDisabled]} 
          onPress={handleSend}
          disabled={sending}
        >
          {sending ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.sendButtonText}>Confirm Send 🚀</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#512da8',
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  form: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#fafafa',
  },
  sendButton: {
    backgroundColor: '#00ffa3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
});
