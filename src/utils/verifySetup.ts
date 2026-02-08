import { Keypair } from '@solana/web3.js';

export function verifyPolyfills(): boolean {
  console.log('--- Checking Polyfills ---');
  try {
    // Test 1: crypto.getRandomValues must work
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    console.log('✓ 1. crypto.getRandomValues pass');
    
    // Test 2: Keypair generation must work
    const keypair = Keypair.generate();
    console.log('✓ 2. Keypair generation pass:', keypair.publicKey.toBase58());
    
    // Test 3: Buffer must work
    const buffer = Buffer.from('test', 'utf-8');
    console.log('✓ 3. Buffer working pass:', buffer.toString('hex'));
    
    // Test 4: TextEncoder must work
    const encoded = new TextEncoder().encode('test');
    console.log('✓ 4. TextEncoder working pass:', encoded.length, 'bytes');
    
    console.log('--------------------------');
    return true;
  } catch (error) {
    console.error('Polyfill verification failed:', error);
    console.log('--------------------------');
    return false;
  }
}