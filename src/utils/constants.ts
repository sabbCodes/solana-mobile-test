export const APP_IDENTITY = {
  name: 'My Solana dApp',
  uri: 'https://mydapp.com',
  icon: 'favicon.ico', // Relative to uri
};

// export const RPC_ENDPOINT = 'https://api.devnet.solana.com';
export const RPC_ENDPOINT = 'https://devnet.helius-rpc.com/?api-key=0956b94b-51c1-4add-a9d0-37ed87d401d6';

export const CLUSTER = 'solana:devnet' as const;

// Alternative endpoints for production
export const MAINNET_RPC = 'https://api.mainnet-beta.solana.com';
export const MAINNET_CLUSTER = 'solana:mainnet' as const;