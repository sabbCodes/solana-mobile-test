import { 
  Connection, 
  PublicKey, 
  Keypair,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
  Transaction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';

import { RPC_ENDPOINT } from '../utils/constants';

export const connection = new Connection(RPC_ENDPOINT, 'confirmed');

export async function requestAirdrop(publicKey: PublicKey) {
  const signature = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);
  await connection.confirmTransaction(signature, 'confirmed');
  return signature;
}

export async function buildLegacyTransferTransaction(
  fromPubkey: PublicKey,
  toPubkey: PublicKey,
  lamports: number,
  blockhash: string
): Promise<Transaction> {
  const transaction = new Transaction({
    recentBlockhash: blockhash,
    feePayer: fromPubkey,
  });
  
  transaction.add(
    SystemProgram.transfer({
      fromPubkey,
      toPubkey,
      lamports,
    })
  );
  
  return transaction;
}

export async function buildTransferTransaction(
  fromPubkey: PublicKey,
  toPubkey: PublicKey,
  lamports: number
): Promise<VersionedTransaction> {
  // Get recent blockhash
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  
  // Build instructions
  const instructions = [
    SystemProgram.transfer({
      fromPubkey,
      toPubkey,
      lamports,
    }),
  ];
  
  // Create versioned transaction message
  const messageV0 = new TransactionMessage({
    payerKey: fromPubkey,
    recentBlockhash: blockhash,
    instructions,
  }).compileToV0Message();
  
  // Create unsigned versioned transaction
  return new VersionedTransaction(messageV0);
}