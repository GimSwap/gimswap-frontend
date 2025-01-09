import { http, createConfig, createStorage, cookieStorage } from 'wagmi';
import { kaia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { kaikasConnector } from '@/src/lib/utils/wallets/kaiaWallet';
import { fallback } from 'viem';

export const STORE_KEY = 'GimSwap';

export const wagmiConfig = createConfig({
  chains: [kaia],
  connectors: [
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
    // [kairos.id]: fallback([
    //   http('https://responsive-green-emerald.kaia-kairos.quiknode.pro'),
    //   http('https://rpc.ankr.com/klaytn_testnet'),
    //   http('https://public-en.kairos.node.kaia.io'),
    // ]),
  },
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
    key: STORE_KEY,
  }),
  syncConnectedChain: true,
});
