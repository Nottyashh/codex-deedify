export {};

interface SolanaProvider {
  isPhantom?: boolean;
  publicKey?: { toBase58: () => string };
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signAndSendTransaction: (tx: unknown) => Promise<{ signature: string }>;
}

declare global {
  interface Window {
    solana?: SolanaProvider;
  }
}
