import { transact, Web3MobileWallet } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { toByteArray } from 'react-native-quick-base64';
import { APP_IDENTITY, CLUSTER } from '../utils/constants';
import { PublicKey } from '@solana/web3.js';
import { buildLegacyTransferTransaction, connection } from './useTransactions';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function sendSol(
  recipientAddress: string,
  amountInSol: number,
  fromPubkey: PublicKey
): Promise<string | null> {
  try {
    const cachedToken = await AsyncStorage.getItem('mwa_auth_token');
    const toPubkey = new PublicKey(recipientAddress);
    const lamports = amountInSol * 1_000_000_000;

    // 1. Fetch blockhash FIRST
    console.log('[DEBUG] Pre-fetching blockhash...');
    const { blockhash } = await connection.getLatestBlockhash();

    // 2. Build transaction FIRST
    console.log('[DEBUG] Building transaction...');
    const transaction = await buildLegacyTransferTransaction(fromPubkey, toPubkey, lamports, blockhash);

    return await transact(async (wallet: Web3MobileWallet) => {
      // 3. Authorize/Reauthorize
      console.log('[DEBUG] Wallet session started. Authorizing with token:', cachedToken?.slice(0, 10));
      const authResult = await wallet.authorize({
        identity: APP_IDENTITY,
        chain: CLUSTER,
        auth_token: cachedToken ?? undefined,
      });
      
      console.log('[DEBUG] Authorized. Updated token:', authResult.auth_token?.slice(0, 10));
      await AsyncStorage.setItem('mwa_auth_token', authResult.auth_token);
      
      // 4. SIGN ONLY first (to see if popup appears)
      console.log('[DEBUG] Requesting SIGNATURE...');
      const signedTransactions = await wallet.signTransactions({
        transactions: [transaction],
      });
      
      const signedTx = signedTransactions[0];
      console.log('[DEBUG] Signature SUCCESS! Sending to network...');
      
      // 5. Send manually
      const signature = await connection.sendRawTransaction(signedTx.serialize(), {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
      });
      
      console.log('[DEBUG] Broadcast SUCCESS! Signature:', signature);
      return signature;
    });
  } catch (error: any) {
    console.error('[DEBUG] sendSol failure details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    if (error.code === 4001 || error.name === 'CancellationException') {
      Alert.alert('Cancelled', 'The request was rejected or the session timed out. Please try again.');
    } else if (error.code === -32603) {
      Alert.alert('Failed', 'Transaction simulation failed. Check your balance.');
    } else {
      Alert.alert('Error', error.message || 'An unexpected error occurred.');
    }
    return null;
  }
}

export async function sendAndConfirm(
  recipientAddress: string,
  amountInSol: number,
  fromPubkey: PublicKey
): Promise<string | null> {
  const signature = await sendSol(recipientAddress, amountInSol, fromPubkey);
  if (!signature) return null;
  
  try {
    console.log('[DEBUG] Waiting for confirmation...');
    const confirmation = await connection.confirmTransaction(
      signature,
      'confirmed'
    );
    
    if (confirmation.value.err) {
      throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
    }
    
    console.log('[DEBUG] Transaction confirmed!');
    return signature;
  } catch (error: any) {
    Alert.alert('Confirmation Error', error.message);
    return null;
  }
}