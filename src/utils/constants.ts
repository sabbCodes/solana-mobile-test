export const APP_IDENTITY = {
  name: 'My Solana dApp',
  uri: 'https://mydapp.com',
  icon: 'favicon.ico', // Relative to uri
};

export const RPC_ENDPOINT = 'https://api.devnet.solana.com';


export const CLUSTER = 'solana:devnet' as const;

// Alternative endpoints for production
export const MAINNET_RPC = 'https://api.mainnet-beta.solana.com';
export const MAINNET_CLUSTER = 'solana:mainnet' as const;