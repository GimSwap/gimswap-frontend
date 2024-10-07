import { http, createConfig, createStorage, noopStorage } from 'wagmi';
import { kaia } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';
import { kaikasConnector } from '@/src/lib/utils/wallets/kaiaWallet';

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
if (!projectId) throw new Error('there is no projectId');

export const wagmiConfig = createConfig({
  chains: [kaia],
  connectors: [
    walletConnect({ projectId }),
    kaikasConnector(),
    injected({ target: 'metaMask', shimDisconnect: true }),
  ],
  transports: {
    [kaia.id]: http(),
  },
  ssr: true,
  storage: createStorage({
    storage: typeof window !== 'undefined' ? window.localStorage : noopStorage,
    key: 'GimSwap',
  }),
  syncConnectedChain: false,
});
