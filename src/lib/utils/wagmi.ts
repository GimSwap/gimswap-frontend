import { http, createConfig, createStorage, noopStorage } from 'wagmi';
import { kaia } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';
import { kaikasConnector } from '@/src/lib/utils/wallets/kaiaWallet';
import { fallback } from 'viem';

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
    [kaia.id]: fallback([
      http('https://public-en.node.kaia.io'),
      http('https://kaia-mainnet.rpc.grove.city/v1/803ceedf'),
      http('https://klaytn.drpc.org'),
      http('https://go.getblock.io/d7094dbd80ab474ba7042603fe912332'),
      http('https://1rpc.io/klay'),
    ]),
  },
  ssr: true,
  storage: createStorage({
    storage: typeof window !== 'undefined' ? window.localStorage : noopStorage,
    key: 'GimSwap',
  }),
  syncConnectedChain: false,
});
